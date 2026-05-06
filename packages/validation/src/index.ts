import {
  DERIVE_CLIENTS,
  type DeriveReasoningBrief,
  type DeriveQuestionRequest,
  type DeriveQuestionResponse,
  type HealthCheckResponse
} from "@derive/api-contracts";
import {
  type DerivedAnswer,
  type SourceReference,
  type UserQuestion
} from "@derive/domain";
import { CONFIDENCE_LEVELS } from "@derive/shared-types";
import { z } from "zod";

export const idSchema = z.string().min(1);
export const timestampMsSchema = z.number().int().nonnegative();
export const urlStringSchema = z.url();
export const sourceKindSchema = z.string().min(1);
export const confidenceLevelSchema = z.enum(CONFIDENCE_LEVELS);

export const userQuestionSchema: z.ZodType<UserQuestion> = z.object({
  id: idSchema,
  text: z.string().min(1),
  createdAt: timestampMsSchema
});

export const sourceReferenceSchema: z.ZodType<SourceReference> = z.object({
  title: z.string().min(1),
  url: urlStringSchema,
  kind: sourceKindSchema
});

export const derivedAnswerSchema: z.ZodType<DerivedAnswer> = z.object({
  answerText: z.string().min(1),
  confidence: confidenceLevelSchema,
  assumptions: z.array(
    z.object({
      text: z.string().min(1)
    })
  ),
  context: z.array(
    z.object({
      kind: z.string().min(1),
      value: z.string().min(1)
    })
  ),
  sources: z.array(sourceReferenceSchema)
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
  app: z.literal("tenra Derive"),
  mode: z.enum(["mock", "live"]),
  timestampMs: timestampMsSchema,
  surfaces: z.object({
    webapp: z.enum(["active", "scaffolded"]),
    desktopapp: z.enum(["active", "scaffolded"]),
    mobileapp: z.enum(["active", "scaffolded"])
  })
});

export const deriveReasoningBriefSchema: z.ZodType<DeriveReasoningBrief> = z.object({
  schema: z.literal("tenra-derive.reasoning-brief.v1"),
  exportedAt: z.string().datetime({ offset: true }),
  sourceApp: z.enum([
    "facet",
    "sentinel",
    "assembly",
    "guardrail",
    "scout",
    "registry",
    "proxy",
    "manual"
  ]),
  question: userQuestionSchema,
  answer: derivedAnswerSchema,
  handoff: z.object({
    summary: z.string().min(1),
    recommendedConsumers: z.array(z.enum(["assembly", "guardrail", "sentinel", "proxy", "manual"])).min(1),
    openQuestions: z.array(z.string().min(1))
  })
});

export const deriveFacetOrientationPacketSchema = z.object({
  schema: z.literal("tenra-facet.orientation-packet.v1"),
  exportedAt: z.string().datetime({ offset: true }),
  sourceApp: z.literal("facet"),
  query: z.object({
    text: z.string().min(1)
  }).passthrough(),
  response: z.object({
    search: z.object({
      results: z.array(
        z.object({
          title: z.string().min(1),
          url: z.string().min(1),
          snippet: z.string().optional()
        }).passthrough()
      )
    }).passthrough(),
    reframing: z.object({
      block: z.object({
        heading: z.string().min(1),
        line: z.string().optional()
      }).passthrough()
    }).passthrough()
  }).passthrough(),
  handoff: z.object({
    prompt: z.string().min(1)
  }).passthrough()
}).passthrough();

export const deriveSentinelRiskBriefSchema = z.object({
  schema: z.literal("tenra-sentinel.risk-brief.v1"),
  exportedAt: z.string().datetime({ offset: true }),
  sourceApp: z.literal("sentinel"),
  lookup: z.object({
    assessment: z.object({
      reasoning: z.object({
        headline: z.string().min(1),
        narrative: z.string().min(1)
      }).passthrough()
    }).passthrough(),
    evidence: z.array(
      z.object({
        label: z.string().min(1),
        summary: z.string().optional(),
        redactionSafeSummary: z.string().optional()
      }).passthrough()
    )
  }).passthrough(),
  handoff: z.object({
    questionForDerive: z.string().min(1),
    actionPosture: z.string().min(1)
  }).passthrough()
}).passthrough();

export type DeriveFacetOrientationPacket = z.infer<typeof deriveFacetOrientationPacketSchema>;
export type DeriveSentinelRiskBrief = z.infer<typeof deriveSentinelRiskBriefSchema>;

export function parseDeriveQuestionRequest(input: unknown): DeriveQuestionRequest {
  return deriveQuestionRequestSchema.parse(input);
}

export function parseDeriveQuestionResponse(input: unknown): DeriveQuestionResponse {
  return deriveQuestionResponseSchema.parse(input);
}

export function parseDeriveReasoningBrief(input: unknown): DeriveReasoningBrief {
  return deriveReasoningBriefSchema.parse(input);
}

export function parseDeriveFacetOrientationPacket(input: unknown): DeriveFacetOrientationPacket {
  return deriveFacetOrientationPacketSchema.parse(input);
}

export function parseDeriveSentinelRiskBrief(input: unknown): DeriveSentinelRiskBrief {
  return deriveSentinelRiskBriefSchema.parse(input);
}
