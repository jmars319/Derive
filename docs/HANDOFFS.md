# tenra Derive Handoffs

tenra Derive stays unique as a shared reasoning app. Its job is to turn messy questions into structured answers with assumptions, confidence, context, and source traceability.

## Produces

- `tenra-derive.reasoning-brief.v1` JSON.
- Markdown reasoning briefs for manual review and Assembly intake.

## Consumes

- `tenra-facet.orientation-packet.v1` when a question needs framing before an answer.
- `tenra-sentinel.risk-brief.v1` when risk evidence needs a structured conclusion.
- Guardrail review context when an action needs a reasoned explanation for allow/review/deny.

Derive should not become live search, multi-angle exploration, signal collection, or final content production. Those stay in Facet, Sentinel, and Assembly.
