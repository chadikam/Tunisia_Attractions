export type Place = {
  id: string;
  name: string;
  name_ar: string;
  name_fr: string;
  name_en: string;
  category: string;
  subcategory: string;
  wikidata: string;
  wikipedia: string;
  wikipedia_url: string;
  latitude: string;
  longitude: string;
};

export type LanguageCode = "en" | "fr" | "ar";
