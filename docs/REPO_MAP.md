# Repo Map

## Apps

- `apps/webapp`
  Secondary Next.js surface that renders the tenra Derive concept clearly: messy question intake, structured answer, context and assumptions, source citations, and trust framing. It uses static mock data from shared contracts and does not imply a live backend.
- `apps/desktopapp`
  Primary React/Tauri desktop workbench for local questions, context notes, deterministic signal extraction, editable answers, review state, and Markdown export.
- `apps/mobileapp`
  Third-surface Expo app for future mobile question capture and answer review. It remains intentionally minimal until the desktop and web workflows justify mobile depth.

## Shared packages

- `packages/shared-types`
  Low-level identifiers, timestamps, URL strings, confidence levels, and source kinds.
- `packages/domain`
  The center of the product model: `UserQuestion`, `DerivedAnswer`, `SourceReference`, `AnswerScope`, `AssumptionNote`, `ContextSignal`, and retrieval candidates.
- `packages/api-contracts`
  Shared request and response contracts plus mock payloads used by the app shells.
- `packages/validation`
  Zod schemas for request, response, and core domain shapes.
- `packages/realtime`
  Placeholder event contracts for future streaming answer progress.
- `packages/auth`
  Minimal access-mode posture for anonymous-first intake.
- `packages/geo`
  Present but intentionally inactive. Holds future geo-aware ranking hooks without affecting v0.
- `packages/privacy`
  Exposure-control and source-handling helpers. This is where safe-display posture lives instead of in app components.
- `packages/ui`
  Small React UI primitives shared by the web and desktop apps. It is not a full design system.
- `packages/config`
  App identity, active/scaffolded surface flags, and environment helper functions.

## Root files and folders

- `scripts/`
  Honest shell entry points for bootstrap, env checks, dev flows, build verification, and doctor checks.
- `docs/`
  Working documentation for structure, developer workflow, and stability expectations.
- `archive/`
  Holding area for retired experiments that should not remain in active package paths.

## Intentional minimalism

- Desktop is now the main product target; web remains the companion surface and mobile stays intentionally small.
- There is no database, auth system, background processing, or external API integration.
- Shared packages compile and export meaningful types and helpers, but product logic is still placeholder-level.
