# Project guide

This is starter guidance. Once the project's purpose and scope are established, rewrite this
file as the actual project guide: purpose, users, existing Apps and paths, shared conventions,
and cross-App workflows. Replace generic starter prose rather than appending another guide.
Preserve relevant workspace commands and constraints, and derive details from the user and
repository. Keep implementation guidance in each App's `AGENTS.md`. Keep this guide current
when requirements change or Apps are added or removed.

A minimal TanStack Start repository that can be used as a GitHub template or cloned to start a
project. README files are optional: add one when it would help the project's users or maintainers.
Keep necessary agent guidance here or in the App-local `AGENTS.md`, not dependent on a README.

## Workspace

- Runnable Apps live in `apps/<app-key>/`. Read the target App's `AGENTS.md` before editing it.
- Edit existing Apps in place; preserve their keys, identity, framework, and data.
- For a new App, read `templates/app/AGENTS.md`, choose an App key and display name based on
  the user's request, then confirm `apps/<app-key>/` does not already exist before copying the template.
  Then run `mkdir -p apps` and `cp -R templates/app apps/<app-key>`.
  In the copied `package.json`, set `name` and `continual.key` to the chosen key and
  `continual.name` to the display name before installing dependencies. Never copy over an existing
  App. Keep the source template free of dependencies, generated files, and secrets.
- Keep the template available for future Apps. Do not change it when implementing an individual
  App, rename an existing App to create another one, or generate a separate framework scaffold.

## Shared commands

Use Node.js 24+ and the pinned pnpm version. The root owns the workspace and lockfile.
After creating an App, run `pnpm install`. If adding dependencies at the same time, use
`pnpm --dir apps/<app-key> add <package>` instead; it also updates the lockfile. Do not do both
without intervening manifest changes.

Root `make format`, `pnpm check`, `pnpm test`, and `pnpm build` cover the workspace.
For one App, run its scripts with `pnpm --dir apps/<app-key>`.
Run `make format` before pushing or creating/updating a PR.

The committed lockfile covers the initial `app` key; other keys require updating it during
installation. CI copies the template into `apps/app/` before frozen-lockfile installation, checks,
tests, and production build. The template itself is not a runnable or registered App.
`pnpm check` checks formatting and TypeScript, and `pnpm build` emits each App's Nitro Cloudflare
artifact in `.output/`. `pnpm format` formats source and configuration.

## Template maintenance

Continual dependencies are pinned in the App package manifest. Update the manifest and lockfile
together, then verify development, route generation, checks, and the production artifact. CI runs
without platform credentials. The CLI and SDK versions in `templates/app/package.json` are the
source of truth.

Based on the TanStack template in
[continual-ai/app-templates](https://github.com/continual-ai/app-templates/tree/0885a3e47d150a5c6dfa2abcd34056c60c2925e2/templates/tanstack-start-app).
The build convention follows [Company OS](https://github.com/continual-ai/company-os).
