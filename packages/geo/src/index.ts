export type GeoRegionHint = {
  countryCode: string;
  enabled: boolean;
  note: string;
};

export const inactiveGeoRegionHint: GeoRegionHint = {
  countryCode: "US",
  enabled: false,
  note: "Geo-aware ranking is intentionally inactive in v0."
};

export function isGeoEnabled(hint: GeoRegionHint): boolean {
  return hint.enabled;
}
