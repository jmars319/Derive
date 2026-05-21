# Suite Handoff Standard

Generated from `tenra Hub/contracts/handoff-catalog.json` by `tenra Hub/scripts/generate-suite-contract-docs.mjs`.

## App Role

reasoning brief and comparison module

keep unique; consume Facet/Sentinel inputs and emit reasoning briefs to Assembly, Guardrail, Sentinel, and Proxy.

## Standalone Mode

Runs as a complete reasoning workspace with local questions, answers, brief history, import previews, and comparison state.

## Repository Path

`capabilities/reasoning/tenra Derive`

## Accepted Inputs

- `tenra-facet.orientation-packet.v1` from tenra Facet
- `tenra-sentinel.risk-brief.v1` from tenra Sentinel

## Emitted Outputs

- `tenra-derive.reasoning-brief.v1` to tenra Assembly, tenra Guardrail, tenra Sentinel, tenra Proxy

## Standard Controls

- schema badge
- preview payload
- brief comparison
- history
- endpoint health
- retry failed
- payload inspection
- version comparison
- inline errors

## Status Vocabulary

- `draft`: Payload or route exists locally but has not been previewed.
- `previewed`: Payload was built and inspected without delivery.
- `queued`: Delivery is waiting for an endpoint, retry, or operator action.
- `sent`: Producer posted or exported the payload successfully.
- `accepted`: Consumer parsed and retained the payload.
- `rejected`: Consumer refused the payload for schema, routing, safety, or policy reasons.
- `failed`: Delivery failed before acceptance or rejection was known.
- `replayed`: Registry or a producer regenerated a prior payload for another delivery attempt.
- `received`: Consumer acknowledged receipt back to the source app.
- `dismissed`: Operator intentionally removed an item from an inbox, queue, or retry list.

## Local Storage

Prefix: `tenra.derive`

- `tenra.derive.reasoningBriefHistory.v1`
- `tenra.derive.importHistory.v1`

## Endpoints

- No suite HTTP endpoint is documented for this app yet.
