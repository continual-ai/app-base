# Project guide

This is starter guidance. Once the project's purpose and scope are established, rewrite this
file as the actual project guide: purpose, users, existing Apps and paths, shared conventions,
and cross-App workflows. Replace generic starter prose rather than appending another guide.
Preserve relevant workspace commands and constraints, and derive details from the user and
repository. Keep implementation guidance in each App's `AGENTS.md`. Keep this guide current
when requirements change or Apps are added or removed.

## Workspace

- Runnable Apps live in `apps/<app-key>/`. Read the target App's `AGENTS.md` before editing it.
- Edit existing Apps in place; preserve their keys, identity, framework, and data.
- For a new App, first read `templates/app/AGENTS.md`. Confirm `apps/<app-key>/` does not exist,
  then run `mkdir -p apps` and `cp -R templates/app apps/<app-key>`.
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
