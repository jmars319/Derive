export type Id = string;
export type TimestampMs = number;
export type UrlString = string;

export const SOURCE_KINDS = [
  "official-docs",
  "specification",
  "repository",
  "discussion",
  "internal-note"
] as const;

export type SourceKind = (typeof SOURCE_KINDS)[number];

export const CONFIDENCE_LEVELS = ["low", "medium", "high"] as const;

export type ConfidenceLevel = (typeof CONFIDENCE_LEVELS)[number];
export type SurfaceStatus = "active" | "scaffolded";

export function isConfidenceLevel(value: string): value is ConfidenceLevel {
  return (CONFIDENCE_LEVELS as readonly string[]).includes(value);
}
