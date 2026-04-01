import type { LanguageCode, Place } from "../types/place";

export function getPlaceName(place: Place, language: LanguageCode): string {
  if (language === "ar") {
    return place.name_ar || place.name_en || place.name;
  }

  if (language === "fr") {
    return place.name_fr || place.name_en || place.name;
  }

  return place.name_en || place.name || place.name_fr || place.name_ar;
}

export function normalizeText(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

export function getGoogleMapsUrl(place: Place): string {
  const lat = Number.parseFloat(place.latitude);
  const lng = Number.parseFloat(place.longitude);

  if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
    return "https://maps.google.com";
  }

  return `https://www.google.com/maps?q=${lat},${lng}`;
}
