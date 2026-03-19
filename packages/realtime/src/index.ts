import type { Id, TimestampMs } from "@derive/shared-types";

export const ANSWER_PROGRESS_STAGES = [
  "queued",
  "intent-resolved",
  "retrieval-running",
  "synthesis-running",
  "complete"
] as const;

export type AnswerProgressStage = (typeof ANSWER_PROGRESS_STAGES)[number];

export type AnswerProgressEvent = {
  eventId: Id;
  requestId: Id;
  stage: AnswerProgressStage;
  at: TimestampMs;
  message: string;
};

export const mockProgressEvents: AnswerProgressEvent[] = [
  {
    eventId: "event_queued",
    requestId: "request_demo_monorepo_resolution",
    stage: "queued",
    at: 1742390400000,
    message: "Question intake accepted."
  },
  {
    eventId: "event_intent",
    requestId: "request_demo_monorepo_resolution",
    stage: "intent-resolved",
    at: 1742390415000,
    message: "Intent resolved as a monorepo packaging problem with trust-sensitive framing."
  },
  {
    eventId: "event_complete",
    requestId: "request_demo_monorepo_resolution",
    stage: "complete",
    at: 1742390460000,
    message: "Static preview answer assembled from mock contracts."
  }
];
