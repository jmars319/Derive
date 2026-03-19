import type { ConfidenceLevel } from "@derive/shared-types";

import type {
  AssumptionNote,
  ContextSignal,
  DerivedAnswer,
  SourceReference,
  UserQuestion
} from "./model";

type SignalRule = {
  pattern: RegExp;
  signal: ContextSignal;
};

const signalRules: SignalRule[] = [
  {
    pattern: /\btypescript\b/i,
    signal: { kind: "language", value: "typescript" }
  },
  {
    pattern: /\bjavascript\b/i,
    signal: { kind: "language", value: "javascript" }
  },
  {
    pattern: /\breact\b/i,
    signal: { kind: "framework", value: "react" }
  },
  {
    pattern: /\bnext(?:\.js)?\b/i,
    signal: { kind: "framework", value: "next" }
  },
  {
    pattern: /\bnode(?:\.js)?\b/i,
    signal: { kind: "runtime", value: "node" }
  },
  {
    pattern: /\berror\b/i,
    signal: { kind: "error", value: "error" }
  },
  {
    pattern: /\bundefined\b/i,
    signal: { kind: "error", value: "undefined" }
  },
  {
    pattern: /\bcannot\b/i,
    signal: { kind: "error", value: "cannot" }
  },
  {
    pattern: /\bfailed\b/i,
    signal: { kind: "error", value: "failed" }
  }
];

const sourceCatalog: Record<string, SourceReference> = {
  next: {
    title: "Next.js official documentation",
    url: "https://nextjs.org/docs",
    kind: "official-docs"
  },
  react: {
    title: "React official documentation",
    url: "https://react.dev/",
    kind: "official-docs"
  },
  node: {
    title: "Node.js official documentation",
    url: "https://nodejs.org/docs/latest/api/",
    kind: "official-docs"
  },
  typescript: {
    title: "TypeScript Handbook",
    url: "https://www.typescriptlang.org/docs/",
    kind: "official-docs"
  },
  javascript: {
    title: "MDN JavaScript guide",
    url: "https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide",
    kind: "official-docs"
  },
  discussion: {
    title: "Stack Overflow discussion",
    url: "https://stackoverflow.com/questions/tagged/javascript",
    kind: "discussion"
  }
};

export function normalizeQuestionText(text: string): string {
  return text.trim().replace(/\s+/g, " ");
}

export function deriveAnswer(input: UserQuestion): DerivedAnswer {
  const normalizedText = normalizeQuestionText(input.text);
  const context = extractSignals(normalizedText);
  const assumptions = buildAssumptions(context);
  const sources = buildSources(context);
  const confidence = deriveConfidence(context);

  return {
    answerText: buildAnswerText(normalizedText, context),
    assumptions,
    context,
    sources,
    confidence
  };
}

function extractSignals(text: string): ContextSignal[] {
  const signals: ContextSignal[] = [];

  for (const rule of signalRules) {
    if (rule.pattern.test(text)) {
      pushUniqueSignal(signals, rule.signal);
    }
  }

  const fileExtensions = text.match(/\.(ts|tsx|js|jsx)\b/gi) ?? [];

  for (const extension of fileExtensions) {
    if (extension === ".ts" || extension === ".tsx") {
      pushUniqueSignal(signals, {
        kind: "language",
        value: "typescript"
      });
    }

    if (extension === ".js" || extension === ".jsx") {
      pushUniqueSignal(signals, {
        kind: "language",
        value: "javascript"
      });
    }

    pushUniqueSignal(signals, {
      kind: "file-extension",
      value: extension
    });
  }

  return signals;
}

function buildAssumptions(context: ContextSignal[]): AssumptionNote[] {
  const assumptions: AssumptionNote[] = [];
  const values = new Set(context.map((signal) => signal.value));

  if (
    values.has("typescript") ||
    values.has("javascript") ||
    values.has("react") ||
    values.has("next") ||
    values.has("node") ||
    context.some((signal) => signal.kind === "file-extension")
  ) {
    assumptions.push({
      text: "Assuming a JavaScript/TypeScript environment."
    });
  }

  if (context.some((signal) => signal.kind === "error")) {
    assumptions.push({
      text: "Assuming this is an error or failure scenario based on the wording."
    });
  }

  if (values.has("react") || values.has("next")) {
    assumptions.push({
      text: "Assuming the issue is happening in application code rather than infrastructure."
    });
  }

  if (context.some((signal) => signal.kind === "file-extension")) {
    assumptions.push({
      text: "Assuming the referenced file extensions point to the area that should be inspected first."
    });
  }

  if (assumptions.length === 0) {
    assumptions.push({
      text: "Assuming more technical context is needed because the question is broad."
    });
  }

  return assumptions;
}

function buildAnswerText(text: string, context: ContextSignal[]): string {
  const preview = text.length > 160 ? `${text.slice(0, 157)}...` : text;
  const subject = describeSubject(context);
  const direction = describeDirection(context);

  return `You asked about "${preview}". This appears to be an issue related to ${subject}. Based on your input, you may want to check ${direction}.`;
}

function buildSources(context: ContextSignal[]): SourceReference[] {
  const values = new Set(context.map((signal) => signal.value));
  const sources: SourceReference[] = [];

  if (values.has("next")) {
    sources.push(sourceCatalog.next);
  } else if (values.has("react")) {
    sources.push(sourceCatalog.react);
  } else if (values.has("node")) {
    sources.push(sourceCatalog.node);
  }

  if (values.has("typescript")) {
    sources.push(sourceCatalog.typescript);
  } else {
    sources.push(sourceCatalog.javascript);
  }

  sources.push(sourceCatalog.discussion);

  return dedupeSources(sources).slice(0, 3);
}

function deriveConfidence(context: ContextSignal[]): ConfidenceLevel {
  const strongSignals = new Set(
    context
      .filter((signal) => signal.kind !== "file-extension")
      .map((signal) => `${signal.kind}:${signal.value}`)
  );

  if (strongSignals.size === 0) {
    return "low";
  }

  if (strongSignals.size >= 3) {
    return "high";
  }

  return "medium";
}

function describeSubject(context: ContextSignal[]): string {
  const frameworks = pickValues(context, "framework");
  const languages = pickValues(context, "language");
  const errors = pickValues(context, "error");

  if (frameworks.length > 0 && languages.length > 0) {
    return `${joinNatural(frameworks)} in a ${joinNatural(languages)} codebase`;
  }

  if (frameworks.length > 0) {
    return `${joinNatural(frameworks)} application behavior`;
  }

  if (languages.length > 0) {
    return `${joinNatural(languages)} code`;
  }

  if (errors.length > 0) {
    return `an error scenario signaled by terms like ${joinNatural(errors)}`;
  }

  return "a general development issue";
}

function describeDirection(context: ContextSignal[]): string {
  const values = new Set(context.map((signal) => signal.value));
  const fileExtensions = pickValues(context, "file-extension");

  if (values.has("next")) {
    return "Next.js routing, server/client boundaries, and build configuration first";
  }

  if (values.has("react")) {
    return "component props, state flow, and render-time assumptions";
  }

  if (values.has("typescript")) {
    return "TypeScript types, nullability, and the referenced source files";
  }

  if (values.has("node")) {
    return "runtime entry points, scripts, and environment setup";
  }

  if (context.some((signal) => signal.kind === "error")) {
    return "the exact error site, the triggering code path, and the most recent change nearby";
  }

  if (fileExtensions.length > 0) {
    return `the referenced ${joinNatural(fileExtensions)} files and the code surrounding them`;
  }

  return "the smallest reproducible part of the problem and the exact behavior you expected";
}

function pickValues(context: ContextSignal[], kind: string): string[] {
  return context
    .filter((signal) => signal.kind === kind)
    .map((signal) => signal.value);
}

function pushUniqueSignal(context: ContextSignal[], nextSignal: ContextSignal) {
  const alreadyPresent = context.some(
    (signal) => signal.kind === nextSignal.kind && signal.value === nextSignal.value
  );

  if (!alreadyPresent) {
    context.push(nextSignal);
  }
}

function dedupeSources(sources: SourceReference[]): SourceReference[] {
  return sources.filter(
    (source, index) =>
      sources.findIndex((candidate) => candidate.title === source.title) === index
  );
}

function joinNatural(values: string[]): string {
  if (values.length === 1) {
    return values[0];
  }

  if (values.length === 2) {
    return `${values[0]} and ${values[1]}`;
  }

  return `${values.slice(0, -1).join(", ")}, and ${values[values.length - 1]}`;
}
