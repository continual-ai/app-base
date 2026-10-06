import type { AuthenticatedActor } from "@continual/sdk/app";
import type { McpServer, ToolAnnotations } from "@modelcontextprotocol/server";
import { z } from "zod";
import type { createContinual } from "./continual";

export interface OperationContext {
  /** Public origin established by request authentication, never forwarded headers. */
  origin?: string;
  actor: AuthenticatedActor;
  continual: ReturnType<typeof createContinual>;
}

/** Only explicitly safe application errors may cross either transport. */
export class OperationError extends Error {
  constructor(
    message: string,
    readonly status: 400 | 403 | 404 | 409,
  ) {
    super(message);
  }
}

export function operationError(error: unknown) {
  return error instanceof OperationError
    ? { status: error.status, error: error.message }
    : { status: 500, error: "The operation could not be completed." };
}

export interface Operation {
  invoke(
    input: unknown,
    context: OperationContext,
    name?: string,
  ): Promise<Record<string, unknown>>;
  register(server: McpServer, name: string, context: OperationContext): void;
}

/** Define JSON object inputs/outputs once for both HTTP and MCP. */
export function defineOperation<
  Input extends z.ZodObject,
  Output extends z.ZodObject,
>(definition: {
  description: string;
  input: Input;
  output: Output;
  annotations?: ToolAnnotations;
  handler(args: {
    input: z.output<Input>;
    context: OperationContext;
  }): Promise<z.input<Output>>;
}): Operation {
  // Fail at registration for schemas that cannot be described over JSON (e.g. Date/transforms).
  z.toJSONSchema(definition.input);
  z.toJSONSchema(definition.output);

  const invoke: Operation["invoke"] = async (
    input,
    context,
    name = "unnamed",
  ) => {
    const parsed = await definition.input.safeParseAsync(input);
    if (!parsed.success)
      throw new OperationError("Invalid operation input.", 400);
    const result = await definition.handler({ input: parsed.data, context });
    const output = await definition.output.safeParseAsync(result, {
      reportInput: true,
    });
    if (!output.success) {
      // Log schema diagnostics only: values and custom validation messages may contain secrets.
      console.error("Operation output validation failed", {
        operation: name,
        issues: output.error.issues.map((issue) => ({
          path: issue.path,
          code: issue.code,
          ...(issue.code === "invalid_type"
            ? {
                expected: issue.expected,
                received:
                  issue.input instanceof Date
                    ? "Date"
                    : issue.input === null
                      ? "null"
                      : Array.isArray(issue.input)
                        ? "array"
                        : typeof issue.input,
              }
            : {}),
        })),
      });
      throw new Error("Operation output validation failed");
    }
    return output.data;
  };

  return {
    invoke,
    register(server, name, context) {
      server.registerTool<z.ZodObject, z.ZodObject>(
        name,
        {
          description: definition.description,
          inputSchema: definition.input,
          outputSchema: definition.output,
          annotations: definition.annotations,
        },
        async (input) => {
          try {
            const output = await invoke(input, context, name);
            return {
              content: [{ type: "text", text: JSON.stringify(output) }],
              structuredContent: output,
            };
          } catch (error) {
            return {
              isError: true,
              content: [{ type: "text", text: operationError(error).error }],
            };
          }
        },
      );
    },
  };
}
