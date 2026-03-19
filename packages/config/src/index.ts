export const appName = "Derive";
export const packageScope = "@derive";
export const activeSurface = "webapp";
export const scaffoldedSurfaces = ["desktopapp", "mobileapp"] as const;
export const defaultSourceMode = "mock";

export type PublicConfig = {
  appName: string;
  apiBaseUrl: string | null;
  sourceMode: "mock" | "live";
};

type EnvSource = Partial<Record<string, string | undefined>>;

export function readPublicConfig(env: EnvSource = {}): PublicConfig {
  const sourceMode = env.DERIVE_SOURCE_MODE === "live" ? "live" : "mock";

  return {
    appName: env.NEXT_PUBLIC_APP_NAME?.trim() || env.APP_NAME?.trim() || appName,
    apiBaseUrl: env.NEXT_PUBLIC_API_BASE_URL?.trim() || null,
    sourceMode
  };
}
