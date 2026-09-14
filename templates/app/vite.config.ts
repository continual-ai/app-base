import { defineConfig } from "@continual/tanstack-start/vite";

export default defineConfig({
  nitro: {
    commands: {
      deploy: "pnpm exec continual deploy",
    },
    framework: {
      deployCommand: "pnpm run deploy",
    },
  },
  vite: {
    server: {
      allowedHosts: [
        ".continual.site",
        ".continual.run",
        ".tensorlake.ai",
        ".e2b.app",
        ".proxy.daytona.work",
        ".modal.host",
        ...(process.env.CONTINUAL_ALLOWED_DEV_HOSTS?.split(",")
          .map((host) => host.trim())
          .filter(Boolean) ?? []),
      ],
    },
  },
});
