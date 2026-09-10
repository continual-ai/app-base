import { createFileRoute } from "@tanstack/react-router";
import { appApi } from "@/server/app-api";

export const Route = createFileRoute("/api/mcp")({
  server: {
    handlers: {
      GET: ({ request }) => appApi.mcp(request),
      POST: ({ request }) => appApi.mcp(request),
      DELETE: ({ request }) => appApi.mcp(request),
    },
  },
});
