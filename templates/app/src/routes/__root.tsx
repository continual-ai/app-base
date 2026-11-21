import { initDesignMode, initTelemetry } from "@continual/sdk/app-preview";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRoute,
} from "@tanstack/react-router";
import { useEffect } from "react";
import { THEME_SCRIPT } from "@/lib/theme";
import "@/styles/global.css";

export const Route = createRootRoute({
  head: () => ({
    links: [{ rel: "icon", type: "image/svg+xml", href: "/favicon.svg" }],
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
    // The theme script puts `dark` on <html> before hydration.
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <HeadContent />
      </head>
      <body>
        <Outlet />
        <Scripts />
      </body>
    </html>
  );
}
