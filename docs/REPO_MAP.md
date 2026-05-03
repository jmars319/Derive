# Repo Map

## Apps

- `apps/webapp`
  Active surface. Next.js app that renders the tenra Derive concept clearly: messy question intake, structured answer, context and assumptions, source citations, and trust framing. It uses static mock data from shared contracts and does not imply a live backend.
- `apps/desktopapp`
  Scaffolded React desktop shell built with Vite. It imports shared contracts and placeholder realtime/auth helpers. `src-tauri/` exists only as native-shell shape, not as an active implementation.
- `apps/mobileapp`
  Scaffolded Expo app for future mobile question capture and answer review. It is intentionally minimal and marked as inactive for v0.

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

- Desktop and mobile are present to prove structure, not to simulate readiness.
- There is no database, auth system, background processing, or external API integration.
- Shared packages compile and export meaningful types and helpers, but product logic is still placeholder-level.
