# Module Manifest

Generated from `tenra Hub/contracts/handoff-catalog.json` by `tenra Hub/scripts/generate-suite-contract-docs.mjs`.

## Standalone Mode

Runs as a complete reasoning workspace with local questions, answers, brief history, import previews, and comparison state.

## Repository Path

`capabilities/reasoning/tenra Derive`

## Required Suite Dependencies

- None

## Optional Suite Dependencies

- tenra Facet: Optional orientation packet source.
- tenra Sentinel: Optional risk brief source and consumer.
- tenra Assembly: Optional content drafting consumer.
- tenra Guardrail: Optional reasoning review consumer.
- tenra Proxy: Optional shaped summary consumer.

## Provides

- reasoning brief
- brief history
- import preview

## Consumes

- orientation packet
- risk brief

## Contracts

Emits:

- `tenra-derive.reasoning-brief.v1`

Accepts:

- `tenra-facet.orientation-packet.v1`
- `tenra-sentinel.risk-brief.v1`

## Rules

- Each app must remain complete and usable without another tenra app running.
- Suite integrations are optional module links, not required runtime dependencies.
- Shared functions should be exposed through explicit local APIs, exports, imports, or schemas.
- No app may read another app's private filesystem, database, or localStorage state.
- Registry can index and audit the module graph, but it must not become a hidden runtime bus.
