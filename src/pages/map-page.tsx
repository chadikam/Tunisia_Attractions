import { PlacesMap } from "../components/places/places-map";
import type { LanguageCode, Place } from "../types/place";

interface MapPageProps {
  places: Place[];
  language: LanguageCode;
  onOpenDetails: (place: Place) => void;
}

export function MapPage({ places, language, onOpenDetails }: MapPageProps) {
  return <PlacesMap places={places} language={language} onOpenDetails={onOpenDetails} />;
}
