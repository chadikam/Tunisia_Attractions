import { useMemo, useState } from "react";
import type { Place } from "../types/place";
import { normalizeText } from "../utils/place";

const ALL_VALUE = "all";

export function usePlaceFilters(places: Place[]) {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(ALL_VALUE);
  const [selectedSubcategory, setSelectedSubcategory] = useState(ALL_VALUE);

  const categories = useMemo(() => {
    const list = Array.from(new Set(places.map((p) => p.category).filter(Boolean)));
    return list.sort((a, b) => a.localeCompare(b));
  }, [places]);

  const subcategories = useMemo(() => {
    const source =
      selectedCategory === ALL_VALUE
        ? places
        : places.filter((place) => place.category === selectedCategory);

    const list = Array.from(new Set(source.map((p) => p.subcategory).filter(Boolean)));
    return list.sort((a, b) => a.localeCompare(b));
  }, [places, selectedCategory]);

  const filteredPlaces = useMemo(() => {
    const query = normalizeText(search);

    return places.filter((place) => {
      const matchesSearch =
        query.length === 0 ||
        normalizeText(place.name_en).includes(query) ||
        normalizeText(place.name_fr).includes(query) ||
        normalizeText(place.name_ar).includes(query) ||
        normalizeText(place.name).includes(query);

      const matchesCategory =
        selectedCategory === ALL_VALUE || place.category === selectedCategory;

      const matchesSubcategory =
        selectedSubcategory === ALL_VALUE ||
        place.subcategory === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [places, search, selectedCategory, selectedSubcategory]);

  return {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    categories,
    subcategories,
    filteredPlaces,
    allValue: ALL_VALUE,
  };
}
