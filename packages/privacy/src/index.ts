import type { SourceReference } from "@derive/domain";

export type ExposureControl = "full" | "redacted" | "summary-only";

export const defaultPrivacyPosture = {
  intake: "Questions can be asked without requiring account setup in v0.",
  storage: "Persistence is limited to the active local workflow.",
  sources: "Sources should be cited with purpose and exposure level, not dumped blindly."
} as const;

export function redactQuestionPreview(text: string): string {
  const normalized = text.trim();

  if (normalized.length <= 48) {
    return normalized;
  }

  return `${normalized.slice(0, 45)}...`;
}

export function describeSourceExposure(
  source: Pick<SourceReference, "title" | "kind">,
  control: ExposureControl
): string {
  if (control === "redacted") {
    return `Source details are restricted. ${source.title} is retained only as a trace anchor.`;
  }

  if (control === "summary-only") {
    return `${source.title} is surfaced as a cited ${source.kind} reference without external fetching.`;
  }

  return `${source.title} can be displayed as a ${source.kind} source in the current UI.`;
}
