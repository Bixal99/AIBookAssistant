/** Distinct slice colors for pie/donut charts (literary palette, high separation). */
export const CHART_SLICE_COLORS = [
  "#0f766e", // teal
  "#1e3a5f", // navy
  "#6b2a32", // maroon
  "#2563eb", // blue
  "#7c3aed", // violet
  "#047857", // green
  "#c2410c", // burnt orange
  "#a16207", // ochre
  "#be185d", // rose
  "#0e7490", // cyan
  "#4c1d95", // deep purple
  "#9a3412", // rust
] as const;

export function chartSliceColor(index: number): string {
  return CHART_SLICE_COLORS[index % CHART_SLICE_COLORS.length]!;
}
