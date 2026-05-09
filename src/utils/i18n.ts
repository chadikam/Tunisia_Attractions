import type { LanguageCode } from "../types/place";

type TranslationValue = string | ((params: Record<string, string | number>) => string);

type TranslationKey =
  | "siteTitle"
  | "siteSubtitle"
  | "filtersShow"
  | "filtersHide"
  | "preferredLanguage"
  | "currentLanguage"
  | "selectDisplayLanguage"
  | "appliesAcrossPlatform"
  | "searchFilters"
  | "mapType"
  | "mapTypeWinter"
  | "mapTypeStreets"
  | "mapTypeDataviz"
  | "searchLabel"
  | "searchPlaceholder"
  | "categoryLabel"
  | "selectAll"
  | "deselectAll"
  | "subcategoryLabel"
  | "allSubcategories"
  | "languageEn"
  | "languageFr"
  | "languageAr"
  | "selectedPoi"
  | "governorate"
  | "interestingPlaces"
  | "randomPicks"
  | "shownCount"
  | "poiCountInFilters"
  | "returnToGovernorate"
  | "returnToHeatmap"
  | "cardView"
  | "listView"
  | "seeOnGoogleMaps"
  | "wikipedia"
  | "descriptionLabel"
  | "coordinatesLabel"
  | "nameEnLabel"
  | "nameFrLabel"
  | "nameArLabel"
  | "noDescription"
  | "noPoisInFilters"
  | "loadingInteresting"
  | "failedToLoadPolygons"
  | "poisLabel"
  | "themeLabel"
  | "themeLight"
  | "themeDark"
  | "toggleTheme"
  | "preferences";

const translations: Record<LanguageCode, Record<TranslationKey, TranslationValue>> = {
  en: {
    siteTitle: "Tunisia Explorer",
    siteSubtitle: "Tourism Platform",
    filtersShow: "Show filters",
    filtersHide: "Hide filters",
    preferredLanguage: "Preferred Language",
    currentLanguage: ({ code }) => `Current: ${code}`,
    selectDisplayLanguage: "Select Display Language",
    appliesAcrossPlatform: "Applies across the platform",
    searchFilters: "Search & Filters",
    mapType: "Map Type",
    mapTypeWinter: "Winter",
    mapTypeStreets: "Streets",
    mapTypeDataviz: "Dataviz",
    searchLabel: "Search",
    searchPlaceholder: "Search by EN / FR / AR",
    categoryLabel: "Category",
    selectAll: "Select all",
    deselectAll: "Deselect all",
    subcategoryLabel: "Subcategory",
    allSubcategories: "All subcategories",
    languageEn: "EN - English",
    languageFr: "FR - French",
    languageAr: "AR - Arabic",
    selectedPoi: "Selected POI",
    governorate: "Governorate",
    interestingPlaces: "Interesting places",
    randomPicks: "Random picks with photos",
    shownCount: ({ count }) => `${count} shown`,
    poiCountInFilters: ({ count }) => `${count} POIs in current filters`,
    returnToGovernorate: ({ name }) => `Return to ${name}`,
    returnToHeatmap: "Return to heatmap",
    cardView: "Card view",
    listView: "List view",
    seeOnGoogleMaps: "See on Google Maps",
    wikipedia: "Wikipedia",
    descriptionLabel: "Description:",
    coordinatesLabel: "Coordinates:",
    nameEnLabel: "Name (EN):",
    nameFrLabel: "Name (FR):",
    nameArLabel: "Name (AR):",
    noDescription: "No description available.",
    noPoisInFilters: "No POIs in current filters.",
    loadingInteresting: "Loading interesting places with photos...",
    failedToLoadPolygons: ({ message }) => `Failed to load polygons: ${message}`,
    poisLabel: "POIs",
    themeLabel: "Theme",
    themeLight: "Light",
    themeDark: "Dark",
    toggleTheme: "Toggle theme",
    preferences: "Preferences",
  },
  fr: {
    siteTitle: "Explorateur de Tunisie",
    siteSubtitle: "Plateforme touristique",
    filtersShow: "Afficher les filtres",
    filtersHide: "Masquer les filtres",
    preferredLanguage: "Langue preferee",
    currentLanguage: ({ code }) => `Actuelle: ${code}`,
    selectDisplayLanguage: "Choisir la langue d'affichage",
    appliesAcrossPlatform: "S'applique a toute la plateforme",
    searchFilters: "Recherche & filtres",
    mapType: "Type de carte",
    mapTypeWinter: "Hiver",
    mapTypeStreets: "Rues",
    mapTypeDataviz: "Dataviz",
    searchLabel: "Recherche",
    searchPlaceholder: "Rechercher par EN / FR / AR",
    categoryLabel: "Categorie",
    selectAll: "Tout selectionner",
    deselectAll: "Tout deselectionner",
    subcategoryLabel: "Sous-categorie",
    allSubcategories: "Toutes les sous-categories",
    languageEn: "EN - Anglais",
    languageFr: "FR - Francais",
    languageAr: "AR - Arabe",
    selectedPoi: "Point d'interet",
    governorate: "Gouvernorat",
    interestingPlaces: "Lieux interessants",
    randomPicks: "Selections aleatoires avec photos",
    shownCount: ({ count }) => `${count} affiches`,
    poiCountInFilters: ({ count }) => `${count} POI dans les filtres`,
    returnToGovernorate: ({ name }) => `Retour a ${name}`,
    returnToHeatmap: "Retour a la carte thermique",
    cardView: "Vue carte",
    listView: "Vue liste",
    seeOnGoogleMaps: "Voir sur Google Maps",
    wikipedia: "Wikipedia",
    descriptionLabel: "Description:",
    coordinatesLabel: "Coordonnees:",
    nameEnLabel: "Nom (EN):",
    nameFrLabel: "Nom (FR):",
    nameArLabel: "Nom (AR):",
    noDescription: "Aucune description disponible.",
    noPoisInFilters: "Aucun POI dans les filtres.",
    loadingInteresting: "Chargement des lieux interessants avec photos...",
    failedToLoadPolygons: ({ message }) => `Echec du chargement des polygones: ${message}`,
    poisLabel: "POI",
    themeLabel: "Theme",
    themeLight: "Clair",
    themeDark: "Sombre",
    toggleTheme: "Basculer le theme",
    preferences: "Preferences",
  },
  ar: {
    siteTitle: "مستكشف تونس",
    siteSubtitle: "منصة سياحية",
    filtersShow: "عرض المرشحات",
    filtersHide: "اخفاء المرشحات",
    preferredLanguage: "اللغة المفضلة",
    currentLanguage: ({ code }) => `الحالية: ${code}`,
    selectDisplayLanguage: "اختر لغة العرض",
    appliesAcrossPlatform: "تطبق على المنصة كلها",
    searchFilters: "البحث والمرشحات",
    mapType: "نوع الخريطة",
    mapTypeWinter: "شتاء",
    mapTypeStreets: "شوارع",
    mapTypeDataviz: "بيانات",
    searchLabel: "بحث",
    searchPlaceholder: "ابحث بالانجليزية / الفرنسية / العربية",
    categoryLabel: "الفئة",
    selectAll: "تحديد الكل",
    deselectAll: "الغاء تحديد الكل",
    subcategoryLabel: "الفئة الفرعية",
    allSubcategories: "كل الفئات الفرعية",
    languageEn: "EN - انجليزية",
    languageFr: "FR - فرنسية",
    languageAr: "AR - عربية",
    selectedPoi: "معلم محدد",
    governorate: "ولاية",
    interestingPlaces: "اماكن مميزة",
    randomPicks: "اختيارات عشوائية مع صور",
    shownCount: ({ count }) => `معروض: ${count}`,
    poiCountInFilters: ({ count }) => `${count} معالم ضمن المرشحات`,
    returnToGovernorate: ({ name }) => `العودة الى ${name}`,
    returnToHeatmap: "العودة الى خريطة الحرارة",
    cardView: "عرض بطاقات",
    listView: "عرض قائمة",
    seeOnGoogleMaps: "عرض على خرائط جوجل",
    wikipedia: "ويكيبيديا",
    descriptionLabel: "الوصف:",
    coordinatesLabel: "الاحداثيات:",
    nameEnLabel: "الاسم (EN):",
    nameFrLabel: "الاسم (FR):",
    nameArLabel: "الاسم (AR):",
    noDescription: "لا يوجد وصف.",
    noPoisInFilters: "لا توجد معالم ضمن المرشحات.",
    loadingInteresting: "جاري تحميل اماكن مميزة مع صور...",
    failedToLoadPolygons: ({ message }) => `تعذر تحميل الحدود: ${message}`,
    poisLabel: "معالم",
    themeLabel: "المظهر",
    themeLight: "فاتح",
    themeDark: "داكن",
    toggleTheme: "تبديل المظهر",
    preferences: "التفضيلات",
  },
};

const categoryLabels: Record<LanguageCode, Record<string, string>> = {
  en: {
    artwork: "Artwork",
    attraction: "Attraction",
    beach: "Beach",
    culture: "Culture",
    heritage: "Heritage",
    historic: "Historic",
    landmark: "Landmark",
    leisure: "Leisure",
    museum: "Museum",
    nature: "Nature",
    other: "Other",
    park: "Park",
    protected_area: "Protected area",
    religious: "Religious",
    viewpoint: "Viewpoint",
    wildlife: "Wildlife",
  },
  fr: {
    artwork: "Oeuvre d'art",
    attraction: "Attraction",
    beach: "Plage",
    culture: "Culture",
    heritage: "Patrimoine",
    historic: "Historique",
    landmark: "Monument",
    leisure: "Loisirs",
    museum: "Musee",
    nature: "Nature",
    other: "Autre",
    park: "Parc",
    protected_area: "Zone protegee",
    religious: "Religieux",
    viewpoint: "Point de vue",
    wildlife: "Vie sauvage",
  },
  ar: {
    artwork: "اعمال فنية",
    attraction: "معلم سياحي",
    beach: "شاطئ",
    culture: "ثقافة",
    heritage: "تراث",
    historic: "تاريخي",
    landmark: "معلم بارز",
    leisure: "ترفيه",
    museum: "متحف",
    nature: "طبيعة",
    other: "اخرى",
    park: "متنزه",
    protected_area: "منطقة محمية",
    religious: "ديني",
    viewpoint: "نقطة مشاهدة",
    wildlife: "حياة برية",
  },
};

const subcategoryLabels: Record<LanguageCode, Record<string, string>> = {
  en: {
    aquarium: "Aquarium",
    aqueduct: "Aqueduct",
    archaeological_site: "Archaeological site",
    area: "Area",
    arts_centre: "Arts centre",
    artwork: "Artwork",
    attraction: "Attraction",
    battlefield: "Battlefield",
    beach: "Beach",
    building: "Building",
    castle: "Castle",
    cave_entrance: "Cave entrance",
    church: "Church",
    city_gate: "City gate",
    citywalls: "City walls",
    coastline: "Coastline",
    community_centre: "Community centre",
    fort: "Fort",
    forte_romano: "Roman fort",
    fortification: "Fortification",
    garden: "Garden",
    guest_house: "Guest house",
    historic: "Historic",
    historic_watchtower: "Historic watchtower",
    hot_spring: "Hot spring",
    hotel: "Hotel",
    library: "Library",
    lighthouse: "Lighthouse",
    manor: "Manor",
    marina: "Marina",
    memorial: "Memorial",
    monastery: "Monastery",
    monument: "Monument",
    museum: "Museum",
    nature_reserve: "Nature reserve",
    park: "Park",
    peak: "Peak",
    place_of_worship: "Place of worship",
    pub: "Pub",
    ruins: "Ruins",
    spring: "Spring",
    theatre: "Theatre",
    theme_park: "Theme park",
    tomb: "Tomb",
    tower: "Tower",
    viewpoint: "Viewpoint",
    water_park: "Water park",
    wetland: "Wetland",
    windmill: "Windmill",
    wreck: "Wreck",
    zoo: "Zoo",
  },
  fr: {
    aquarium: "Aquarium",
    aqueduct: "Aqueduc",
    archaeological_site: "Site archeologique",
    area: "Zone",
    arts_centre: "Centre d'arts",
    artwork: "Oeuvre d'art",
    attraction: "Attraction",
    battlefield: "Champ de bataille",
    beach: "Plage",
    building: "Batiment",
    castle: "Chateau",
    cave_entrance: "Entree de grotte",
    church: "Eglise",
    city_gate: "Porte de ville",
    citywalls: "Remparts",
    coastline: "Littoral",
    community_centre: "Centre communautaire",
    fort: "Fort",
    forte_romano: "Fort romain",
    fortification: "Fortification",
    garden: "Jardin",
    guest_house: "Maison d'hotes",
    historic: "Historique",
    historic_watchtower: "Tour de guet",
    hot_spring: "Source chaude",
    hotel: "Hotel",
    library: "Bibliotheque",
    lighthouse: "Phare",
    manor: "Manoir",
    marina: "Marina",
    memorial: "Memorial",
    monastery: "Monastere",
    monument: "Monument",
    museum: "Musee",
    nature_reserve: "Reserve naturelle",
    park: "Parc",
    peak: "Sommet",
    place_of_worship: "Lieu de culte",
    pub: "Pub",
    ruins: "Ruines",
    spring: "Source",
    theatre: "Theatre",
    theme_park: "Parc a theme",
    tomb: "Tombeau",
    tower: "Tour",
    viewpoint: "Point de vue",
    water_park: "Parc aquatique",
    wetland: "Zone humide",
    windmill: "Moulin a vent",
    wreck: "Epave",
    zoo: "Zoo",
  },
  ar: {
    aquarium: "حوض اسماك",
    aqueduct: "قناة مائية",
    archaeological_site: "موقع اثري",
    area: "منطقة",
    arts_centre: "مركز فنون",
    artwork: "عمل فني",
    attraction: "معلم سياحي",
    battlefield: "ساحة معركة",
    beach: "شاطئ",
    building: "مبنى",
    castle: "قلعة",
    cave_entrance: "مدخل كهف",
    church: "كنيسة",
    city_gate: "بوابة مدينة",
    citywalls: "اسوار المدينة",
    coastline: "الساحل",
    community_centre: "مركز مجتمعي",
    fort: "حصن",
    forte_romano: "حصن روماني",
    fortification: "تحصين",
    garden: "حديقة",
    guest_house: "بيت ضيافة",
    historic: "تاريخي",
    historic_watchtower: "برج مراقبة تاريخي",
    hot_spring: "ينبوع حار",
    hotel: "فندق",
    library: "مكتبة",
    lighthouse: "منارة",
    manor: "قصر",
    marina: "مرسى",
    memorial: "نصب تذكاري",
    monastery: "دير",
    monument: "نصب",
    museum: "متحف",
    nature_reserve: "محمية طبيعية",
    park: "متنزه",
    peak: "قمة",
    place_of_worship: "مكان عبادة",
    pub: "حانة",
    ruins: "اطلال",
    spring: "عين",
    theatre: "مسرح",
    theme_park: "مدينة ملاهي",
    tomb: "ضريح",
    tower: "برج",
    viewpoint: "نقطة مشاهدة",
    water_park: "مدينة مائية",
    wetland: "اراضي رطبة",
    windmill: "طاحونة هواء",
    wreck: "حطام",
    zoo: "حديقة حيوانات",
  },
};

function formatKeyLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export function translateCategory(language: LanguageCode, key: string): string {
  return categoryLabels[language][key] ?? formatKeyLabel(key);
}

export function translateSubcategory(language: LanguageCode, key: string): string {
  return subcategoryLabels[language][key] ?? formatKeyLabel(key);
}

export function t(language: LanguageCode, key: TranslationKey, params: Record<string, string | number> = {}): string {
  const value = translations[language][key];
  if (typeof value === "function") {
    return value(params);
  }
  return value;
}
