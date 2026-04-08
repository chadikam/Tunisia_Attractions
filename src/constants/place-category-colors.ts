export type MarkerColor =
  | "blue"
  | "red"
  | "green"
  | "orange"
  | "yellow"
  | "violet"
  | "grey"
  | "black";

export const categoryColors: Record<string, string> = {
  artwork: "#E91E63",
  attraction: "#FF9800",
  beach: "#03A9F4",
  culture: "#9C27B0",
  heritage: "#795548",
  historic: "#6D4C41",
  landmark: "#F44336",
  leisure: "#00BCD4",
  museum: "#3F51B5",
  nature: "#4CAF50",
  other: "#9E9E9E",
  park: "#8BC34A",
  "protected area": "#2E7D32",
  religious: "#FFC107",
  viewpoint: "#FF5722",
  wildlife: "#009688",
};

export const CATEGORY_MARKER_COLORS: Record<string, MarkerColor> = {
  artwork: "violet",
  attraction: "orange",
  beach: "blue",
  culture: "violet",
  heritage: "orange",
  historic: "red",
  landmark: "red",
  leisure: "blue",
  museum: "blue",
  nature: "green",
  other: "grey",
  park: "green",
  "protected area": "green",
  religious: "yellow",
  viewpoint: "orange",
  wildlife: "green",
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

function normalizeCategory(category: string): string {
  return category
    .trim()
    .toLowerCase()
    .replace(/[_-]+/g, " ")
    .replace(/\s+/g, " ");
}

export function getCategoryMarkerColor(category: string): MarkerColor {
  const normalizedCategory = normalizeCategory(category);
  return CATEGORY_MARKER_COLORS[normalizedCategory] ?? "blue";
}

export function getCategoryMarkerColorHex(category: string): string {
  return MARKER_COLOR_HEX[getCategoryMarkerColor(category)];
}

export function getCategoryColorHex(category: string): string {
  const normalizedCategory = normalizeCategory(category);

  return categoryColors[normalizedCategory] ?? categoryColors.other;
}
