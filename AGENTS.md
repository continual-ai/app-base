# Working in App Base

This repository is one runnable TanStack Start app at its root. Build the requested
product directly in `src/`; do not create another scaffold or copy the app into a
nested directory. Use TanStack Start/Router, React, TypeScript, and Tailwind v4.

## Sources of truth

Read the platform-provided `app-development` skill for the development workflow,
including App identity, sandbox server management, preview registration, browser
verification, committing/pushing, and publication. Read `continual-platform-sdk-cli`
for SDK usage, authentication, deployment contracts, and its database reference
before adding database access or changing shared Branch data.

Those skills own the shared platform guidance; this file owns repository-specific
commands and conventions. The platform supplies these skills; do not vendor copies
into this repository.

## Commands

- Use Node.js 24+ and the pinned pnpm version. Install at the repository root.
- Read `package.json` for commands. Use `pnpm dev` (0.0.0.0:9999), `pnpm check`,
  `pnpm build`, and `pnpm preview`. Override a port with `pnpm dev --port 3000`.
- Run `pnpm check` and `pnpm build` after routing, dependency, or build changes.
- `pnpm check` regenerates `src/routeTree.gen.ts` before TypeScript; never edit it.
- Run `make format` before pushing or creating/updating a PR.
- For publication, `pnpm run deploy` checks and builds before invoking the CLI.

## UI

Replace the neutral home page with the requested product. Choose navigation,
layout, data model, and workflows to fit its users. Add code only as needed.
Use the source-owned primitives in `src/components/ui/`, `cn` in
`src/lib/utils.ts`, and semantic tokens in `src/styles/tokens.css`.
Add further primitives when needed using the checked-in shadcn configuration.
Preserve accessible labels, keyboard interaction, visible focus, and contrast.
Do not add a dashboard, generic CRUD framework, or business model by default.

## Server boundary

Use TanStack server routes or server functions. Browser code calls relative app
URLs; serve from `/` in both development and production.
Keep `GET /api/health` dependency-free and preserve the root route's
`initDesignMode()` and `initTelemetry()` browser initialization.

Preserve safe SDK error messages in a stable `{ error: string }` response;
never return credentials or stack traces.

## Optional database

The base does not request database access or install a database driver.

Read local server values from `process.env.DATABASE_URL` and optional
`process.env.DATABASE_SCHEMA`. For published Cloudflare Workers, use runtime
bindings from `cloudflare:workers`; keep that import in the production server
path and add binding types when introducing it. The adapter's native development
server is not a Cloudflare Worker. Never import Worker-only modules into an
unconditional development path or bake environment values into the build.

Fail clearly if the requested database route has no URL.

## Build and hosting

The pinned `@continual/tanstack-start/vite` adapter owns framework integration
and emits Nitro `.output/`. Do not add a Wrangler configuration, a dry-run bundle,
or a direct provider deployment command. Keep controlled sandbox preview hosts in
`vite.config.ts`; extend with `CONTINUAL_ALLOWED_DEV_HOSTS` if needed rather than
setting `allowedHosts: true`.
