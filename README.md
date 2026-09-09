# App Base

A minimal, ready-to-edit TanStack Start app for Continual. Use this repository as a
GitHub template, clone your copy, and build your product directly in `src/`.

## Start

Use Node.js 24+ and pnpm 11.3.0.

```sh
pnpm install --frozen-lockfile
pnpm dev
```

Open http://localhost:9999. Replace `src/routes/index.tsx` with your app.
Before its first preview registration or deployment, set `continual.key` and
`continual.name` in `package.json` to the app's permanent key and display name.
Keep the key stable after registration. The package name is independent of that key.

## Commands

| Command                | Behavior                                                    |
| ---------------------- | ----------------------------------------------------------- |
| `pnpm dev`             | Start the development server on port 9999                   |
| `pnpm dev --port 3000` | Use a different port                                        |
| `pnpm check`           | Check formatting, generate routes, and check TypeScript     |
| `pnpm build`           | Build the Nitro Cloudflare artifact in `.output/`           |
| `pnpm preview`         | Build and serve the production artifact locally             |
| `pnpm run deploy`      | Check, build, then publish through the pinned Continual CLI |
| `pnpm format`          | Format source and configuration                             |

Use `pnpm run deploy` explicitly; `pnpm deploy` is also a pnpm workspace command.
Generated routes and build artifacts are ignored. Route generation runs before
typechecking, so adding a route does not require a dev server.

## What's included

TanStack Start and Router, React, Vite, Tailwind CSS v4, Geist typography, semantic
design tokens, and seven source-owned UI primitives in `src/components/ui/`.
The Continual SDK preview hooks initialize in the root route.
`GET /api/health` is a dependency-free liveness endpoint.

The app has no prescribed navigation, dashboard, database schema, business model,
authentication UI, or sample data. Add features and dependencies when needed.
`components.json` configures shadcn for extending the local primitives.

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
uses the Branch database, then add its driver and versioned migrations.
Continual supplies `DATABASE_URL` and optional `DATABASE_SCHEMA`; see
`AGENTS.md` for server-side usage.

## Maintenance

Continual dependencies are pinned to published versions: CLI 0.5.11, SDK 0.5.5,
and TanStack adapter 0.1.3. Update the manifest and lockfile together, then verify
development, route generation, checks, and the production artifact. CI runs the
format/type checks and build without platform credentials.

Based on the TanStack template in
[continual-ai/app-templates](https://github.com/continual-ai/app-templates/tree/0885a3e47d150a5c6dfa2abcd34056c60c2925e2/templates/tanstack-start-app).
The current build convention follows
[Company OS](https://github.com/continual-ai/company-os).
