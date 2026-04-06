import { useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { MapPage } from "./pages/map-page";
import { usePlaceFilters } from "./hooks/use-place-filters";
import { usePlaces } from "./hooks/use-places";
import type { LanguageCode } from "./types/place";

function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [mapType, setMapType] = useState<"winter-v4" | "streets-v4" | "dataviz-v4">("winter-v4");

  const { places } = usePlaces();

  const {
    search,
    setSearch,
    selectedCategory,
    setSelectedCategory,
    selectedSubcategory,
    setSelectedSubcategory,
    categories,
    subcategories,
    filteredPlaces,
  } = usePlaceFilters(places);

  return (
    <AppShell
      language={language}
      onLanguageChange={setLanguage}
      mapType={mapType}
      onMapTypeChange={setMapType}
      search={search}
      onSearchChange={setSearch}
      selectedCategory={selectedCategory}
      onCategoryChange={setSelectedCategory}
      selectedSubcategory={selectedSubcategory}
      onSubcategoryChange={setSelectedSubcategory}
      categories={categories}
      subcategories={subcategories}
    >
      <MapPage
        places={filteredPlaces}
        language={language}
        mapType={mapType}
      />
    </AppShell>
  );
}

export default App;
