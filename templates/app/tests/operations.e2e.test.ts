import {
  Client,
  StreamableHTTPClientTransport,
} from "@modelcontextprotocol/client";
import { describe, expect, it } from "vitest";
import { chromium } from "playwright";

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
      const headers = {
        cookie,
        origin: new URL(origin).origin,
        "content-type": "application/json",
      };
      const http = await fetch(new URL("/api/v1/currentActor", origin), {
        method: "POST",
        headers,
        body: "{}",
        redirect: "error",
      });
      expect(http.status).toBe(200);
      const result = await http.json();
      expect(result.actor.actorId).toBeTruthy();

      const browser = await chromium.launch({ headless: true });
      try {
        const context = await browser.newContext();
        await context.addCookies(
          cookie.split(";").map((part) => {
            const separator = part.indexOf("=");
            return {
              name: part.slice(0, separator).trim(),
              value: part.slice(separator + 1).trim(),
              url: origin,
            };
          }),
        );
        const page = await context.newPage();
        await page.goto(origin);
        expect(new URL(page.url()).origin).toBe(new URL(origin).origin);
        const browserResult = await page.evaluate(async () => {
          const response = await fetch("/api/v1/currentActor", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: "{}",
          });
          return { status: response.status, body: await response.json() };
        });
        expect(browserResult).toEqual({ status: 200, body: result });
      } finally {
        await browser.close();
      }

      const client = new Client({ name: "app-base-e2e", version: "1" });
      try {
        await client.connect(
          new StreamableHTTPClientTransport(new URL("/api/mcp", origin), {
            requestInit: {
              headers: { cookie, origin: new URL(origin).origin },
              redirect: "error",
            },
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
