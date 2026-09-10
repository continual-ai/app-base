import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { afterEach, describe, expect, it, vi } from "vitest";
import { z } from "zod";
import { createOperationApi } from "../src/server/api";
import {
  defineOperation,
  OperationError,
  type OperationContext,
} from "../src/server/operation";
import { operations } from "../src/server/operations";

const clients: Client[] = [];
afterEach(async () => {
  await Promise.all(clients.splice(0).map((client) => client.close()));
});

function context(actorId = "alice"): OperationContext {
  return {
    actor: { actorId, name: actorId, email: null },
    // These fixtures exercise app-owned operations, which do not call platform tools.
    continual: {} as OperationContext["continual"],
  };
}

function fixture() {
  const records = new Map<string, string>();
  const schema = z.object({ value: z.string() });
  const write = vi.fn(
    async ({
      input,
      context,
    }: {
      input: { value: string };
      context: OperationContext;
    }) => {
      records.set(context.actor.actorId, input.value);
      return input;
    },
  );
  const registry = {
    ...operations,
    write: defineOperation({
      description: "Save a value",
      input: schema,
      output: schema,
      handler: write,
    }),
    read: defineOperation({
      description: "Read your value",
      input: z.object({}),
      output: schema,
      annotations: { readOnlyHint: true },
      handler: async ({ context }) => ({
        value: records.get(context.actor.actorId) ?? "",
      }),
    }),
    fail: defineOperation({
      description: "Fail safely",
      input: z.object({}),
      output: z.object({}),
      handler: async () => {
        throw new Error("database password secret");
      },
    }),
    conflict: defineOperation({
      description: "Report conflict",
      input: z.object({}),
      output: z.object({}),
      handler: async () => {
        throw new OperationError("Already exists.", 409);
      },
    }),
    invalidOutput: defineOperation({
      description: "Return invalid output",
      input: z.object({}),
      output: z.object({ value: z.string().min(1) }),
      handler: async () => ({ value: "" }),
    }),
  };
  const authenticate = vi.fn(async (request: Request) => {
    const actor = request.headers.get("x-test-actor");
    if (!actor) throw new Error("private auth details");
    return context(actor);
  });
  return {
    api: createOperationApi(registry, authenticate),
    authenticate,
    write,
  };
}

function request(name: string, input: unknown = {}, actor = "alice") {
  return new Request(`http://localhost/api/operations/${name}`, {
    method: "POST",
    headers: { "content-type": "application/json", "x-test-actor": actor },
    body: JSON.stringify(input),
  });
}

async function connect(
  api: ReturnType<typeof createOperationApi>,
  actor = "alice",
) {
  const client = new Client({ name: "test", version: "1" });
  clients.push(client);
  await client.connect(
    new StreamableHTTPClientTransport(new URL("http://localhost/api/mcp"), {
      fetch: async (url, init) => {
        const req = new Request(url, init);
        req.headers.set("x-test-actor", actor);
        return api.mcp(req);
      },
    }),
  );
  return client;
}

describe("shared operations", () => {
  it("serves legacy MCP initialization, discovery, and calls without sessions", async () => {
    const { api } = fixture();
    const rpc = async (method: string, params: unknown) => {
      const response = await api.mcp(
        new Request("http://localhost/api/mcp", {
          method: "POST",
          headers: {
            "content-type": "application/json",
            accept: "application/json, text/event-stream",
            "x-test-actor": "alice",
            "mcp-protocol-version": "2025-11-25",
          },
          body: JSON.stringify({ jsonrpc: "2.0", id: 1, method, params }),
        }),
      );
      expect(response.status).toBe(200);
      const body = await response.text();
      return JSON.parse(
        body.startsWith("event:")
          ? body
              .split("\n")
              .find((line) => line.startsWith("data: "))!
              .slice(6)
          : body,
      );
    };
    expect(
      (
        await rpc("initialize", {
          protocolVersion: "2025-11-25",
          capabilities: {},
          clientInfo: { name: "legacy", version: "1" },
        })
      ).result.protocolVersion,
    ).toBe("2025-11-25");
    expect(
      (await rpc("tools/list", {})).result.tools.some(
        (tool: { name: string }) => tool.name === "currentActor",
      ),
    ).toBe(true);
    expect(
      (await rpc("tools/call", { name: "currentActor", arguments: {} })).result
        .structuredContent,
    ).toEqual({ actor: context().actor });
  });

  it("discovers schemas and shares writes between HTTP and a real MCP client", async () => {
    const { api } = fixture();
    const client = await connect(api);
    const { tools } = await client.listTools();
    expect(
      tools.find((tool) => tool.name === "write")?.inputSchema,
    ).toMatchObject({ properties: { value: { type: "string" } } });
    expect(
      tools.find((tool) => tool.name === "read")?.annotations?.readOnlyHint,
    ).toBe(true);
    expect(
      (await api.http(request("write", { value: "from HTTP" }), "write"))
        .status,
    ).toBe(200);
    expect(
      (await client.callTool({ name: "read", arguments: {} }))
        .structuredContent,
    ).toEqual({ value: "from HTTP" });
    expect(
      (
        await client.callTool({
          name: "write",
          arguments: { value: "from MCP" },
        })
      ).isError,
    ).not.toBe(true);
    expect(await (await api.http(request("read"), "read")).json()).toEqual({
      value: "from MCP",
    });
  });

  it("keeps concurrent callers isolated", async () => {
    const { api } = fixture();
    const [alice, bob] = await Promise.all([connect(api), connect(api, "bob")]);
    await Promise.all([
      alice.callTool({ name: "write", arguments: { value: "alice's" } }),
      bob.callTool({ name: "write", arguments: { value: "bob's" } }),
    ]);
    expect(
      (await alice.callTool({ name: "read", arguments: {} })).structuredContent,
    ).toEqual({ value: "alice's" });
    expect(
      (await bob.callTool({ name: "currentActor", arguments: {} }))
        .structuredContent,
    ).toEqual({ actor: context("bob").actor });
  });

  it("rejects invalid input before invoking the handler on either interface", async () => {
    const { api, write } = fixture();
    const client = await connect(api);
    expect(
      (await api.http(request("write", { value: 42 }), "write")).status,
    ).toBe(400);
    const result = await client.callTool({
      name: "write",
      arguments: { value: 42 },
    });
    expect(result.isError).toBe(true);
    expect(write).not.toHaveBeenCalled();
  });

  it("returns safe failures and validates output on both interfaces", async () => {
    const { api } = fixture();
    const client = await connect(api);
    for (const name of ["fail", "invalidOutput", "conflict"]) {
      const response = await api.http(request(name), name);
      expect(response.status).toBe(name === "conflict" ? 409 : 500);
      const expected =
        name === "conflict"
          ? "Already exists."
          : "The operation could not be completed.";
      expect(await response.json()).toEqual({ error: expected });
      expect(await client.callTool({ name, arguments: {} })).toMatchObject({
        isError: true,
        content: [{ type: "text", text: expected }],
      });
    }
  });

  it("rejects unauthenticated requests, including MCP discovery", async () => {
    const { api } = fixture();
    expect((await api.http(request("read", {}, ""), "read")).status).toBe(401);
    const response = await api.mcp(
      new Request("http://localhost/api/mcp", { method: "POST", body: "{}" }),
    );
    expect(response.status).toBe(401);
    expect(await response.json()).toEqual({
      error: "Continual authentication is required.",
    });
  });

  it("rejects cross-origin requests before authentication", async () => {
    const { api, authenticate } = fixture();
    const req = request("write", { value: "bad" });
    req.headers.set("origin", "https://other.example");
    expect((await api.http(req, "write")).status).toBe(403);
    expect((await api.mcp(req)).status).toBe(403);
    expect(authenticate).not.toHaveBeenCalled();
  });

  it("handles malformed JSON and unknown/prototype operation names", async () => {
    const { api } = fixture();
    const req = new Request("http://localhost/api/operations/write", {
      method: "POST",
      headers: { "x-test-actor": "alice" },
      body: "{",
    });
    expect((await api.http(req, "write")).status).toBe(400);
    for (const name of ["missing", "toString", "__proto__"]) {
      expect((await api.http(request(name), name)).status).toBe(404);
    }
  });
});
