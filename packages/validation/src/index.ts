import {
  DERIVE_CLIENTS,
  type DeriveQuestionRequest,
  type DeriveQuestionResponse,
  type HealthCheckResponse
} from "@derive/api-contracts";
import {
  ASSUMPTION_IMPACT_LEVELS,
  CONTEXT_SIGNAL_KINDS,
  DERIVATION_MODES,
  SOURCE_EXPOSURE_LEVELS,
  type DerivedAnswer,
  type SourceReference,
  type UserQuestion
} from "@derive/domain";
import { CONFIDENCE_LEVELS, SOURCE_KINDS } from "@derive/shared-types";
import { z } from "zod";

export const idSchema = z.string().min(1);
export const timestampMsSchema = z.number().int().nonnegative();
export const urlStringSchema = z.url();
export const sourceKindSchema = z.enum(SOURCE_KINDS);
export const confidenceLevelSchema = z.enum(CONFIDENCE_LEVELS);

export const userQuestionSchema: z.ZodType<UserQuestion> = z.object({
  id: idSchema,
  rawText: z.string().min(1),
  normalizedText: z.string().min(1),
  askedAt: timestampMsSchema,
  tags: z.array(z.string().min(1))
});

export const sourceReferenceSchema: z.ZodType<SourceReference> = z.object({
  id: idSchema,
  title: z.string().min(1),
  url: urlStringSchema,
  kind: sourceKindSchema,
  whyItMatters: z.string().min(1),
  exposure: z.enum(SOURCE_EXPOSURE_LEVELS)
});

export const derivedAnswerSchema: z.ZodType<DerivedAnswer> = z.object({
  id: idSchema,
  summary: z.string().min(1),
  answer: z.string().min(1),
  confidence: confidenceLevelSchema,
  scope: z.object({
    inScope: z.array(z.string().min(1)),
    outOfScope: z.array(z.string().min(1))
  }),
  assumptions: z.array(
    z.object({
      id: idSchema,
      statement: z.string().min(1),
      impact: z.enum(ASSUMPTION_IMPACT_LEVELS)
    })
  ),
  contextSignals: z.array(
    z.object({
      id: idSchema,
      kind: z.enum(CONTEXT_SIGNAL_KINDS),
      label: z.string().min(1),
      detail: z.string().min(1)
    })
  ),
  sources: z.array(sourceReferenceSchema),
  retrievalCandidates: z.array(
    z.object({
      id: idSchema,
      title: z.string().min(1),
      url: urlStringSchema,
      kind: sourceKindSchema,
      summary: z.string().min(1),
      score: z.number().min(0).max(1)
    })
  ),
  trace: z.object({
    mode: z.enum(DERIVATION_MODES),
    generatedAt: timestampMsSchema,
    notes: z.array(z.string().min(1))
  })
});

export const deriveQuestionRequestSchema: z.ZodType<DeriveQuestionRequest> = z.object({
  question: z.string().min(1),
  client: z.enum(DERIVE_CLIENTS),
  hints: z.array(z.string().min(1)).optional()
});

export const deriveQuestionResponseSchema: z.ZodType<DeriveQuestionResponse> = z.object({
  requestId: idSchema,
  receivedQuestion: userQuestionSchema,
  answer: derivedAnswerSchema,
  system: z.object({
    mode: z.enum(["mock", "live"]),
    status: z.enum(["stubbed", "ready"]),
    note: z.string().min(1)
  })
});

export const healthCheckResponseSchema: z.ZodType<HealthCheckResponse> = z.object({
  status: z.literal("ok"),
  app: z.literal("Derive"),
  mode: z.enum(["mock", "live"]),
  timestampMs: timestampMsSchema,
  surfaces: z.object({
    webapp: z.enum(["active", "scaffolded"]),
    desktopapp: z.enum(["active", "scaffolded"]),
    mobileapp: z.enum(["active", "scaffolded"])
  })
});

export function parseDeriveQuestionRequest(input: unknown): DeriveQuestionRequest {
  return deriveQuestionRequestSchema.parse(input);
}

export function parseDeriveQuestionResponse(input: unknown): DeriveQuestionResponse {
  return deriveQuestionResponseSchema.parse(input);
}
