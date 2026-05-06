import {
  mockDerivedAnswer,
  mockUserQuestion,
  normalizeQuestionText,
  type DerivedAnswer,
  type UserQuestion
} from "@derive/domain";
import type { Id, SurfaceStatus, TimestampMs } from "@derive/shared-types";

export const DERIVE_CLIENTS = ["webapp", "desktopapp", "mobileapp"] as const;

export type DeriveClient = (typeof DERIVE_CLIENTS)[number];

export type DeriveQuestionRequest = {
  question: string;
  client: DeriveClient;
  hints?: string[];
};

export type DeriveQuestionResponse = {
  requestId: Id;
  receivedQuestion: UserQuestion;
  answer: DerivedAnswer;
  system: {
    mode: "mock" | "live";
    status: "stubbed" | "ready";
    note: string;
  };
};

export type HealthCheckResponse = {
  status: "ok";
  app: "tenra Derive";
  mode: "mock" | "live";
  timestampMs: TimestampMs;
  surfaces: Record<DeriveClient, SurfaceStatus>;
};

export type DeriveReasoningBriefSourceApp =
  | "facet"
  | "sentinel"
  | "assembly"
  | "guardrail"
  | "scout"
  | "registry"
  | "proxy"
  | "manual";

export type DeriveReasoningBriefConsumer =
  | "assembly"
  | "guardrail"
  | "sentinel"
  | "proxy"
  | "manual";

export interface DeriveReasoningBrief {
  schema: "tenra-derive.reasoning-brief.v1";
  exportedAt: string;
  sourceApp: DeriveReasoningBriefSourceApp;
  question: UserQuestion;
  answer: DerivedAnswer;
  handoff: {
    summary: string;
    recommendedConsumers: DeriveReasoningBriefConsumer[];
    openQuestions: string[];
  };
}

export function buildDeriveReasoningBrief(input: {
  question: UserQuestion;
  answer: DerivedAnswer;
  sourceApp?: DeriveReasoningBriefSourceApp | undefined;
  exportedAt?: string | undefined;
  recommendedConsumers?: DeriveReasoningBriefConsumer[] | undefined;
  summary?: string | undefined;
}): DeriveReasoningBrief {
  return {
    schema: "tenra-derive.reasoning-brief.v1",
    exportedAt: input.exportedAt ?? new Date().toISOString(),
    sourceApp: input.sourceApp ?? "manual",
    question: input.question,
    answer: input.answer,
    handoff: {
      summary:
        input.summary ??
        `Answer confidence is ${input.answer.confidence}; preserve assumptions and source traceability.`,
      recommendedConsumers: input.recommendedConsumers ?? ["assembly"],
      openQuestions: input.answer.assumptions.map((assumption) => assumption.text)
    }
  };
}

export const mockDeriveQuestionRequest: DeriveQuestionRequest = {
  question: normalizeQuestionText(mockUserQuestion.text),
  client: "webapp",
  hints: ["deterministic", "traceability", "phase-1"]
};

export const mockDeriveQuestionResponse: DeriveQuestionResponse = {
  requestId: "request_demo_next_typescript_failure",
  receivedQuestion: mockUserQuestion,
  answer: mockDerivedAnswer,
  system: {
    mode: "mock",
    status: "ready",
    note: "Deterministic local pipeline only. No external retrieval or AI synthesis is connected."
  }
};

export const mockHealthCheckResponse: HealthCheckResponse = {
  status: "ok",
    app: "tenra Derive",
  mode: "mock",
  timestampMs: 1742390500000,
  surfaces: {
    webapp: "active",
    desktopapp: "scaffolded",
    mobileapp: "scaffolded"
  }
};

export const mockDeriveReasoningBrief: DeriveReasoningBrief = {
  ...buildDeriveReasoningBrief({
    exportedAt: "2026-05-06T17:30:00.000Z",
    question: mockUserQuestion,
    answer: mockDerivedAnswer,
    summary: "Structured answer with assumptions, context, confidence, and source traceability."
  })
};
