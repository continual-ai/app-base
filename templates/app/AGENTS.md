# App development

Read the root `AGENTS.md` first for project context and shared conventions. This file supplies
starter implementation guidance; paths below are relative to this directory.

After creating `apps/<app-key>/`, once the App's purpose and scope are established, rewrite the
copied `AGENTS.md` as that App's guide: behavior, implementation, commands, data, and access rules.
Replace generic starter prose; preserve applicable technical constraints, including shared HTTP/MCP
registration, identity, database bindings, and build commands. Keep the guide current as the App
evolves. Rewrite only the App-local copy; keep `templates/app/AGENTS.md` reusable for future Apps.

Use TanStack Start/Router, React, TypeScript, Vite, and Tailwind v4. The starter includes Inter
typography, the design system's tokens, source-owned UI primitives, the design kit's blocks, and SDK
preview hooks in the root route. It prescribes no navigation, database schema, business model,
authentication UI, or sample data. `components.json` configures shadcn for extending the primitives.

## Commands

- Use Node.js 24+ and the pinned pnpm version. Install at the repository root.
- Root `make format`, `pnpm check`, and `pnpm build` cover the workspace.
- App formatting scripts explicitly load `../../.prettierignore`; preserve that path so
  checks after a build exclude generated output.
- The dev server defaults to http://localhost:9999; add `--port 3000` to use another port.
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

| Concern                                     | File                                             |
| ------------------------------------------- | ------------------------------------------------ |
| Home page                                   | `src/routes/index.tsx`                           |
| Document, metadata, favicon, preview hooks  | `src/routes/__root.tsx`                          |
| Light and dark, and the person's choice     | `src/lib/theme.ts`                               |
| Liveness endpoint                           | `src/routes/api.health.ts`                       |
| Router                                      | `src/router.tsx`                                 |
| Global styles and tokens                    | `src/styles/global.css`, `src/styles/tokens.css` |
| UI primitives and class helper              | `src/components/ui/`, `src/lib/utils.ts`         |
| Design kit blocks                           | `src/components/kit/`                            |
| Operations from the browser, signed-in user | `src/lib/operations.ts`, `src/lib/use-viewer.ts` |
| Static assets                               | `public/`                                        |
| Framework and build configuration           | `vite.config.ts`                                 |

## UI

Replace the neutral home page with the requested product. Choose navigation,
layout, data model, and workflows to fit its users. Add code only as needed.
Use the source-owned primitives in `src/components/ui/`, `cn` in
`src/lib/utils.ts`, and semantic tokens in `src/styles/tokens.css`.
The primitive APIs below cover normal usage; read their source only when customizing behavior.
UI primitives support `className` and their element's normal props.

| Import path under `@/components/ui/` | Exports and common props                                                                                                                                                              |
| ------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `button`                             | `Button`: variants `default`, `outline`, `secondary`, `ghost`, `destructive`, `link`; sizes `default`, `xs`, `sm`, `lg`, `icon`, `icon-xs`, `icon-sm`, `icon-lg`; `asChild` for links |
| `badge`                              | `Badge`: same variants as Button, `asChild`                                                                                                                                           |
| `card`                               | `Card` (sizes `default`, `sm`), `CardHeader`, `CardTitle`, `CardDescription`, `CardAction`, `CardContent`, `CardFooter`                                                               |
| `input`, `textarea`, `label`         | `Input`, `Textarea`, `Label`; connect labels with `htmlFor` and input `id`                                                                                                            |
| `separator`                          | `Separator` from Radix; horizontal by default                                                                                                                                         |
| `table`                              | `Table`, `TableHeader`, `TableBody`, `TableRow`, `TableHead`, `TableCell`, `TableCaption`; scroll container included                                                                  |
| `sheet`                              | `Sheet`, `SheetTrigger`, `SheetClose`, `SheetContent` (side `left` or `right`), `SheetTitle`, `SheetDescription`; include a title                                                     |
| `icon`                               | `Icon`: names `search`, `plus`, `close`, `check`, `arrowRight`, `chevronDown`, `star`, `mapPin`, `menu`; decorative, no dependency                                                    |

```tsx
<Button type="button" variant="outline"><Icon name="plus" />Add item</Button>
<Button type="button" size="icon" aria-label="Close"><Icon name="close" /></Button>
```

Reuse these icons when they fit. For any other icon, import it from `lucide-react` (already a
dependency) instead of drawing paths.
Add further primitives when needed using the checked-in shadcn configuration.
Design the main screen at 360px wide first, then widen. The page must never scroll sideways.
Screens are checked at 360px: no sideways scroll, no primary list table showing less than 60%
of its width on a phone, and no side rail below `lg`.
Use `min-w-0` on flex and grid children holding text; wrap or truncate long values.

Preserve accessible labels, keyboard interaction, visible focus, and contrast.
Do not add a dashboard, generic CRUD framework, or business model by default.

## Design system

Every App shares one design system: tokens in `src/styles/tokens.css`, primitives in
`src/components/ui/`, and blocks in `src/components/kit/` (import them from `@/components/kit`).
It should feel calm, exact and quiet: gray canvas, white cards with hairline edges, one accent,
13px type, and motion that confirms rather than performs.
Run `pnpm run kit:check` before calling a screen done; `pnpm check` runs it too.

### Rules

- Compose screens from kit blocks and `ui/` primitives before writing new components.
  New components reuse the same tokens and anatomy.
- Never use raw colors (`#hex`, `rgb()`, `bg-[...]`, `text-red-500`): use the tokens' classes, such as
  `bg-card`, `bg-canvas`, `bg-tray`, `text-strong`, `text-soft`, `text-muted-foreground`,
  `border-line`, `bg-brand`, `text-brand-ink`, `bg-tone-red-soft text-tone-red`.
- Never use `text-[Npx]` or Tailwind's `text-sm`-style sizes: use `text-caption` 12, `text-small` 13
  (almost everything), `text-title` 15, `text-heading` 20, `text-display` 24 and `text-metric` 28;
  `text-micro` 10 only inside avatars.
- Weight 500 (`font-medium`) is the only emphasis; 600 only on avatars and marks; never bold.
  Figures get `tabular-nums`; number columns set `align: "end"`.
- Never add custom shadows or borders around cards: `shadow-surface` for cards and fields,
  `shadow-raised` for menus, `border-line` only to divide inside a card.
- Glass (`glass`) only for what floats over the App: toasts, sheets and popovers. Never on cards,
  tables or anything people read at length. Sheets and toasts already use it.
- Radii: `rounded-sm` for chips and keys, `rounded-md` for controls, `rounded-xl` for cards,
  `rounded-3xl` for trays.
- One accent per App, used sparingly: the selected item, counts, links and the first chart series.
  The primary button is the dark `default` variant; status tones (red, amber, green, blue, gray)
  always show their label too.
- Light and dark come for free. `AppShell` and `AppHeader` show a `ThemePicker` (Automatic, Light,
  Dark) beside the person signed in; keep it there. Automatic follows Continual inside Continual
  and the device elsewhere (`src/lib/theme.ts`). Use the tokens, never `bg-white`, `text-black`
  or hex colors, so both stay readable.
- The App's mark is an icon for what it does, passed as `icon` to `AppShell` or `AppHeader`: a
  `lucide-react` export such as `Receipt` for invoices, `Truck` for deliveries or `Megaphone` for
  campaigns. Never the company's initial.
- An agent is always `AgentMark`, never a sparkle, robot or person's avatar.
- Motion: `duration-150 ease-kit` for hover and press, `motion-safe:animate-kit-enter` for things
  that appear, `motion-safe:animate-kit-stagger` with `style={stagger(index)}` for the rows of a
  list as a view opens, `motion-safe:animate-kit-rise` for something floating into place. The
  kit's lists, boards, trails, bars, sheets and toasts already move; nothing loops except loading
  and a working agent's mark, and nothing makes people wait to act.

### Blocks

| Block                                | Use it for                                                                |
| ------------------------------------ | ------------------------------------------------------------------------- |
| `AppShell`, `PanelHeader`            | The frame: sidebar sections on the canvas, the App on an inset panel      |
| `AppHeader`, `BrandMark`             | A top bar instead, for a single-screen App                                |
| `ThemePicker`                        | Light, dark or automatic; already in `AppShell` and `AppHeader`           |
| `PageHeader`, `SectionHeader`        | A view's title and one line on its purpose; headings inside a view        |
| `KpiTiles`                           | Two to four stat cards, each with a note, `trend` and optional `spark`    |
| `TrendChart`, `Breakdown`, `Heatmap` | A line or bar trend; how a total splits; values by row and period         |
| `FilterChips`                        | A segmented control of filters above a list, with `counts`                |
| `RecordsTable`, `RecordName`         | The primary list; compact rows on phones; `RecordName` opens the record   |
| `BoardView`, `BoardCard`             | Stages as columns of cards on trays                                       |
| `QueueList`, `QueueProgress`         | A review queue with progress; `useQueueKeys` adds j, k and a              |
| `DetailPanel`, `RecordDetail`        | The selected record: side panel on wide screens, sheet on phones          |
| `DraftCard`, `Tray`, `Kbd`           | Anything prepared for review, on a tray, with Approve (⌘↵), Edit and Skip |
| `AgentMark`, `AgentTrail`            | An agent, and the steps it took toward one goal                           |
| `ActivityFeed`, `ChangeList`         | What the last run did; what changed, with Undo on each change             |
| `AutonomyDial`, `StepList`           | How much an agent does alone; an ordered ladder such as escalation steps  |
| `StatusPill`, `Tone`                 | A record's status, one tone per status                                    |
| `Avatar`, `Person`                   | People as initials on a tint picked from their name                       |
| `RelativeDate`, `Delta`, `Sparkline` | "3 days ago" with the date on hover, signed changes, tiny trends          |
| `EmptyState`, `Skeleton`, `Toast`    | Nothing to show yet, placeholders while loading, confirmations with Undo  |

`useViewer` (`@/lib/use-viewer`) gives the signed-in person and `callOperation`
(`@/lib/operations`) calls the App's operations from the browser.

### Screens that fit agent work

Most Apps track records while an agent works on them. Build from these screens, keeping only the
ones the App needs:

- **Overview**: `KpiTiles`, one chart (`TrendChart`, `Breakdown` or `Heatmap`), the records that
  need attention, and what waits on the person.
- **Needs you**: a `QueueList` of what the agent prepared, each opening an `AgentTrail` of how it got
  there and a `DraftCard`; the next item opens after a decision.
- **Records**: `FilterChips`, then `RecordsTable` (or `BoardView` for stages), with `RecordDetail` in
  a `DetailPanel`.
- **Run**: what the agent did on its last run (`ActivityFeed`) and what it changed (`ChangeList` with
  Undo).
- **Rules**: an `AutonomyDial` and a `StepList` of what the agent does at each step.

### The company's color

- Each App wears one accent: `indigo`, `blue`, `teal`, `green`, `amber`, `orange`, `rose` or
  `violet`, set with `useAccent` (which puts `data-accent` on `<html>`).
- Pick the accent closest to the company's brand color.
  For an exact brand color, add one more `[data-accent="…"]` block in `tokens.css` with the same
  variables, and check its text contrast is at least 4.5:1.
- Charts keep their own palette (`chartColor`); status tones stay the same in every accent.

### Every state

- Empty: an `EmptyState` that says what is missing and offers the one action that helps.
- Loading: `RecordsTable` and `KpiTiles` take `loading`; use `Skeleton` sized like the content.
- Decisions: a `Toast` that says what happened, with Undo when it can be taken back.
- Errors: a `Toast` in plain words with `"failed"` as its tone, and the change put back.

### Before calling an App ready

Look at it at 390px and 1440px wide, in light and dark, and check:

- Nothing scrolls sideways or overlaps, and long names wrap instead of clipping.
- Every control is at least 36px tall on phones, with a visible focus ring.
- The view's title, its key numbers and its main action are obvious at a glance.
- Empty, loading and error states read as designed, not as blank space.
- `pnpm run kit:check` passes.

Blocks are this App's own source; edit them freely for this App and write new components in the
same style. Apps that are not about tracking records, such as a public page, a storefront or a
calculator, still use the tokens and primitives, but design their screens for their purpose.

## Server boundary

Use TanStack server routes or server functions. Browser code calls relative app
URLs; serve from `/` in both development and production.
Use the SDK caller identity in managed previews as well as production; never replace it with
a shared development owner. Verify data-backed flows through the authenticated stable URL.
Keep `GET /api/health` dependency-free and preserve the root route's
`initDesignMode()` and `initTelemetry()` browser initialization exactly, with no arguments.
Removing `initDesignMode()` disables design mode and preview feedback. Continual's App panel
negotiates the feedback editor with the installed SDK, so the call never changes. If the preview
shows an in-App feedback toolbar, or feedback boxes stay put while the App scrolls, the dev server
is serving `@continual/sdk` older than 0.5.9: check the installed version, reinstall
dependencies, and restart the dev server with Vite's dependency cache cleared (`vite dev --force`,
or delete `node_modules/.vite`) instead of editing the call. A plain restart can keep serving the
old pre-bundled SDK.

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
published Apps use Continual's identity; there is no local shared-owner fallback. The Continual
preview panel automatically supplies the signed-in user's App session. This backend authentication
requirement does not introduce another user login: do not add an App login screen or tell an
already signed-in user to log in again. Diagnose identity, session, routing, or API failures instead.

For testing in the separate sandbox browser, follow `browser-use` to establish that browser's
session yourself with `continual.apps.authUrl()`.
Without credentials, the UI and `/api/health` still work at the application layer, while operation
endpoints return 401; a private App's front Worker also enforces access before forwarding requests.

**Connect at your stable App URL:** `https://<app-hostname>/api/mcp`. Continual agent sessions
can discover published App endpoints through the platform. Other MCP clients must supply
credentials accepted by the Continual front Worker; merely knowing the URL is not a login.
This template does not implement a standalone OAuth authorization server or accept arbitrary
bearer tokens. Customize `src/server/context.ts` when using another identity provider.

Host validation is provided by Vite's configured `allowedHosts` in development and Continual's
front Worker in production. The adapters compare browser Origin with the HTTPS host in the runtime assertion after
`auth.me()` verifies it. They do not trust Host or X-Forwarded-Host as origin authority. If you
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

### Applying migrations

Shell calls do not retain a previous `cd`. Run SQL files with absolute App paths and stop on errors:

```sh
psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f /project/apps/<app-key>/migrations/001_create_tables.sql
```

Apply actual migration files in order before starting code that depends on them. If the App owns a
migration script, use `pnpm --dir /project/apps/<app-key> run db:migrate`.

## Build and hosting

The pinned `@continual/tanstack-start/vite` adapter owns framework integration
and emits Nitro `.output/`. Do not add a Wrangler configuration, a dry-run bundle,
or a direct provider deployment command. Keep controlled sandbox preview hosts in
`vite.config.ts`; extend with `CONTINUAL_ALLOWED_DEV_HOSTS` if needed rather than
setting `allowedHosts: true`.

## Continual environment

In a Continual sandbox, credentials are supplied automatically. Follow the
platform's `app-development`, `browser-use`, and `continual-platform-sdk-cli` skills for
previews, verification, and publication. No additional login is needed.

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

## Generated connector tools and scripts

Configure typed tool calls in `src/server/continual.ts`. Generate the required catalog in this App,
import `projectToolCatalog` there, and pass it to `createAppServerClient({ request, toolCatalog:
projectToolCatalog })`. Keep the factory return type inferred; `OperationContext` derives its client
type from that factory. Do not annotate it as plain `AppServerClient`, which drops catalog methods.

Include every tool the workflow calls when generating a filtered catalog. Selecting only a Drive
Connection does not include `platform.automations_run`; include that platform tool too. Missing
namespaces require regenerating the catalog, not inventing interfaces or casting the client.

Run TypeScript scripts from this App with `pnpm run script scripts/example.ts` (or
`pnpm exec tsx scripts/example.ts`). The installed runner resolves the generated modules' `.js`
imports to their TypeScript sources. Do not use plain Node or Node's type stripping to execute
uncompiled generated catalogs. Run from the App directory so its dependencies resolve.
