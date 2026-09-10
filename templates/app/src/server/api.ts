import { createMcpHandler, McpServer } from "@modelcontextprotocol/server";
import type { Operation, OperationContext } from "./operation";
import { operationError } from "./operation";

const json = (body: unknown, status = 200) =>
  Response.json(body, { status, headers: { "cache-control": "no-store" } });

/** Both adapters use the same request authentication, validation, and implementation. */
export function createOperationApi(
  operations: Record<string, Operation>,
  authenticate: (request: Request) => Promise<OperationContext>,
) {
  for (const name of Object.keys(operations)) {
    if (!/^[a-zA-Z0-9_-]{1,64}$/.test(name)) {
      throw new Error(`Invalid operation name: ${name}`);
    }
  }

  async function withContext(
    request: Request,
    handle: (context: OperationContext) => Promise<Response>,
  ) {
    let context: OperationContext;
    try {
      context = await authenticate(request);
    } catch {
      return json({ error: "Continual authentication is required." }, 401);
    }
    // Authentication resolves the public origin from verified runtime identity.
    // Host/X-Forwarded-Host are not authority for browser origin checks.
    const origin = request.headers.get("origin");
    if (
      origin !== null &&
      origin !== (context.origin ?? new URL(request.url).origin)
    ) {
      return json({ error: "Cross-origin requests are not allowed." }, 403);
    }
    try {
      return await handle(context);
    } catch (error) {
      const failure = operationError(error);
      return json({ error: failure.error }, failure.status);
    }
  }

  return {
    http(request: Request, name: string) {
      return withContext(request, async (context) => {
        if (request.method !== "POST") {
          return new Response(null, {
            status: 405,
            headers: { allow: "POST" },
          });
        }
        if (!Object.hasOwn(operations, name))
          return json({ error: "Operation not found." }, 404);
        let input: unknown;
        try {
          input = await request.json();
        } catch {
          return json({ error: "Expected a JSON request body." }, 400);
        }
        return json(await operations[name].invoke(input, context));
      });
    },
    mcp(request: Request) {
      return withContext(request, async (context) => {
        // A fresh handler keeps caller identity out of process-global/session state.
        const handler = createMcpHandler(() => {
          const server = new McpServer({ name: "app", version: "1.0.0" });
          for (const [name, operation] of Object.entries(operations)) {
            operation.register(server, name, context);
          }
          return server;
        });
        try {
          const response = await handler.fetch(request);
          response.headers.set("cache-control", "no-store");
          return response;
        } finally {
          await handler.close();
        }
      });
    },
  };
}
