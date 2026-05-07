# tenra Derive

tenra Derive is a structured technical Q&A workbench. It is designed to turn messy questions into answers that expose context, assumptions, confidence, and source traceability instead of pretending every response is final.

The repo keeps product logic in shared packages while allowing web, desktop, and future mobile surfaces to stay thin.

## Operational Purpose

- Capture technical questions with enough context to make answers reviewable.
- Produce structured answers that separate conclusions, assumptions, citations, and uncertainty.
- Support local review and editing before an answer is exported or handed off.
- Keep source traceability visible as part of the answer, not as an afterthought.

## Design Posture

- Confidence and uncertainty are first-class output fields.
- The desktop app is a focused local review workbench.
- The web app provides the early browser surface.
- Shared contracts and validation define the behavior before provider integrations expand.
- AI assistance should clarify reasoning, not hide the reasoning path.

## Architecture

```text
apps/
  webapp/       Next.js browser surface for question intake and answer review
  desktopapp/   Tauri + React/Vite local structured-answer workbench
  mobileapp/    Expo scaffold for later lightweight capture and review

packages/
  domain/       Question, answer, source, scope, and assumption models
  api-contracts/ Request and response contracts plus preview payloads
  validation/   Zod schemas for main request and response shapes
  privacy/      Safe-display helpers for source material
  ui/           Shared React primitives
  config/       Product identity and environment helpers
```

## Current State

- The web app is an active v0 surface with structured answer presentation.
- The desktop app supports local questions, context notes, local source notes, editable answers, review state, Assembly handoff, and Markdown export.
- The mobile app is scaffolded for future capture and review workflows.
- The current product flow is still early and uses shared mock/static contracts where provider behavior is not yet wired.

## Deployment Posture

Derive is currently a local and development-stage product codebase. The desktop surface is the clearest operational path today; hosted deployment should wait until provider behavior, persistence, and source handling are hardened.

## Working Locally

```bash
pnpm run bootstrap
pnpm run dev:web
pnpm run dev:desktop
pnpm run typecheck
pnpm run verify:all
pnpm run doctor
```

Use `pnpm run dev:mobile` only when working on the scaffolded Expo surface.

## Direction

- Strengthen source handling and citation workflows.
- Make confidence and assumption review more useful to operators.
- Expand handoff behavior without turning answers into opaque automation.
- Keep shared domain packages as the center of gravity.

## Related Documentation

- [Developer Guide](docs/DEVELOPER_GUIDE.md)
- [Repo Map](docs/REPO_MAP.md)
- [Stability Checklist](docs/STABILITY_CHECKLIST.md)
