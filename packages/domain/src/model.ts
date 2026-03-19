import type { ConfidenceLevel, Id, TimestampMs, UrlString } from "@derive/shared-types";

export type UserQuestion = {
  id: Id;
  text: string;
  createdAt: TimestampMs;
};

export type ContextSignal = {
  kind: string;
  value: string;
};

export type AssumptionNote = {
  text: string;
};

export type SourceReference = {
  title: string;
  url: UrlString;
  kind: string;
};

export type DerivedAnswer = {
  answerText: string;
  assumptions: AssumptionNote[];
  context: ContextSignal[];
  sources: SourceReference[];
  confidence: ConfidenceLevel;
};

export const mockQuestionText =
  "Next.js build failed with Cannot read properties of undefined in app/page.tsx and I am using TypeScript.";

export const mockUserQuestion: UserQuestion = {
  id: "question_demo_next_typescript_failure",
  text: mockQuestionText,
  createdAt: 1742390400000
};
