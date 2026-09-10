import { createFileRoute } from "@tanstack/react-router";
import { appApi } from "@/server/app-api";

export const Route = createFileRoute("/api/v1/$name")({
  server: {
    handlers: {
      POST: ({ request, params }) => appApi.http(request, params.name),
    },
  },
});
