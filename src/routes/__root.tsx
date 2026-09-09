import { initDesignMode, initTelemetry } from "@continual/sdk/app-preview";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { useEffect } from "react";
import "@/styles/global.css";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Continual App" },
    ],
  }),
  component: Root,
});

function Root() {
  useEffect(() => {
    initDesignMode();
    initTelemetry();
  }, []);

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
