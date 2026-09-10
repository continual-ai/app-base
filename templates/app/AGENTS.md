# App development

Read the root `AGENTS.md` first for project context and shared conventions. This file supplies
starter implementation guidance; paths below are relative to this directory.

After creating `apps/<app-key>/`, once the App's purpose and scope are established, rewrite the
copied `AGENTS.md` as that App's guide: behavior, implementation, commands, data, and access rules.
Replace generic starter prose; preserve applicable technical constraints, including shared HTTP/MCP
registration, identity, database bindings, and build commands. Keep the guide current as the App
evolves. Rewrite only the App-local copy; keep `templates/app/AGENTS.md` reusable for future Apps.

Use TanStack Start/Router, React, TypeScript, Vite, and Tailwind v4. The starter includes Geist
typography, semantic design tokens, source-owned UI primitives, and SDK preview hooks in the root
route. It prescribes no navigation, database schema, business model, authentication UI, or sample
data. `components.json` configures shadcn for extending the primitives.

## Commands

- Use Node.js 24+ and the pinned pnpm version. Install at the repository root.
- Root `make format`, `pnpm check`, and `pnpm build` cover the workspace.
- App formatting scripts explicitly load `../../.prettierignore`; preserve that path so
  checks after a build exclude generated output.
- The dev server defaults to http://localhost:9999; add `--port 3000` to use another port.
- `pnpm --dir apps/<app-key> preview` builds and serves the production artifact locally.
- Use `pnpm run deploy` explicitly; `pnpm deploy` is also a pnpm workspace command.
- Generated routes and build artifacts are ignored. Route generation runs before typechecking,
  so adding a route does not require a dev server.
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
and register them in `src/server/operations.ts`. Keep all `src/server` imports out of browser code.
`src/routes/api.mcp.ts` delegates to `appApi.mcp`; `src/server/app-api.ts` binds the registry to
the authenticated context. No separate MCP wiring is needed. Reuse handlers across transports.
Run `pnpm test`, `pnpm check`, and `pnpm build` when changing the adapters.

The starter exposes **one shared implementation through HTTP and MCP**, using the official
MCP TypeScript SDK. `src/server/operations.ts` contains a working `currentActor` operation.
Its HTTP endpoint is `POST /api/v1/currentActor` with `{}` as the JSON body; its MCP
tool name is `currentActor`, served at `/api/mcp`.

Add operations to that registry (paths below are relative to `apps/<app-key>/`):

```ts
import { z } from "zod";
import { defineOperation } from "./operation";

export const operations = {
  // Keep currentActor or replace it with your app's operations.
  greet: defineOperation({
    description: "Greet the authenticated caller by name.",
    input: z.object({ greeting: z.string().min(1).max(100) }),
    output: z.object({ message: z.string() }),
    annotations: {
      readOnlyHint: true,
      destructiveHint: false,
      idempotentHint: true,
    },
    handler: async ({ input, context }) => ({
      message: `${input.greeting}, ${context.actor.name}!`,
    }),
  }),
};
```

The operation is now both `POST /api/v1/greet` and MCP tool `greet`. No extra route
or tool registration is needed. From browser code:

```ts
const response = await fetch("/api/v1/greet", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ greeting: "Hello" }),
});
const result = await response.json();
if (!response.ok) throw new Error(result.error);
```

Use JSON-compatible Zod object schemas; dates should be strings, and schemas must support
JSON Schema generation (no transforms, `Date`, `BigInt`, or functions). Names must contain
1–64 letters, digits, underscores, or hyphens. Outputs are validated too. The HTTP response
is the output object directly; MCP returns it as structured content and JSON text.

Every registry entry is exposed, including writes. Put only intended public operations in
this registry, describe effects accurately, and enforce app-specific permissions inside the
handler. Set read-only/destructive/idempotent annotations accurately; they do not enforce
permissions or make writes transactional. Use `context.actor` for attribution and
`context.continual` for platform calls. Database transactions belong to the handler.
Throw `new OperationError("Safe message", 409)` for an expected conflict (400/403/404 are
also supported). Unexpected failures return a generic error without exception details.

Authentication is required for both interfaces, including MCP discovery. The template
calls `createAppServerClient({ request }).auth.me()` once per request. Managed previews and
published Apps use Continual's identity; there is no local shared-owner fallback. Without
credentials, the UI and `/api/health` still work, while operation endpoints return 401.

**Connect at your stable App URL:** `https://<app-hostname>/api/mcp`. Continual agent sessions
can discover published App endpoints through the platform. Other MCP clients must supply
credentials accepted by the Continual front Worker; merely knowing the URL is not a login.
This template does not implement a standalone OAuth authorization server or accept arbitrary
bearer tokens. Customize `src/server/context.ts` when using another identity provider.

Host validation is provided by Vite's configured `allowedHosts` in development and Continual's
front Worker in production. The adapters also reject cross-origin browser requests. If you
host the server outside those environments, configure an explicit trusted Host allowlist at
your ingress and replace the authentication adapter before exposing it. Do not forward
untrusted `x-continual-*` headers to the SDK. The endpoint is stateless: tools are intended for
ordinary request/response operations, not persistent sessions or background subscriptions.
Health checks, uploads, webhooks, and arbitrary server routes are not automatically MCP tools.

Run `pnpm test` for protocol, validation, error, and caller-isolation coverage. To verify real
identity through both deployed routes, use a **development App** and its authenticated browser
cookie (keep it in your shell, never in source; never use production cookies or credentials):

```sh
RUN_E2E_TESTS=1 APP_E2E_URL=https://<development-app-hostname> \
  pnpm --dir apps/<app-key> test tests/operations.e2e.test.ts
```

Set `APP_E2E_COOKIE` in the environment before running that command. The test is read-only
and compares `currentActor` through HTTP and the official MCP client. Ordinary CI does not
call Continual or require credentials.

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

## Continual environment

In a Continual sandbox, credentials are supplied automatically. Follow the
platform's `app-development` and `continual-platform-sdk-cli` skills for preview
registration, browser verification, and publication. No additional login is needed.

On your own machine, use `pnpm exec continual login` and
`pnpm exec continual link` as needed; inspect each command's `--help`.
Never commit `.continual/` or local environment files.
The base runs and builds without Continual credentials.

Server routes use `createAppServerClient({ request })` from
`@continual/sdk/app`. Browser code calls relative app routes. App identity and
credentials stay on the server.

## Browser tooling

The App includes `playwright` as a pinned dev dependency, so scripts can use normal
`import { chromium } from "playwright"` imports and `pnpm --dir apps/<app-key> exec playwright`.
Keep its version aligned with the Continual sandbox base image. Managed sandboxes reuse
preinstalled Chromium through `PLAYWRIGHT_BROWSERS_PATH`; no browser download is needed there.
Outside the sandbox, install Chromium with `pnpm --dir apps/<app-key> exec playwright install chromium`.
