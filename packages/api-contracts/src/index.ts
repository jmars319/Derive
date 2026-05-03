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
