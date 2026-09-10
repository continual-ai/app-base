import { createFileRoute } from "@tanstack/react-router";
import { appApi } from "@/server/app-api";

export const Route = createFileRoute("/api/operations/$name")({
  server: {
    handlers: {
      POST: ({ request, params }) => appApi.http(request, params.name),
    },
  },
});
