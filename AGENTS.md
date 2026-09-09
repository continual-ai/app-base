# Working in App Base

All Apps live in `apps/<app-key>/` (`/project/apps/<app-key>` in the sandbox).
The starter is `apps/app/`. Build directly in it; before first registration, choose the stable
key and use `git mv apps/app apps/<app-key>` if changing `app`. Update that package's
`name`, `continual.key`, and `continual.name` together, then run `pnpm install` at the root
to update the lockfile. Preserve the key for an already registered App.
Use TanStack Start/Router, React, TypeScript, and Tailwind v4.

## Commands

- Use Node.js 24+ and the pinned pnpm version. Install at the repository root.
- Root `make format`, `pnpm check`, and `pnpm build` cover the workspace.
- App formatting scripts explicitly load `../../.prettierignore`; preserve that path so
  checks after a build exclude generated output.
- For one App, use `pnpm --dir apps/<app-key> dev`, `check`, or `build`.
- `pnpm --dir apps/<app-key> run deploy` checks, builds, and invokes the CLI.
- For ordinary page edits, format and check once, then verify the dev preview. Build for
  publication or changes to dependencies, server behavior, routing configuration, or build wiring.
- Typechecking generates `src/routeTree.gen.ts`; never edit it.
- Run `make format` before pushing or creating/updating a PR.

## File map

Paths below are relative to `apps/<app-key>/`.

| Concern                                    | File                                             |
| ------------------------------------------ | ------------------------------------------------ |
| Home page                                  | `src/routes/index.tsx`                           |
| Document, metadata, favicon, preview hooks | `src/routes/__root.tsx`                          |
| Liveness endpoint                          | `src/routes/api.health.ts`                       |
| Router                                     | `src/router.tsx`                                 |
| Global styles and tokens                   | `src/styles/global.css`, `src/styles/tokens.css` |
| UI primitives and class helper             | `src/components/ui/`, `src/lib/utils.ts`         |
| Static assets                              | `public/`                                        |
| Framework and build configuration          | `vite.config.ts`                                 |

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
