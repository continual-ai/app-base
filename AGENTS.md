# Working in App Base

This repository is one runnable TanStack Start app at its root. Build the requested
product directly in `src/`; do not create another scaffold or copy the app into a
nested directory. Use TanStack Start/Router, React, TypeScript, and Tailwind v4.

## Workflow

- Use Node.js 24+ and the pinned pnpm version. Install at the repository root.
- Read `package.json` for commands. Use `pnpm dev` (0.0.0.0:9999), `pnpm check`,
  `pnpm build`, and `pnpm preview`. Override a port with `pnpm dev --port 3000`.
- Set the permanent `continual.key` and user-facing `continual.name` before the
  first preview or publication. Preserve the key for an existing app.
- Use the platform-provided `app-development` skill for sandbox server management,
  preview registration, browser verification, and committing/pushing work.
  Use `continual-platform-sdk-cli` for SDK calls and deployment contracts.
  These skills are supplied by the platform; do not vendor copies here.
- Inspect the diff after editing. Sequence edits to the same file.
- Run `pnpm check` and `pnpm build` after routing, dependency, or build changes.
  Verify rendered behavior in a browser. Test observable behavior where useful.
- `pnpm check` regenerates `src/routeTree.gen.ts` before TypeScript; never edit it.
- Run `make format` before pushing or creating/updating a PR.

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

For platform calls, construct a request-scoped client in a server handler:

```ts
import { createAppServerClient } from "@continual/sdk/app";

const continual = createAppServerClient({ request });
const actor = await continual.auth.me();
```

Do not cache the client across requests. Keep credentials, runtime identity headers,
and database connection strings out of browser code, responses, logs, and source.
Never use a `VITE_*` variable for a server secret. Preserve safe SDK error messages
in a stable `{ error: string }` response; never return credentials or stack traces.
Do not use the removed `@continual/sdk/server-client` API.

## Optional database

The base does not request database access or install a database driver.
When needed, set `continual.database` to `true`, add
`@neondatabase/serverless`, and check in migrations. Read the platform database
skill reference before changing shared Branch data.

Read local server values from `process.env.DATABASE_URL` and optional
`process.env.DATABASE_SCHEMA`. For published Cloudflare Workers, use runtime
bindings from `cloudflare:workers`; keep that import in the production server
path and add binding types when introducing it. The adapter's native development
server is not a Cloudflare Worker. Never import Worker-only modules into an
unconditional development path or bake environment values into the build.

Fail clearly if the requested database route has no URL. Prefer Neon's HTTP client
for one-shot queries and non-interactive transactions. Create clients per request;
close a Pool before returning. Do not cache clients or connection strings globally.
Use schema-qualified SQL and versioned migrations; execute migrations deliberately
before publication once database support exists. Do not rely on session search paths
or the legacy Hyperdrive `DATABASE.connectionString` binding.

## Preview and publication

The pinned `@continual/tanstack-start/vite` adapter owns framework integration
and emits Nitro `.output/`. Do not add a Wrangler configuration, a dry-run bundle,
or a direct provider deployment command. Keep controlled sandbox preview hosts in
`vite.config.ts`; extend with `CONTINUAL_ALLOWED_DEV_HOSTS` if needed rather than
setting `allowedHosts: true`.

For a sandbox preview, start and verify the dev server, expose its port, then run
`pnpm exec continual deploy --url <exposed-url> --json` from this directory.
Use the existing App key. This changes active Branch routing; the platform skill
covers preview pinning and private-app sign-in. No login is needed when the
sandbox execution token is present.

Publish only when requested. After verification and pushing the source, use
`pnpm run deploy`: it checks and builds before invoking the CLI. The CLI itself
does not build. Use `pnpm exec continual deploy --help` for supported flags.
Verify the returned stable URL and health endpoint after publication.
Do not commit dependencies, generated output, `.continual/`, or environment files.
