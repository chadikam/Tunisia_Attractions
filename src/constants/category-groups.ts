import type { LanguageCode } from "../types/place";

export interface CategoryGroup {
  id: string;
  categories: string[];
  color: string;
  iconName: string;
}

/**
 * Groups of related categories, ordered by typical importance.
 * Each category should appear in exactly one group.
 */
export const CATEGORY_GROUPS: CategoryGroup[] = [
  {
    id: "history_heritage",
    categories: ["historic", "heritage", "landmark", "religious"],
    color: "#B45309",
    iconName: "history",
  },
  {
    id: "nature_outdoors",
    categories: ["nature", "park", "beach", "viewpoint", "protected area", "wildlife"],
    color: "#15803D",
    iconName: "nature",
  },
  {
    id: "culture_arts",
    categories: ["culture", "museum", "artwork"],
    color: "#7C3AED",
    iconName: "culture",
  },
  {
    id: "leisure_recreation",
    categories: ["leisure", "attraction"],
    color: "#0891B2",
    iconName: "leisure",
  },
  {
    id: "other",
    categories: ["other"],
    color: "#6B7280",
    iconName: "other",
  },
];

const groupLabels: Record<LanguageCode, Record<string, string>> = {
  en: {
    history_heritage: "History & Heritage",
    nature_outdoors: "Nature & Outdoors",
    culture_arts: "Culture & Arts",
    leisure_recreation: "Leisure & Recreation",
    other: "Other",
  },
  fr: {
    history_heritage: "Histoire & Patrimoine",
    nature_outdoors: "Nature & Plein air",
    culture_arts: "Culture & Arts",
    leisure_recreation: "Loisirs & Divertissement",
    other: "Autre",
  },
  ar: {
    history_heritage: "التاريخ والتراث",
    nature_outdoors: "الطبيعة والهواء الطلق",
    culture_arts: "الثقافة والفنون",
    leisure_recreation: "الترفيه والاستجمام",
    other: "أخرى",
  },
};

export function translateGroupLabel(language: LanguageCode, groupId: string): string {
  return groupLabels[language]?.[groupId] ?? groupId;
}

/**
 * Resolve which group a category belongs to.
 * Falls back to "other" if unrecognised.
 */
export function getCategoryGroupId(category: string): string {
  const normalised = category.trim().toLowerCase().replace(/[_-]+/g, " ");
  for (const group of CATEGORY_GROUPS) {
    if (group.categories.includes(normalised)) {
      return group.id;
    }
  }
  return "other";
}
