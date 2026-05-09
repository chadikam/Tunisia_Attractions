import { useEffect, useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { MapPage } from "./pages/map-page";
import { usePlaceFilters } from "./hooks/use-place-filters";
import { usePlaces } from "./hooks/use-places";
import type { LanguageCode } from "./types/place";
import { t } from "./utils/i18n";

function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [mapType, setMapType] = useState<"winter-v4" | "streets-v4" | "dataviz-v4">("streets-v4");
  const [theme, setTheme] = useState<"light" | "dark">(() => {
    if (typeof window === "undefined") {
      return "light";
    }
    const stored = window.localStorage.getItem("theme");
    if (stored === "light" || stored === "dark") {
      return stored;
    }
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches ?? false;
    return prefersDark ? "dark" : "light";
  });

  const { places } = usePlaces();

  const {
    search,
    setSearch,
    selectedCategories,
    toggleCategory,
    selectAllCategories,
    deselectAllCategories,
    selectedSubcategory,
    setSelectedSubcategory,
    categories,
    categoryCounts,
    subcategories,
    filteredPlaces,
  } = usePlaceFilters(places);

  useEffect(() => {
    document.title = t(language, "siteTitle");
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
  }, [language]);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    window.localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <>
      <AppShell
        language={language}
        onLanguageChange={setLanguage}
        mapType={mapType}
        onMapTypeChange={setMapType}
        theme={theme}
        onThemeToggle={() => setTheme((prev) => (prev === "dark" ? "light" : "dark"))}
        search={search}
        onSearchChange={setSearch}
        selectedCategories={selectedCategories}
        onCategoryToggle={toggleCategory}
        onCategorySelectAll={selectAllCategories}
        onCategoryDeselectAll={deselectAllCategories}
        selectedSubcategory={selectedSubcategory}
        onSubcategoryChange={setSelectedSubcategory}
        categories={categories}
        categoryCounts={categoryCounts}
        subcategories={subcategories}
      >
        <MapPage
          places={filteredPlaces}
          language={language}
          mapType={mapType}
        />
      </AppShell>
    </>
  );
}

export default App;
