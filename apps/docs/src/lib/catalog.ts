import catalogSummary from "@velora/catalog/summary";
import presetsBundle from "@velora/catalog/presets";
import compatMatrix from "@velora/catalog/compatibility-matrix";

export type CatalogSummary = typeof catalogSummary;
export type Preset = (typeof presetsBundle.presets)[number];
export type CompatibilityMatrix = typeof compatMatrix;

export function getCatalogSummary(): CatalogSummary {
  return catalogSummary;
}

export function getPresetsByAttribute(attribute: string): Preset[] {
  return presetsBundle.presets
    .filter((preset) => preset.attribute === attribute)
    .sort((a, b) => a.name.localeCompare(b.name));
}

export function getCompatibilityMatrix(): CompatibilityMatrix {
  return compatMatrix;
}

export function formatChannelLabel(channel: string): string {
  if (channel === "pageTransition") return "page transition";
  return channel;
}

export function formatGeneratedAt(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}
