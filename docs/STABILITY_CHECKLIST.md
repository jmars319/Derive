# Stability Checklist

Use this checklist before expanding product logic beyond the scaffold.

- `pnpm install` succeeds from the repository root.
- `pnpm check-env` passes with the expected Node and pnpm majors.
- `pnpm check-packages` confirms workspace manifests and installation state.
- `pnpm lint` passes across apps, packages, scripts, and config files.
- `pnpm typecheck` passes across every shared package and app.
- `pnpm verify:web` produces a successful Next.js production build.
- `pnpm verify:desktop` produces a successful Vite production build.
- `pnpm verify:mobile` exports the Expo bundle successfully.
- `pnpm run doctor` completes without errors.
- Workspace imports resolve through package names such as `@derive/domain` rather than relative cross-package paths.
- The active surface remains `apps/webapp`; desktop and mobile stay explicitly scaffolded until product work justifies more depth.
