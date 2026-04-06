import { useState } from "react";
import { AppShell } from "./components/layout/app-shell";
import { PlaceDetailsModal } from "./components/places/place-details-modal";
import { MapPage } from "./pages/map-page";
import { usePlaceFilters } from "./hooks/use-place-filters";
import { usePlaces } from "./hooks/use-places";
import type { LanguageCode, Place } from "./types/place";

function App() {
  const [language, setLanguage] = useState<LanguageCode>("en");
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);

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
        onOpenDetails={setSelectedPlace}
      />

      <PlaceDetailsModal
        place={selectedPlace}
        onClose={() => setSelectedPlace(null)}
      />
    </AppShell>
  );
}

export default App;
