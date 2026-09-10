# App development

This file applies to this App. Keep it current with the App's purpose, implementation,
commands, and data/access rules as the product develops. Follow the root AGENTS.md for
project-wide context and conventions. Paths below are relative to this directory.

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
The primitive APIs below cover normal usage; read their source only when customizing behavior.
All support `className` and their element's normal props.

| Import path under `@/components/ui/` | Exports and common props                                                   |
| ------------------------------------ | -------------------------------------------------------------------------- |
| `button`                             | `Button`: `variant="default                                                | outline                                                                                        | secondary | ghost | destructive | link"`, `size="default | xs   | sm                                  | lg  | icon | icon-xs | icon-sm | icon-lg"`, `asChild` for links |
| `badge`                              | `Badge`: same variants as Button, `asChild`                                |
| `card`                               | `Card` (`size="default                                                     | sm"`), `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter` |
| `input`, `textarea`, `label`         | `Input`, `Textarea`, `Label`; connect labels with `htmlFor` and input `id` |
| `separator`                          | `Separator` from Radix; horizontal by default                              |
| `icon`                               | `Icon`: `name="search                                                      | plus                                                                                           | close     | check | arrowRight  | chevronDown            | star | mapPin"`; decorative, no dependency |

```tsx
<Button type="button" variant="outline"><Icon name="plus" />Add item</Button>
<Button type="button" size="icon" aria-label="Close"><Icon name="close" /></Button>
```

Reuse these icons when they fit; add only the missing icons the product needs.
Use `bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, and
`bg-primary text-primary-foreground` with the existing semantic tokens.
Add further primitives when needed using the checked-in shadcn configuration.
Preserve accessible labels, keyboard interaction, visible focus, and contrast.
Do not add a dashboard, generic CRUD framework, or business model by default.

## Server boundary

Use TanStack server routes or server functions. Browser code calls relative app
URLs; serve from `/` in both development and production.
Use the SDK caller identity in managed previews as well as production; never replace it with
a shared development owner. Verify data-backed flows through the authenticated stable URL.
Keep `GET /api/health` dependency-free and preserve the root route's
`initDesignMode()` and `initTelemetry()` browser initialization.

Use a stable `{ error: string }` response. Return 400 for malformed JSON and invalid
request shapes. Show explicitly safe validation messages; use a friendly generic message
for unexpected server/database failures. Never return raw exception messages or stack traces.

## Shared backend operations and MCP

Implement JSON business reads and writes with `defineOperation` in `src/server/operation.ts`
and register them in `src/server/operations.ts`. Every registered operation is available as
`POST /api/v1/<name>` and as an MCP tool at `/api/mcp`. Reuse the handler; do not
maintain a second MCP implementation or register internal-only helpers.

`/api/mcp` is already wired: `src/routes/api.mcp.ts` delegates to `appApi.mcp`, and
`src/server/app-api.ts` binds the shared registry to the authenticated context. Adding an entry
in `src/server/operations.ts` exposes it through both transports; no new MCP route or server is
needed. Arbitrary server routes are not discovered automatically. See the root README's **Backend
operations and MCP** section for a complete registration example.

Use Zod JSON object input/output schemas, a useful description, and accurate MCP annotations.
`context.actor` is the caller verified by Continual; `context.continual` is the request-scoped
SDK client. Enforce business authorization in the handler, use the actor for attribution,
and own any needed database transactions there. MCP annotations are hints, not enforcement.
Never substitute a development owner or accept a caller-supplied actor ID as authentication.

Throw `OperationError` only for safe user-facing failures (400/403/404/409). Other errors and
invalid outputs receive a generic error. Keep raw request handlers for health, uploads,
webhooks, and other non-operation endpoints. Keep all `src/server` imports out of browser
code; browser consumers call relative URLs. Do not loosen Vite's host checks or the trusted
Continual front-Worker boundary; see the root README for unmanaged hosting.

Run `pnpm test`, `pnpm check`, and `pnpm build` when changing these adapters. Tests use the
real MCP SDK client and Fetch handler. `RUN_E2E_TESTS=1` enables the opt-in development-App
authentication test documented in the root README; never use production cookies or credentials.

## Optional database

The base includes `@neondatabase/serverless` as a runtime dependency. Database access remains
opt-in: set `continual.database: true` in the App package only when it uses the Branch database.
Use the installed driver for server-side queries and add versioned migrations for App-owned tables.

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
