# tenra Derive

tenra Derive is a developer Q&A system without entry friction. The product direction is centered on turning messy technical questions into structured answers that surface context, assumptions, confidence, and source traceability instead of pretending every answer is final or fully certain.

This monorepo exists to keep the center of gravity in shared domain packages while letting delivery surfaces stay thin. The web app remains the early browser surface, while the desktop app now provides a local structured-answer workbench for focused review.

## Active vs scaffolded

- `apps/webapp`: active v0 browser surface with a question intake, derived answer card, context and assumptions panel, cited sources, and trust note using shared mock contracts.
- `apps/desktopapp`: launchable Vite React + Tauri desktop workbench for local questions, context notes, local source notes, deterministic signal extraction, editable answers, review state, Assembly handoff, and Markdown export.
- `apps/mobileapp`: scaffolded Expo app for future lightweight question capture and answer review.

## Primary commands

- `pnpm bootstrap`: install dependencies and confirm the local toolchain.
- `pnpm dev:web`: build shared packages and run the Next.js app.
- `pnpm dev:desktop`: build shared packages and run the Vite desktop shell.
- `pnpm dev:mobile`: build shared packages and run the Expo mobile shell.
- `pnpm dev:both`: run the web and desktop shells together.
- `pnpm check-env`: verify Node and pnpm expectations.
- `pnpm check-packages`: confirm workspace manifests and installed packages.
- `pnpm lint`: run ESLint across the workspace.
- `pnpm typecheck`: typecheck every package and app.
- `pnpm verify:web`: build the web app.
- `pnpm verify:desktop`: build the desktop app.
- `pnpm install:desktop`: build and install the macOS desktop app into `/Applications`.
- `pnpm verify:mobile`: export the mobile app bundle.
- `pnpm run doctor`: run the full verification path. `doctor` is a pnpm built-in command name, so use `run` for the repo script.

## Monorepo shape

- `packages/domain`: tenra Derive question, answer, source, scope, context, and assumption models.
- `packages/api-contracts`: request and response contracts plus static preview payloads.
- `packages/validation`: Zod schemas for the main request and response shapes.
- `packages/privacy`: source exposure and safe-display helpers.
- `packages/ui`: small shared React primitives used by the web and desktop shells.
- `packages/config`: app identity and environment helpers.

Read [docs/REPO_MAP.md](docs/REPO_MAP.md) for package-by-package intent and [docs/DEVELOPER_GUIDE.md](docs/DEVELOPER_GUIDE.md) for day-to-day workflow.
