import { useEffect, useMemo, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import type { LanguageCode, Place } from "../../types/place";
import { getPlaceName } from "../../utils/place";

interface PlacesMapProps {
  places: Place[];
  language: LanguageCode;
  onOpenDetails: (place: Place) => void;
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

const TUNISIA_BOUNDS: L.LatLngBoundsExpression = [
  [30.2, 7.5],
  [37.8, 11.9],
];

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

function normalizeRegionNames(features: RegionFeature[]): RegionFeature[] {
  const usedNames = new Map<string, number>();

  return features.map((feature, index) => {
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

export function PlacesMap({ places, language, onOpenDetails }: PlacesMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const polygonsLayerRef = useRef<L.LayerGroup | null>(null);
  const poiLayerRef = useRef<L.LayerGroup | null>(null);

  const [features, setFeatures] = useState<RegionFeature[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);

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

  useEffect(() => {
    if (!mapContainerRef.current || mapRef.current) {
      return;
    }

    const map = L.map(mapContainerRef.current, {
      preferCanvas: true,
      maxBounds: TUNISIA_BOUNDS,
      maxBoundsViscosity: 1,
      minZoom: 6,
      maxZoom: 11,
      worldCopyJump: false,
    }).setView([34.0, 9.5], 7);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19,
    }).addTo(map);

    map.fitBounds(TUNISIA_BOUNDS, { padding: [24, 24] });

    mapRef.current = map;

    return () => {
      map.off();
      map.remove();
      mapRef.current = null;
      polygonsLayerRef.current = null;
      poiLayerRef.current = null;
    };
  }, []);

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
    }

    const polygonsLayer = L.layerGroup();
    const maxCount = Math.max(1, ...countByRegion.values());

    const geoJsonLayer = L.geoJSON(features as never, {
      style: (featureData) => {
        const props = (featureData?.properties ?? {}) as { name?: string };
        const regionName = props.name ?? "";
        const count = countByRegion.get(regionName) ?? 0;
        const intensity = count / maxCount;
        const isSelected = selectedRegion === regionName;

        return {
          color: isSelected ? "#bf360c" : "#0d47a1",
          weight: isSelected ? 2 : 1,
          fillColor: isSelected ? "#ef6c00" : "#1565c0",
          fillOpacity: isSelected ? 0.82 : 0.15 + intensity * 0.6,
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
          setSelectedRegion((previous) => (previous === regionName ? null : regionName));
          const bounds = (layer as L.Polygon).getBounds();
          map.fitBounds(bounds, { padding: [24, 24], maxZoom: 9 });
        });
      },
      filter: (featureData) => {
        if (!selectedRegion) {
          return true;
        }
        const props = (featureData?.properties ?? {}) as { name?: string };
        return props.name === selectedRegion;
      },
    });

    geoJsonLayer.addTo(polygonsLayer);
    polygonsLayer.addTo(map);
    polygonsLayerRef.current = polygonsLayer;
  }, [countByRegion, features, selectedRegion]);

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
      visiblePlaces.forEach((point) => {
        const marker = L.circleMarker([point.lat, point.lng], {
          radius: 6,
          color: "#0d47a1",
          fillColor: "#1565c0",
          fillOpacity: 0.95,
          weight: 1,
        });

        marker.bindTooltip(getPlaceName(point.place, language), {
          sticky: true,
          direction: "top",
        });

        marker.on("click", () => onOpenDetails(point.place));
        marker.addTo(poiLayer);
      });
    }

    poiLayer.addTo(map);
    poiLayerRef.current = poiLayer;
  }, [language, onOpenDetails, selectedRegion, visiblePlaces]);

  return (
    <div className="space-y-2">
      {loadError ? (
        <div className="rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs text-destructive">
          Failed to load polygons: {loadError}
        </div>
      ) : null}

      <div ref={mapContainerRef} className="h-[68vh] w-full rounded-xl border" />
    </div>
  );
}
