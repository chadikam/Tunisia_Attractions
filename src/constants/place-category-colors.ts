export type MarkerColor =
  | "blue"
  | "red"
  | "green"
  | "orange"
  | "yellow"
  | "violet"
  | "grey"
  | "black";

export const CATEGORY_MARKER_COLORS: Record<string, MarkerColor> = {
  heritage: "orange",
  historic: "red",
  religious: "violet",
  protected_area: "green",
  museum: "blue",
  landmark: "yellow",
};

const MARKER_COLOR_HEX: Record<MarkerColor, string> = {
  blue: "#3b82f6",
  red: "#ef4444",
  green: "#22c55e",
  orange: "#f97316",
  yellow: "#eab308",
  violet: "#a855f7",
  grey: "#6b7280",
  black: "#111827",
};

export function getCategoryColorHex(category: string): string {
  const markerColor = CATEGORY_MARKER_COLORS[category] ?? "blue";
  return MARKER_COLOR_HEX[markerColor];
}
