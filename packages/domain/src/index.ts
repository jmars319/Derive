import type {
  ConfidenceLevel,
  Id,
  SourceKind,
  TimestampMs,
  UrlString
} from "@derive/shared-types";

export const ASSUMPTION_IMPACT_LEVELS = ["low", "medium", "high"] as const;
export const CONTEXT_SIGNAL_KINDS = [
  "intent",
  "environment",
  "constraint",
  "ecosystem"
] as const;
export const SOURCE_EXPOSURE_LEVELS = ["full", "quoted", "mentioned"] as const;
export const DERIVATION_MODES = ["mock-preview", "live"] as const;

export type AssumptionImpact = (typeof ASSUMPTION_IMPACT_LEVELS)[number];
export type ContextSignalKind = (typeof CONTEXT_SIGNAL_KINDS)[number];
export type SourceExposureLevel = (typeof SOURCE_EXPOSURE_LEVELS)[number];
export type DerivationMode = (typeof DERIVATION_MODES)[number];

export type UserQuestion = {
  id: Id;
  rawText: string;
  normalizedText: string;
  askedAt: TimestampMs;
  tags: string[];
};

export type AnswerScope = {
  inScope: string[];
  outOfScope: string[];
};

export type AssumptionNote = {
  id: Id;
  statement: string;
  impact: AssumptionImpact;
};

export type ContextSignal = {
  id: Id;
  kind: ContextSignalKind;
  label: string;
  detail: string;
};

export type SourceReference = {
  id: Id;
  title: string;
  url: UrlString;
  kind: SourceKind;
  whyItMatters: string;
  exposure: SourceExposureLevel;
};

export type RetrievalCandidate = {
  id: Id;
  title: string;
  url: UrlString;
  kind: SourceKind;
  summary: string;
  score: number;
};

export type DerivedAnswer = {
  id: Id;
  summary: string;
  answer: string;
  confidence: ConfidenceLevel;
  scope: AnswerScope;
  assumptions: AssumptionNote[];
  contextSignals: ContextSignal[];
  sources: SourceReference[];
  retrievalCandidates: RetrievalCandidate[];
  trace: {
    mode: DerivationMode;
    generatedAt: TimestampMs;
    notes: string[];
  };
};

export function normalizeQuestionText(text: string): string {
  return text.replace(/\s+/g, " ").trim();
}

export const mockQuestionDraft =
  "My Next.js app works in dev, but a package from my pnpm workspace fails during build. How do I make the likely cause and trustworthy fix path obvious without pretending I know more than I do?";

export const mockUserQuestion: UserQuestion = {
  id: "question_demo_monorepo_resolution",
  rawText: mockQuestionDraft,
  normalizedText: normalizeQuestionText(mockQuestionDraft),
  askedAt: 1742390400000,
  tags: ["nextjs", "pnpm", "workspace-imports", "traceability"]
};

export const mockDerivedAnswer: DerivedAnswer = {
  id: "answer_demo_monorepo_resolution",
  summary:
    "The likely issue is a mismatch between how dev tooling resolves workspace packages and how the production build resolves package outputs.",
  answer:
    "Derive would frame this as a packaging problem first, not an application bug. In a pnpm monorepo, local development often succeeds because the bundler follows source files directly, while production builds rely on package exports, generated output, or a different module resolution path. A trustworthy fix path is to make shared packages compile to a real distributable shape, point package exports at those outputs, and have apps consume the package boundary instead of reaching across it indirectly.",
  confidence: "medium",
  scope: {
    inScope: [
      "workspace package boundaries",
      "module resolution differences between dev and build",
      "traceable explanation of the likely root cause"
    ],
    outOfScope: [
      "package-manager specific caching bugs",
      "deployment platform edge cases",
      "framework-version specific undocumented behavior"
    ]
  },
  assumptions: [
    {
      id: "assumption_workspace_exports",
      statement:
        "The failing package is consumed through a workspace dependency rather than copied source files.",
      impact: "high"
    },
    {
      id: "assumption_build_target",
      statement:
        "The production build path expects compiled package output or valid package exports.",
      impact: "medium"
    }
  ],
  contextSignals: [
    {
      id: "context_intent_debug",
      kind: "intent",
      label: "Debugging intent",
      detail: "The question is asking for a cause and decision path, not just a syntax fix."
    },
    {
      id: "context_environment_monorepo",
      kind: "environment",
      label: "Workspace environment",
      detail: "A pnpm workspace changes how packages are linked and resolved."
    },
    {
      id: "context_constraint_trust",
      kind: "constraint",
      label: "Trust constraint",
      detail: "The answer should surface uncertainty instead of claiming a single guaranteed fix."
    }
  ],
  sources: [
    {
      id: "source_next_docs",
      title: "Next.js package transpilation and workspace guidance",
      url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages",
      kind: "official-docs",
      whyItMatters:
        "Explains how Next.js handles workspace packages and when package transpilation is needed.",
      exposure: "mentioned"
    },
    {
      id: "source_typescript_handbook",
      title: "TypeScript module resolution reference",
      url: "https://www.typescriptlang.org/docs/handbook/modules/reference.html",
      kind: "official-docs",
      whyItMatters:
        "Clarifies how TypeScript resolves module specifiers compared with runtime or bundler behavior.",
      exposure: "mentioned"
    },
    {
      id: "source_pnpm_workspace",
      title: "pnpm workspace documentation",
      url: "https://pnpm.io/workspaces",
      kind: "official-docs",
      whyItMatters:
        "Covers workspace linking behavior and why package boundaries still matter in a monorepo.",
      exposure: "mentioned"
    }
  ],
  retrievalCandidates: [
    {
      id: "candidate_next_docs",
      title: "Next.js workspace package guidance",
      url: "https://nextjs.org/docs/app/api-reference/config/next-config-js/transpilePackages",
      kind: "official-docs",
      summary: "Candidate source for app-side workspace package handling.",
      score: 0.91
    },
    {
      id: "candidate_typescript_reference",
      title: "TypeScript modules reference",
      url: "https://www.typescriptlang.org/docs/handbook/modules/reference.html",
      kind: "official-docs",
      summary: "Candidate source for explaining type-system versus runtime resolution.",
      score: 0.83
    }
  ],
  trace: {
    mode: "mock-preview",
    generatedAt: 1742390460000,
    notes: [
      "Static preview data only.",
      "No live retrieval or synthesis pipeline is connected in v0."
    ]
  }
};
