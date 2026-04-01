import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import "leaflet/dist/leaflet.css";
import type { LanguageCode, Place } from "../../types/place";
import { getPlaceName } from "../../utils/place";
import { Button } from "../ui/button";

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface PlacesMapProps {
  places: Place[];
  language: LanguageCode;
  onOpenDetails: (place: Place) => void;
}

export function PlacesMap({ places, language, onOpenDetails }: PlacesMapProps) {
  return (
    <MapContainer center={[34.0, 9.5]} zoom={7} className="h-[68vh] w-full rounded-xl border">
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {places.map((place) => {
        const lat = Number.parseFloat(place.latitude);
        const lng = Number.parseFloat(place.longitude);

        if (!Number.isFinite(lat) || !Number.isFinite(lng)) {
          return null;
        }

        return (
          <Marker key={place.id} position={[lat, lng]}>
            <Popup>
              <div className="space-y-2">
                <p className="font-medium">{getPlaceName(place, language)}</p>
                <p className="text-xs text-muted-foreground">{place.category} / {place.subcategory}</p>
                <Button size="sm" onClick={() => onOpenDetails(place)}>View details</Button>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
