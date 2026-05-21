# Developer Guide

## Bootstrap

1. Run `pnpm bootstrap`.
2. Confirm Rust is installed when working on the primary desktop surface.
3. Copy `.env.example` to a local `.env` file only if you need to experiment with environment values. The scaffold defaults to mock mode.

## Running apps

- `pnpm dev:desktop`
  Builds shared packages and starts the primary desktop workbench.
- `pnpm dev:web`
  Builds shared packages and starts the secondary Next.js surface.
- `pnpm dev:mobile`
  Builds shared packages and starts the third-surface Expo shell.
- `pnpm dev:both`
  Runs the desktop and web surfaces together for quick workspace checks.

## Verify flows

- `pnpm lint`
  Lints the full workspace with the root ESLint config.
- `pnpm typecheck`
  Rebuilds shared packages and then typechecks every app surface against the shared contracts.
- `pnpm verify:web`
  Builds the web app after compiling shared packages.
- `pnpm verify:desktop`
  Builds the desktop app after compiling shared packages.
- `pnpm verify:mobile`
  Exports the mobile app bundle after compiling shared packages.
- `pnpm run doctor`
  Runs environment checks, package checks, lint, typecheck, and all verify scripts in sequence.

## Local Tooling

The shared local machine baseline supports Derive's reasoning workbench and desktop surface:

- Use `cargo audit`, `cargo deny`, and `sccache` around Tauri/Rust work in `apps/desktopapp/src-tauri`.
- Use `actionlint` before changing GitHub Actions workflows.
- Use `shellcheck` and `shfmt` when editing repo scripts.
- Use `osv-scanner` for dependency advisory checks across package manifests.
- Use `pa11y` and `lighthouse` against the running web or desktop-served UI when interface behavior changes.

## Adding a package

1. Create a new folder under `packages/`.
2. Give it a scoped name like `@derive/<package-name>`.
3. Add a `tsconfig.json`, `package.json`, and at least one meaningful export in `src/index.ts`.
4. Register its path alias in `tsconfig.base.json`.
5. Add it to root `build:packages` and `typecheck` scripts if it needs compilation.
6. Import it from at least one app or shared package so it does not become dead structure.

## Adding another app

1. Create the app under `apps/`.
2. Keep business logic out of the app and import contracts from shared packages.
3. Add the new app to `pnpm-workspace.yaml` if its path differs from the existing `apps/*` pattern.
4. Add dev, typecheck, lint, and verify commands at the app level.
5. Add a root shell script only if the new app needs a first-class workflow.

## Keep apps thin

- Put product language and data shape in `packages/domain`, `packages/api-contracts`, and `packages/validation`.
- Keep app code focused on rendering, composition, and surface-specific wiring.
- If an app starts inventing source handling, confidence logic, or request validation, move that logic to a shared package immediately.
