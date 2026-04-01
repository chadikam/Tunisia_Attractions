import placesData from "../data/places.json";
import type { Place } from "../types/place";

export function usePlaces() {
  const places = placesData as Place[];
  return { places };
}
