# Project guide

Keep this file about the actual project. As requirements become known, record its purpose,
users, existing Apps and paths, shared conventions, and cross-App workflows here. Derive these
from the user and repository; do not invent project requirements. Keep implementation details
in each App's `AGENTS.md` and update the App list when adding or removing an App.

## Workspace

- Runnable Apps live in `apps/<app-key>/`. Read the target App's `AGENTS.md` before editing it.
- Edit existing Apps in place; preserve their keys, identity, framework, and data.
- For a new App, run `pnpm create-app <app-key> "Display name"`. It copies the reusable
  `templates/app/` starter, including its `AGENTS.md`, and refuses existing destinations.
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
