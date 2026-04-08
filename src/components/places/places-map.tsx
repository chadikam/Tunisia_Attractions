import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, LayoutGrid, Rows3 } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LanguageCode, Place } from "../../types/place";
import { getGoogleMapsUrl, getPlaceName } from "../../utils/place";
import { getCategoryMarkerColor } from "../../constants/place-category-colors";

interface PlacesMapProps {
  places: Place[];
  language: LanguageCode;
  mapType: "winter-v4" | "streets-v4" | "dataviz-v4";
}

type Position2D = [number, number];
type LinearRing = Position2D[];
type PolygonCoordinates = LinearRing[];
type MultiPolygonCoordinates = PolygonCoordinates[];

interface RegionFeature {
  type: "Feature";
  properties: {
    name: string;
  };
  geometry:
    | {
        type: "Polygon";
        coordinates: PolygonCoordinates;
      }
    | {
        type: "MultiPolygon";
        coordinates: MultiPolygonCoordinates;
      };
}

interface RegionFeatureCollection {
  type: "FeatureCollection";
  features: RegionFeature[];
}

interface PlacePoint {
  place: Place;
  lat: number;
  lng: number;
}

interface WikiSummary {
  description: string;
  imageUrl: string;
  articleUrl: string;
}

interface GovernorateAnchor {
  name: string;
  lat: number;
  lng: number;
}

const TUNISIA_BOUNDS: L.LatLngBoundsExpression = [
  [30.2, 7.5],
  [37.8, 11.9],
];

const MAP_TILER_KEY = "akle7B8oEVS11sHZUeyd";
const MIN_RANDOM_PHOTO_POIS = 9;
const RANDOM_PHOTO_FETCH_BASE = 48;

const GOVERNORATE_ANCHORS: GovernorateAnchor[] = [
  { name: "Ariana", lat: 36.8665, lng: 10.1647 },
  { name: "Beja", lat: 36.7333, lng: 9.1833 },
  { name: "Ben Arous", lat: 36.7531, lng: 10.2217 },
  { name: "Bizerte", lat: 37.2744, lng: 9.8739 },
  { name: "Gabes", lat: 33.8815, lng: 10.0982 },
  { name: "Gafsa", lat: 34.425, lng: 8.7842 },
  { name: "Jendouba", lat: 36.5011, lng: 8.7802 },
  { name: "Kairouan", lat: 35.6781, lng: 10.0963 },
  { name: "Kasserine", lat: 35.1676, lng: 8.8365 },
  { name: "Kebili", lat: 33.7072, lng: 8.969 },
  { name: "Kef", lat: 36.1742, lng: 8.7049 },
  { name: "Mahdia", lat: 35.5047, lng: 11.0622 },
  { name: "Manouba", lat: 36.8101, lng: 10.0963 },
  { name: "Medenine", lat: 33.3549, lng: 10.5055 },
  { name: "Monastir", lat: 35.777, lng: 10.8262 },
  { name: "Nabeul", lat: 36.4513, lng: 10.7357 },
  { name: "Sfax", lat: 34.7406, lng: 10.7603 },
  { name: "Sidi Bouzid", lat: 35.0382, lng: 9.4849 },
  { name: "Siliana", lat: 36.0833, lng: 9.3667 },
  { name: "Sousse", lat: 35.8256, lng: 10.636 },
  { name: "Tataouine", lat: 32.9297, lng: 10.4518 },
  { name: "Tozeur", lat: 33.9197, lng: 8.1335 },
  { name: "Tunis", lat: 36.8065, lng: 10.1815 },
  { name: "Zaghouan", lat: 36.4029, lng: 10.1429 },
];

const LEAFLET_MARKER_SHADOW_URL = "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png";

function createMapTilerLayer(mapType: "winter-v4" | "streets-v4" | "dataviz-v4"): L.TileLayer {
  return L.tileLayer(`https://api.maptiler.com/maps/${mapType}/{z}/{x}/{y}.png?key=${MAP_TILER_KEY}`, {
    attribution:
      '&copy; <a href="https://www.maptiler.com/copyright/" target="_blank" rel="noreferrer">MapTiler</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
    maxZoom: 19,
    tileSize: 512,
    zoomOffset: -1,
    crossOrigin: true,
  });
}

function isFeatureCollection(value: unknown): value is RegionFeatureCollection {
  if (!value || typeof value !== "object") {
    return false;
  }

  const record = value as { type?: unknown; features?: unknown };
  return record.type === "FeatureCollection" && Array.isArray(record.features);
}

function pointInRing(lng: number, lat: number, ring: LinearRing): boolean {
  let inside = false;

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];

    const intersects =
      yi > lat !== yj > lat &&
      lng < ((xj - xi) * (lat - yi)) / ((yj - yi) || Number.EPSILON) + xi;

    if (intersects) {
      inside = !inside;
    }
  }

  return inside;
}

function pointInPolygon(lng: number, lat: number, polygon: PolygonCoordinates): boolean {
  if (polygon.length === 0) {
    return false;
  }

  const [outerRing, ...holes] = polygon;

  if (!pointInRing(lng, lat, outerRing)) {
    return false;
  }

  for (const hole of holes) {
    if (pointInRing(lng, lat, hole)) {
      return false;
    }
  }

  return true;
}

function pointInFeature(lng: number, lat: number, feature: RegionFeature): boolean {
  if (feature.geometry.type === "Polygon") {
    return pointInPolygon(lng, lat, feature.geometry.coordinates);
  }

  for (const polygon of feature.geometry.coordinates) {
    if (pointInPolygon(lng, lat, polygon)) {
      return true;
    }
  }

  return false;
}

function getFeatureCenter(feature: RegionFeature): { lat: number; lng: number } {
  const points: Position2D[] = [];

  if (feature.geometry.type === "Polygon") {
    feature.geometry.coordinates.forEach((ring) => {
      ring.forEach((point) => points.push(point));
    });
  } else {
    feature.geometry.coordinates.forEach((polygon) => {
      polygon.forEach((ring) => {
        ring.forEach((point) => points.push(point));
      });
    });
  }

  if (points.length === 0) {
    return { lat: 0, lng: 0 };
  }

  const { latSum, lngSum } = points.reduce(
    (acc, [lng, lat]) => ({
      latSum: acc.latSum + lat,
      lngSum: acc.lngSum + lng,
    }),
    { latSum: 0, lngSum: 0 },
  );

  return {
    lat: latSum / points.length,
    lng: lngSum / points.length,
  };
}

function distanceSquared(aLat: number, aLng: number, bLat: number, bLng: number): number {
  const dLat = aLat - bLat;
  const dLng = aLng - bLng;
  return dLat * dLat + dLng * dLng;
}

function mapUnknownRegionsToGovernorates(features: RegionFeature[]): RegionFeature[] {
  const allUnknown = features.every((feature) => {
    const rawName = feature.properties.name?.trim().toLowerCase();
    return !rawName || rawName === "unknown";
  });

  if (!allUnknown || features.length !== GOVERNORATE_ANCHORS.length) {
    return features;
  }

  const featureCenters = features.map((feature, index) => ({
    index,
    center: getFeatureCenter(feature),
  }));
  const remainingFeatureIndexes = new Set(featureCenters.map((item) => item.index));
  const remainingGovernorates = new Set(GOVERNORATE_ANCHORS.map((_, index) => index));
  const assignedNameByFeature = new Map<number, string>();

  while (remainingFeatureIndexes.size > 0 && remainingGovernorates.size > 0) {
    let bestFeatureIndex = -1;
    let bestGovernorateIndex = -1;
    let bestDistance = Number.POSITIVE_INFINITY;

    remainingFeatureIndexes.forEach((featureIndex) => {
      const center = featureCenters[featureIndex].center;

      remainingGovernorates.forEach((governorateIndex) => {
        const anchor = GOVERNORATE_ANCHORS[governorateIndex];
        const dist = distanceSquared(center.lat, center.lng, anchor.lat, anchor.lng);

        if (dist < bestDistance) {
          bestDistance = dist;
          bestFeatureIndex = featureIndex;
          bestGovernorateIndex = governorateIndex;
        }
      });
    });

    if (bestFeatureIndex === -1 || bestGovernorateIndex === -1) {
      break;
    }

    assignedNameByFeature.set(bestFeatureIndex, GOVERNORATE_ANCHORS[bestGovernorateIndex].name);
    remainingFeatureIndexes.delete(bestFeatureIndex);
    remainingGovernorates.delete(bestGovernorateIndex);
  }

  return features.map((feature, index) => ({
    ...feature,
    properties: {
      ...feature.properties,
      name: assignedNameByFeature.get(index) ?? feature.properties.name,
    },
  }));
}

function normalizeRegionNames(features: RegionFeature[]): RegionFeature[] {
  const maybeNamedFeatures = mapUnknownRegionsToGovernorates(features);
  const usedNames = new Map<string, number>();

  return maybeNamedFeatures.map((feature, index) => {
    const rawName = feature.properties.name?.trim();
    const baseName =
      rawName && rawName.toLowerCase() !== "unknown" ? rawName : `Region ${index + 1}`;
    const duplicateCount = (usedNames.get(baseName) ?? 0) + 1;
    usedNames.set(baseName, duplicateCount);

    const uniqueName = duplicateCount === 1 ? baseName : `${baseName} (${duplicateCount})`;

    return {
      ...feature,
      properties: {
        ...feature.properties,
        name: uniqueName,
      },
    };
  });
}

function getWikipediaApiUrl(place: Place): string | null {
  if (!place.wikipedia_url) {
    return null;
  }

  try {
    const source = new URL(place.wikipedia_url);
    const title = decodeURIComponent(source.pathname.split("/").pop() ?? "").trim();
    if (!title) {
      return null;
    }
    return `${source.origin}/api/rest_v1/page/summary/${encodeURIComponent(title)}`;
  } catch {
    return null;
  }
}

function createCategoryMarkerIcon(
  category: string,
  selected: boolean,
): L.Icon {
  const color = getCategoryMarkerColor(category);
  const normalColor = selected ? "black" : color;

  return L.icon({
    iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-${normalColor}.png`,
    iconRetinaUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${normalColor}.png`,
    shadowUrl: LEAFLET_MARKER_SHADOW_URL,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    tooltipAnchor: [12, -28],
    shadowSize: [41, 41],
  });
}

export function PlacesMap({ places, language, mapType }: PlacesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const baseLayerRef = useRef<L.TileLayer | null>(null);
  const polygonsLayerRef = useRef<L.LayerGroup | null>(null);
  const poiLayerRef = useRef<L.LayerGroup | null>(null);

  const [features, setFeatures] = useState<RegionFeature[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [selectedPlaceId, setSelectedPlaceId] = useState<string | null>(null);
  const [poiPanelView, setPoiPanelView] = useState<"card" | "list">("card");
  const [loadError, setLoadError] = useState<string | null>(null);
  const [wikiByPlaceId, setWikiByPlaceId] = useState<Record<string, WikiSummary>>({});
  const wikiRequestedRef = useRef<Set<string>>(new Set());

  const indexedPlaces = useMemo<PlacePoint[]>(() => {
    return places
      .map((place) => {
        const lat = Number.parseFloat(place.latitude);
        const lng = Number.parseFloat(place.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return { place, lat, lng };
      })
      .filter((item): item is PlacePoint => item !== null);
  }, [places]);

  const randomInterestingPool = useMemo(() => {
    const items = [...indexedPlaces];
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = Math.floor(Math.random() * (i + 1));
      const temp = items[i];
      items[i] = items[j];
      items[j] = temp;
    }
    return items;
  }, [indexedPlaces]);

  const placeRegionById = useMemo(() => {
    const lookup = new Map<string, string>();

    if (features.length === 0) {
      return lookup;
    }

    for (const point of indexedPlaces) {
      const match = features.find((feature) => pointInFeature(point.lng, point.lat, feature));
      if (match) {
        lookup.set(point.place.id, match.properties.name);
      }
    }

    return lookup;
  }, [features, indexedPlaces]);

  const countByRegion = useMemo(() => {
    const counts = new Map<string, number>();

    for (const feature of features) {
      counts.set(feature.properties.name, 0);
    }

    for (const point of indexedPlaces) {
      const region = placeRegionById.get(point.place.id);
      if (!region) {
        continue;
      }
      counts.set(region, (counts.get(region) ?? 0) + 1);
    }

    return counts;
  }, [features, indexedPlaces, placeRegionById]);

  const visiblePlaces = useMemo(() => {
    if (!selectedRegion) {
      return [] as PlacePoint[];
    }

    return indexedPlaces.filter(
      (point) => placeRegionById.get(point.place.id) === selectedRegion,
    );
  }, [indexedPlaces, placeRegionById, selectedRegion]);

  const selectedPlacePoint = useMemo(() => {
    if (!selectedPlaceId) {
      return null;
    }

    return indexedPlaces.find((point) => point.place.id === selectedPlaceId) ?? null;
  }, [indexedPlaces, selectedPlaceId]);

  const sortedVisiblePlaces = useMemo(() => {
    const list = [...visiblePlaces];

    list.sort((a, b) => {
      const aWiki = wikiByPlaceId[a.place.id];
      const bWiki = wikiByPlaceId[b.place.id];
      const aHasBoth = Boolean(aWiki?.imageUrl && aWiki?.description);
      const bHasBoth = Boolean(bWiki?.imageUrl && bWiki?.description);

      if (aHasBoth !== bHasBoth) {
        return bHasBoth ? 1 : -1;
      }

      const aName = getPlaceName(a.place, language);
      const bName = getPlaceName(b.place, language);
      return aName.localeCompare(bName);
    });

    return list;
  }, [language, visiblePlaces, wikiByPlaceId]);

  const interestingPlaces = useMemo(() => {
    return randomInterestingPool
      .filter((point) => Boolean(wikiByPlaceId[point.place.id]?.imageUrl))
      .slice(0, 12);
  }, [randomInterestingPool, wikiByPlaceId]);

  useEffect(() => {
    if (!selectedPlaceId) {
      return;
    }

    const stillVisible = indexedPlaces.some((point) => point.place.id === selectedPlaceId);
    if (!stillVisible) {
      setSelectedPlaceId(null);
    }
  }, [indexedPlaces, selectedPlaceId]);

  useEffect(() => {
    if (!selectedRegion || !selectedPlaceId) {
      return;
    }

    const isInSelectedRegion = visiblePlaces.some((point) => point.place.id === selectedPlaceId);
    if (!isInSelectedRegion) {
      setSelectedPlaceId(null);
    }
  }, [selectedPlaceId, selectedRegion, visiblePlaces]);

  useEffect(() => {
    if (!selectedRegion) {
      return;
    }

    const candidates = visiblePlaces.slice(0, 30).map((point) => point.place);

    candidates.forEach((place) => {
      if (wikiRequestedRef.current.has(place.id)) {
        return;
      }

      const apiUrl = getWikipediaApiUrl(place);
      if (!apiUrl) {
        wikiRequestedRef.current.add(place.id);
        return;
      }

      wikiRequestedRef.current.add(place.id);

      void fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Wikipedia summary not available");
          }
          return response.json() as Promise<{
            extract?: string;
            thumbnail?: { source?: string };
            content_urls?: { desktop?: { page?: string } };
          }>;
        })
        .then((summary) => {
          const description = summary.extract?.trim() ?? "";
          const imageUrl = summary.thumbnail?.source ?? "";
          const articleUrl = summary.content_urls?.desktop?.page ?? place.wikipedia_url ?? "";

          setWikiByPlaceId((previous) => ({
            ...previous,
            [place.id]: {
              description,
              imageUrl,
              articleUrl,
            },
          }));
        })
        .catch(() => {
          setWikiByPlaceId((previous) => ({
            ...previous,
            [place.id]: {
              description: "",
              imageUrl: "",
              articleUrl: place.wikipedia_url ?? "",
            },
          }));
        });
    });
  }, [selectedRegion, visiblePlaces]);

  useEffect(() => {
    if (selectedRegion) {
      return;
    }

    const currentlyWithPhotos = randomInterestingPool.filter(
      (point) => Boolean(wikiByPlaceId[point.place.id]?.imageUrl),
    ).length;

    if (currentlyWithPhotos >= MIN_RANDOM_PHOTO_POIS) {
      return;
    }

    const missingPhotoCount = MIN_RANDOM_PHOTO_POIS - currentlyWithPhotos;
    const fetchBudget = Math.min(
      randomInterestingPool.length,
      Math.max(RANDOM_PHOTO_FETCH_BASE, missingPhotoCount * 14),
    );

    const candidates = randomInterestingPool.slice(0, fetchBudget).map((point) => point.place);

    candidates.forEach((place) => {
      if (wikiRequestedRef.current.has(place.id)) {
        return;
      }

      const apiUrl = getWikipediaApiUrl(place);
      if (!apiUrl) {
        wikiRequestedRef.current.add(place.id);
        return;
      }

      wikiRequestedRef.current.add(place.id);

      void fetch(apiUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Wikipedia summary not available");
          }
          return response.json() as Promise<{
            extract?: string;
            thumbnail?: { source?: string };
            content_urls?: { desktop?: { page?: string } };
          }>;
        })
        .then((summary) => {
          const description = summary.extract?.trim() ?? "";
          const imageUrl = summary.thumbnail?.source ?? "";
          const articleUrl = summary.content_urls?.desktop?.page ?? place.wikipedia_url ?? "";

          setWikiByPlaceId((previous) => ({
            ...previous,
            [place.id]: {
              description,
              imageUrl,
              articleUrl,
            },
          }));
        })
        .catch(() => {
          setWikiByPlaceId((previous) => ({
            ...previous,
            [place.id]: {
              description: "",
              imageUrl: "",
              articleUrl: place.wikipedia_url ?? "",
            },
          }));
        });
    });
  }, [randomInterestingPool, selectedRegion, wikiByPlaceId]);

  function focusPlace(point: PlacePoint): void {
    const map = mapRef.current;
    setSelectedPlaceId(point.place.id);
    if (map) {
      map.flyTo([point.lat, point.lng], 10, { duration: 0.7 });
    }
  }

  function resetToHeatmap(): void {
    setSelectedPlaceId(null);
    setSelectedRegion(null);

    const map = mapRef.current;
    if (map) {
      map.fitBounds(TUNISIA_BOUNDS, { padding: [24, 24] });
    }
  }

  function returnToSelectedGovernorate(): void {
    setSelectedPlaceId(null);

    if (!selectedRegion || features.length === 0) {
      return;
    }

    const map = mapRef.current;
    if (!map) {
      return;
    }

    const feature = features.find((item) => item.properties.name === selectedRegion);
    if (!feature) {
      return;
    }

    const bounds = L.geoJSON(feature as never).getBounds();
    if (bounds.isValid()) {
      map.fitBounds(bounds, { padding: [24, 24], maxZoom: 9 });
    }
  }

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      preferCanvas: true,
      maxBounds: TUNISIA_BOUNDS,
      maxBoundsViscosity: 1,
      minZoom: 7,
      maxZoom: 30,
      worldCopyJump: false,
    }).setView([34.0, 9.5], 7);

    const baseLayer = createMapTilerLayer(mapType);
    baseLayer.addTo(map);
    baseLayerRef.current = baseLayer;

    map.fitBounds(TUNISIA_BOUNDS, { padding: [24, 24] });

    mapRef.current = map;

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
      baseLayerRef.current = null;
      polygonsLayerRef.current = null;
      poiLayerRef.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (baseLayerRef.current) {
      baseLayerRef.current.remove();
    }

    const baseLayer = createMapTilerLayer(mapType);
    baseLayer.addTo(map);
    baseLayerRef.current = baseLayer;
  }, [mapType]);

  useEffect(() => {
    const url = `${import.meta.env.BASE_URL}tunisia_governorates_clean.geojson`;

    let active = true;
    setLoadError(null);

    void fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to load GeoJSON (${response.status})`);
        }
        return response.json();
      })
      .then((data: unknown) => {
        if (!active) {
          return;
        }

        if (!isFeatureCollection(data)) {
          throw new Error("Invalid GeoJSON structure");
        }

        setFeatures(normalizeRegionNames(data.features));
      })
      .catch((error: unknown) => {
        if (!active) {
          return;
        }

        const message = error instanceof Error ? error.message : "Failed to load polygons";
        setLoadError(message);
        setFeatures([]);
      });

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const map = mapRef.current;
    if (!map || features.length === 0) {
      return;
    }

    if (polygonsLayerRef.current) {
      polygonsLayerRef.current.remove();
      polygonsLayerRef.current = null;
    }

    if (selectedRegion || selectedPlaceId) {
      return;
    }

    const polygonsLayer = L.layerGroup();
    const maxCount = Math.max(1, ...countByRegion.values());

    const geoJsonLayer = L.geoJSON(features as never, {
      style: (featureData) => {
        const props = (featureData?.properties ?? {}) as { name?: string };
        const regionName = props.name ?? "";
        const count = countByRegion.get(regionName) ?? 0;
        const intensity = count / maxCount;
        return {
          color: "#0d47a1",
          weight: 1,
          fillColor: "#1565c0",
          fillOpacity: 0.15 + intensity * 0.6,
        };
      },
      onEachFeature: (featureData, layer) => {
        const props = (featureData.properties ?? {}) as { name?: string };
        const regionName = props.name ?? "Unknown";
        const count = countByRegion.get(regionName) ?? 0;

        layer.bindTooltip(`${regionName} (${count})`, {
          sticky: true,
          direction: "top",
        });

        layer.bindPopup(`<strong>${regionName}</strong><br/>POIs: ${count}`);

        layer.on("click", () => {
          setSelectedRegion((previous) => {
            const nextRegion = previous === regionName ? null : regionName;
            if (nextRegion !== previous) {
              setSelectedPlaceId(null);
            }
            return nextRegion;
          });
          const bounds = (layer as L.Polygon).getBounds();
          map.fitBounds(bounds, { padding: [24, 24], maxZoom: 9 });
        });
      },
    });

    geoJsonLayer.addTo(polygonsLayer);
    polygonsLayer.addTo(map);
    polygonsLayerRef.current = polygonsLayer;
  }, [countByRegion, features, selectedPlaceId, selectedRegion]);

  useEffect(() => {
    const map = mapRef.current;
    if (!map) {
      return;
    }

    if (poiLayerRef.current) {
      poiLayerRef.current.remove();
    }

    const poiLayer = L.layerGroup();

    if (selectedRegion) {
      sortedVisiblePlaces.forEach((point) => {
        const isSelectedPlace = selectedPlaceId === point.place.id;
        const marker = L.marker([point.lat, point.lng], {
          icon: createCategoryMarkerIcon(point.place.category, isSelectedPlace),
          zIndexOffset: isSelectedPlace ? 1000 : 0,
        });

        marker.bindTooltip(getPlaceName(point.place, language), {
          sticky: true,
          direction: "top",
        });

        marker.on("click", () => {
          focusPlace(point);
        });
        marker.addTo(poiLayer);
      });
    }

    poiLayer.addTo(map);
    poiLayerRef.current = poiLayer;
  }, [language, selectedPlaceId, selectedRegion, sortedVisiblePlaces]);

  return (
    <div className="space-y-2">
      {loadError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Failed to load polygons: {loadError}
        </div>
      ) : null}

      <div className="flex h-[calc(100svh-2rem)] w-full gap-4">
        <div
          ref={mapContainerRef}
          className="h-full w-1/3 shrink-0 rounded-xl border"
        />

        <div className="h-full min-w-0 flex-1 rounded-xl border bg-card">
          {selectedPlacePoint ? (
            <div className="flex h-full flex-col">
              <div className="border-b px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Selected POI</p>
                    <h3 className="text-lg font-semibold">{getPlaceName(selectedPlacePoint.place, language)}</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPlacePoint.place.category} / {selectedPlacePoint.place.subcategory}
                    </p>
                  </div>
                  <button
                    type="button"
                    className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-md border hover:bg-muted"
                    onClick={returnToSelectedGovernorate}
                    aria-label={`Return to ${selectedRegion ?? "governorate"}`}
                    title={`Return to ${selectedRegion ?? "governorate"}`}
                  >
                    <ArrowLeft className="size-4" />
                  </button>
                </div>
              </div>
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3 text-sm">
                {wikiByPlaceId[selectedPlacePoint.place.id]?.imageUrl ? (
                  <img
                    src={wikiByPlaceId[selectedPlacePoint.place.id].imageUrl}
                    alt={getPlaceName(selectedPlacePoint.place, language)}
                    className="mb-3 h-44 w-full rounded-md border object-cover"
                  />
                ) : null}

                <div className="space-y-2">
                  <p>
                    <span className="font-medium">Name (EN):</span> {selectedPlacePoint.place.name_en || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Name (FR):</span> {selectedPlacePoint.place.name_fr || "N/A"}
                  </p>
                  <p dir="rtl">
                    <span className="font-medium">Name (AR):</span> {selectedPlacePoint.place.name_ar || "N/A"}
                  </p>
                  <p>
                    <span className="font-medium">Description:</span>{" "}
                    {wikiByPlaceId[selectedPlacePoint.place.id]?.description || "No description available."}
                  </p>
                  <p>
                    <span className="font-medium">Coordinates:</span> {selectedPlacePoint.lat.toFixed(6)}, {selectedPlacePoint.lng.toFixed(6)}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-2">
                    <a
                      href={getGoogleMapsUrl(selectedPlacePoint.place)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                    >
                      See on Google Maps
                    </a>
                    {wikiByPlaceId[selectedPlacePoint.place.id]?.articleUrl ? (
                      <a
                        href={wikiByPlaceId[selectedPlacePoint.place.id].articleUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-md border px-3 py-1.5 text-sm hover:bg-muted"
                      >
                        Wikipedia
                      </a>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : selectedRegion ? (
            <div className="flex h-full flex-col">
              <div className="space-y-3 border-b px-4 py-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Governorate</p>
                    <h3 className="text-lg font-semibold">{selectedRegion}</h3>
                    <p className="text-sm text-muted-foreground">{sortedVisiblePlaces.length} POIs in current filters</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <div className="inline-flex rounded-md border p-0.5">
                      <button
                        type="button"
                        className={`rounded p-1.5 ${poiPanelView === "card" ? "bg-muted" : "hover:bg-muted/70"}`}
                        onClick={() => setPoiPanelView("card")}
                        aria-label="Card view"
                        title="Card view"
                      >
                        <LayoutGrid className="size-4" />
                      </button>
                      <button
                        type="button"
                        className={`rounded p-1.5 ${poiPanelView === "list" ? "bg-muted" : "hover:bg-muted/70"}`}
                        onClick={() => setPoiPanelView("list")}
                        aria-label="List view"
                        title="List view"
                      >
                        <Rows3 className="size-4" />
                      </button>
                    </div>
                    <button
                      type="button"
                      className="inline-flex h-8 w-8 items-center justify-center rounded-md border hover:bg-muted"
                      onClick={resetToHeatmap}
                      aria-label="Return to heatmap"
                      title="Return to heatmap"
                    >
                      <ArrowLeft className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
                {sortedVisiblePlaces.length === 0 ? (
                  <p className="text-sm text-muted-foreground">No POIs in current filters.</p>
                ) : poiPanelView === "list" ? (
                  <div className="space-y-3">
                    {sortedVisiblePlaces.map((point) => {
                      const wiki = wikiByPlaceId[point.place.id];
                      return (
                        <button
                          key={point.place.id}
                          type="button"
                          className="w-full rounded-lg border p-3 text-left transition hover:bg-muted/50"
                          onClick={() => {
                            focusPlace(point);
                          }}
                        >
                          <div className="flex gap-3">
                            {wiki?.imageUrl ? (
                              <img
                                src={wiki.imageUrl}
                                alt={getPlaceName(point.place, language)}
                                className="h-20 w-28 shrink-0 rounded-md border object-cover"
                              />
                            ) : null}
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="truncate font-medium">{getPlaceName(point.place, language)}</p>
                              <p className="text-xs text-muted-foreground">
                                {point.place.category} / {point.place.subcategory}
                              </p>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {wiki?.description || "No description available."}
                              </p>
                              <p className="text-xs">
                                <span className="font-medium">Coordinates:</span> {point.lat.toFixed(5)}, {point.lng.toFixed(5)}
                              </p>
                              <a
                                href={getGoogleMapsUrl(point.place)}
                                target="_blank"
                                rel="noreferrer"
                                className="inline-block text-xs font-medium text-primary underline-offset-2 hover:underline"
                                onClick={(event) => event.stopPropagation()}
                              >
                                See on Google Maps
                              </a>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {sortedVisiblePlaces.map((point) => {
                      const wiki = wikiByPlaceId[point.place.id];

                      return (
                        <button
                          key={point.place.id}
                          type="button"
                          className="rounded-lg border p-2 text-left transition hover:bg-muted/50"
                          onClick={() => {
                            focusPlace(point);
                          }}
                        >
                          {wiki?.imageUrl ? (
                            <img
                              src={wiki.imageUrl}
                              alt={getPlaceName(point.place, language)}
                              className="h-28 w-full rounded-md border object-cover"
                            />
                          ) : null}
                          <div className="mt-2 space-y-1">
                            <p className="line-clamp-1 text-sm font-medium">{getPlaceName(point.place, language)}</p>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {point.place.category} / {point.place.subcategory}
                            </p>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {wiki?.description || "No description available."}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex h-full flex-col px-4 py-3">
              <div className="space-y-3 border-b pb-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs uppercase tracking-wide text-muted-foreground">Interesting places</p>
                    <h3 className="text-lg font-semibold">Random picks with photos</h3>
                    <p className="text-sm text-muted-foreground">{interestingPlaces.length} shown</p>
                  </div>
                  <div className="inline-flex shrink-0 rounded-md border p-0.5">
                    <button
                      type="button"
                      className={`rounded p-1.5 ${poiPanelView === "card" ? "bg-muted" : "hover:bg-muted/70"}`}
                      onClick={() => setPoiPanelView("card")}
                      aria-label="Card view"
                      title="Card view"
                    >
                      <LayoutGrid className="size-4" />
                    </button>
                    <button
                      type="button"
                      className={`rounded p-1.5 ${poiPanelView === "list" ? "bg-muted" : "hover:bg-muted/70"}`}
                      onClick={() => setPoiPanelView("list")}
                      aria-label="List view"
                      title="List view"
                    >
                      <Rows3 className="size-4" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="min-h-0 flex-1 overflow-y-auto py-3">
                {interestingPlaces.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Loading interesting places with photos...</p>
                ) : poiPanelView === "list" ? (
                  <div className="space-y-3">
                    {interestingPlaces.map((point) => {
                      const wiki = wikiByPlaceId[point.place.id];
                      return (
                        <button
                          key={point.place.id}
                          type="button"
                          className="w-full rounded-lg border p-3 text-left transition hover:bg-muted/50"
                          onClick={() => {
                            setSelectedRegion(placeRegionById.get(point.place.id) ?? null);
                            focusPlace(point);
                          }}
                        >
                          <div className="flex gap-3">
                            {wiki?.imageUrl ? (
                              <img
                                src={wiki.imageUrl}
                                alt={getPlaceName(point.place, language)}
                                className="h-20 w-28 shrink-0 rounded-md border object-cover"
                              />
                            ) : null}
                            <div className="min-w-0 flex-1 space-y-1">
                              <p className="truncate font-medium">{getPlaceName(point.place, language)}</p>
                              <p className="text-xs text-muted-foreground">
                                {point.place.category} / {point.place.subcategory}
                              </p>
                              <p className="line-clamp-2 text-xs text-muted-foreground">
                                {wiki?.description || "No description available."}
                              </p>
                            </div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                ) : (
                  <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
                    {interestingPlaces.map((point) => {
                      const wiki = wikiByPlaceId[point.place.id];

                      return (
                        <button
                          key={point.place.id}
                          type="button"
                          className="rounded-lg border p-2 text-left transition hover:bg-muted/50"
                          onClick={() => {
                            setSelectedRegion(placeRegionById.get(point.place.id) ?? null);
                            focusPlace(point);
                          }}
                        >
                          {wiki?.imageUrl ? (
                            <img
                              src={wiki.imageUrl}
                              alt={getPlaceName(point.place, language)}
                              className="h-28 w-full rounded-md border object-cover"
                            />
                          ) : null}
                          <div className="mt-2 space-y-1">
                            <p className="line-clamp-1 text-sm font-medium">{getPlaceName(point.place, language)}</p>
                            <p className="line-clamp-1 text-xs text-muted-foreground">
                              {point.place.category} / {point.place.subcategory}
                            </p>
                            <p className="line-clamp-2 text-xs text-muted-foreground">
                              {wiki?.description || "No description available."}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
