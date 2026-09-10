import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { describe, expect, it } from "vitest";

/** Use a development App's stable URL and an authenticated development browser cookie. */
describe.skipIf(!process.env.RUN_E2E_TESTS)(
  "deployed operation interfaces",
  () => {
    it("resolves the same real caller over HTTP and MCP", async () => {
      const origin = process.env.APP_E2E_URL;
      const cookie = process.env.APP_E2E_COOKIE;
      if (!origin || !cookie)
        throw new Error(
          "Set APP_E2E_URL and APP_E2E_COOKIE for a development App.",
        );
      const headers = { cookie, "content-type": "application/json" };
      const http = await fetch(
        new URL("/api/operations/currentActor", origin),
        {
          method: "POST",
          headers,
          body: "{}",
          redirect: "error",
        },
      );
      expect(http.status).toBe(200);
      const result = await http.json();
      expect(result.actor.actorId).toBeTruthy();

      const client = new Client({ name: "app-base-e2e", version: "1" });
      try {
        await client.connect(
          new StreamableHTTPClientTransport(new URL("/api/mcp", origin), {
            requestInit: { headers: { cookie }, redirect: "error" },
          }),
        );
        expect(
          (await client.listTools()).tools.some(
            (tool) => tool.name === "currentActor",
          ),
        ).toBe(true);
        expect(
          (await client.callTool({ name: "currentActor", arguments: {} }))
            .structuredContent,
        ).toEqual(result);
      } finally {
        await client.close();
      }
    }, 30_000);
  },
);
