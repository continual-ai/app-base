# App Base

A minimal, ready-to-edit TanStack Start app for Continual. Use this repository as a
GitHub template, clone your copy, and build your product in `apps/<app-key>/src/`.

## Start

Use Node.js 24+ and pnpm 11.3.0.

Choose an unused App key; do not copy over an existing App. For the initial `app` key:

```sh
mkdir -p apps
cp -R templates/app apps/app
pnpm install
pnpm --dir apps/app dev
```

For another key, copy to `apps/<app-key>/` and update the copied `package.json` fields:
`name` and `continual.key` must use the chosen key, and `continual.name` is the display name.
Do this before `pnpm install`, which updates the workspace lockfile. The committed lockfile
covers the initial `app` key. Open http://localhost:9999 and edit the App's `src/routes/index.tsx`.

`templates/app/` is the reusable source-only starter, outside the runnable workspace. Keep it free
of dependencies, generated files, and secrets. Keep it for future Apps; edit existing Apps in place
and preserve their keys after registration. Do not rename or clone an existing App for a new one.
The root `AGENTS.md` holds project context, the App list, and shared conventions; update it as
the project develops. Each App inherits `templates/app/AGENTS.md` for its implementation guidance
and should adapt that copy to its own behavior. The repository root owns the workspace and lockfile. CI creates an App from the template before
checking and building it, so the template is verified without registering it as an App.

## Commands

| Command                                     | Behavior                                                    |
| ------------------------------------------- | ----------------------------------------------------------- |
| `pnpm --dir apps/<app-key> dev`             | Start the development server on port 9999                   |
| `pnpm --dir apps/<app-key> dev --port 3000` | Use a different port                                        |
| `pnpm check`                                | Check formatting, generate routes, and check TypeScript     |
| `pnpm build`                                | Build the Nitro Cloudflare artifact in `.output/`           |
| `pnpm --dir apps/<app-key> preview`         | Build and serve the production artifact locally             |
| `pnpm --dir apps/<app-key> run deploy`      | Check, build, then publish through the pinned Continual CLI |
| `pnpm format`                               | Format source and configuration                             |

Use `pnpm run deploy` explicitly; `pnpm deploy` is also a pnpm workspace command.
Generated routes and build artifacts are ignored. Route generation runs before
typechecking, so adding a route does not require a dev server.

## What's included

TanStack Start and Router, React, Vite, Tailwind CSS v4, Geist typography, semantic
design tokens, and seven source-owned UI primitives in `src/components/ui/`.
The Continual SDK preview hooks initialize in the root route.
`GET /api/health` is a dependency-free liveness endpoint. Shared JSON operations are served
through HTTP and MCP, with a `currentActor` example.

The app has no prescribed navigation, dashboard, database schema, business model,
authentication UI, or sample data. Add features and dependencies when needed.
`components.json` configures shadcn for extending the local primitives.

## Backend operations and MCP

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
cookie (keep it in your shell, never in source):

```sh
RUN_E2E_TESTS=1 APP_E2E_URL=https://<development-app-hostname> \
  pnpm --dir apps/<app-key> test tests/operations.e2e.test.ts
```

Set `APP_E2E_COOKIE` in the environment before running that command. The test is read-only
and compares `currentActor` through HTTP and the official MCP client. Ordinary CI does not
call Continual or require credentials.

## Continual

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

Database access is opt-in. Add `continual.database: true` only when the app
uses the Branch database, then add versioned migrations. The Neon driver
(`@neondatabase/serverless`) is already included as a runtime dependency.
Continual supplies `DATABASE_URL` and optional `DATABASE_SCHEMA`; see
the App's `AGENTS.md` for server-side usage.

## Browser tooling

The App includes `playwright` as a pinned dev dependency, so scripts can use normal
`import { chromium } from "playwright"` imports and `pnpm --dir apps/<app-key> exec playwright`.
Keep its version aligned with the Continual sandbox base image. Managed sandboxes reuse
preinstalled Chromium through `PLAYWRIGHT_BROWSERS_PATH`; no browser download is needed there.
Outside the sandbox, install Chromium with `pnpm --dir apps/<app-key> exec playwright install chromium`.

## Maintenance

Continual dependencies are pinned to published versions: CLI 0.5.11, SDK 0.5.5,
and TanStack adapter 0.1.3. Update the manifest and lockfile together, then verify
development, route generation, checks, and the production artifact. CI runs the
format/type checks and build without platform credentials.

Based on the TanStack template in
[continual-ai/app-templates](https://github.com/continual-ai/app-templates/tree/0885a3e47d150a5c6dfa2abcd34056c60c2925e2/templates/tanstack-start-app).
The current build convention follows
[Company OS](https://github.com/continual-ai/company-os).
