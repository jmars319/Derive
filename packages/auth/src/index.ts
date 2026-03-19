export type AuthMode = "anonymous" | "signed-in";

export type AccessPolicy = {
  authMode: AuthMode;
  canAskQuestion: boolean;
  canSaveHistory: boolean;
};

export const anonymousAccessPolicy: AccessPolicy = {
  authMode: "anonymous",
  canAskQuestion: true,
  canSaveHistory: false
};

export function describeAuthMode(mode: AuthMode): string {
  if (mode === "signed-in") {
    return "Signed-in mode can unlock saved history later, but Derive v0 assumes anonymous question intake.";
  }

  return "Anonymous mode is the default posture for low-friction question intake in v0.";
}
