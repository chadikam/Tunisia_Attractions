import { PlacesMap } from "../components/places/places-map";
import type { LanguageCode, Place } from "../types/place";

interface MapPageProps {
  places: Place[];
  language: LanguageCode;
  mapType: "winter-v4" | "streets-v4" | "dataviz-v4";
}

export function MapPage({ places, language, mapType }: MapPageProps) {
  return <PlacesMap places={places} language={language} mapType={mapType} />;
}
