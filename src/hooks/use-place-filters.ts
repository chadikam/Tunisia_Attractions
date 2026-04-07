import { useEffect, useMemo, useRef, useState } from "react";
import type { Place } from "../types/place";
import { normalizeText } from "../utils/place";

const ALL_VALUE = "all";

export function usePlaceFilters(places: Place[]) {
  const [search, setSearch] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(ALL_VALUE);
  const categoriesInitializedRef = useRef(false);

  const subcategoryToCategory = useMemo(() => {
    const lookup = new Map<string, string>();

    places.forEach((place) => {
      if (!place.subcategory || !place.category || lookup.has(place.subcategory)) {
        return;
      }

      lookup.set(place.subcategory, place.category);
    });

    return lookup;
  }, [places]);

  const categories = useMemo(() => {
    const list = Array.from(new Set(places.map((p) => p.category).filter(Boolean)));
    return list.sort((a, b) => a.localeCompare(b));
  }, [places]);

  useEffect(() => {
    setSelectedCategories((previous) => {
      const validSelections = previous.filter((category) => categories.includes(category));

      if (!categoriesInitializedRef.current) {
        categoriesInitializedRef.current = true;
        return categories;
      }

      return validSelections;
    });
  }, [categories]);

  const subcategories = useMemo(() => {
    const source =
      selectedCategories.length === 0
        ? places
        : places.filter((place) => selectedCategories.includes(place.category));

    const list = Array.from(new Set(source.map((p) => p.subcategory).filter(Boolean)));
    return list.sort((a, b) => a.localeCompare(b));
  }, [places, selectedCategories]);

  const categoryCounts = useMemo(() => {
    const query = normalizeText(search);
    const counts = new Map<string, number>();

    categories.forEach((category) => {
      counts.set(category, 0);
    });

    places.forEach((place) => {
      const matchesSearch =
        query.length === 0 ||
        normalizeText(place.name_en).includes(query) ||
        normalizeText(place.name_fr).includes(query) ||
        normalizeText(place.name_ar).includes(query) ||
        normalizeText(place.name).includes(query);

      const matchesSubcategory =
        selectedSubcategory === ALL_VALUE ||
        place.subcategory === selectedSubcategory;

      if (matchesSearch && matchesSubcategory) {
        counts.set(place.category, (counts.get(place.category) ?? 0) + 1);
      }
    });

    return counts;
  }, [categories, places, search, selectedSubcategory]);

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
        selectedCategories.length > 0 && selectedCategories.includes(place.category);

      const matchesSubcategory =
        selectedSubcategory === ALL_VALUE ||
        place.subcategory === selectedSubcategory;

      return matchesSearch && matchesCategory && matchesSubcategory;
    });
  }, [places, search, selectedCategories, selectedSubcategory]);

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories((previous) => {
      const next = previous.includes(category)
        ? previous.filter((item) => item !== category)
        : [...previous, category];

      if (selectedSubcategory !== ALL_VALUE) {
        const matchedCategory = subcategoryToCategory.get(selectedSubcategory);
        if (matchedCategory && !next.includes(matchedCategory)) {
          setSelectedSubcategory(ALL_VALUE);
        }
      }

      return next;
    });
  };

  const handleSubcategoryChange = (nextSubcategory: string) => {
    setSelectedSubcategory(nextSubcategory);

    if (nextSubcategory === ALL_VALUE) {
      return;
    }

    const matchedCategory = subcategoryToCategory.get(nextSubcategory);
    if (matchedCategory) {
      setSelectedCategories([matchedCategory]);
    }
  };

  return {
    search,
    setSearch,
    selectedCategories,
    toggleCategory: handleCategoryToggle,
    selectedSubcategory,
    setSelectedSubcategory: handleSubcategoryChange,
    categories,
    categoryCounts,
    subcategories,
    filteredPlaces,
    allValue: ALL_VALUE,
  };
}
