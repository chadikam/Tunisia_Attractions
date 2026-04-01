import { ExternalLink, MapPinned, X } from "lucide-react";
import type { Place } from "../../types/place";
import { getGoogleMapsUrl } from "../../utils/place";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface PlaceDetailsModalProps {
  place: Place | null;
  onClose: () => void;
}

export function PlaceDetailsModal({ place, onClose }: PlaceDetailsModalProps) {
  if (!place) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <Card className="w-full max-w-2xl animate-in fade-in zoom-in-95 duration-200">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <CardTitle>{place.name_en}</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">{place.category} / {place.subcategory}</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="size-4" />
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-3 rounded-md border p-3 text-sm md:grid-cols-3">
            <div>
              <p className="font-medium text-muted-foreground">English</p>
              <p>{place.name_en}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Francais</p>
              <p>{place.name_fr}</p>
            </div>
            <div dir="rtl">
              <p className="font-medium text-muted-foreground">Arabic</p>
              <p>{place.name_ar}</p>
            </div>
          </div>

          <div className="grid gap-2 text-sm">
            <p><span className="font-medium">Latitude:</span> {place.latitude}</p>
            <p><span className="font-medium">Longitude:</span> {place.longitude}</p>
            <p><span className="font-medium">Wikidata:</span> {place.wikidata || "N/A"}</p>
          </div>

          <div className="flex flex-wrap gap-2">
            {place.wikipedia_url ? (
              <a href={place.wikipedia_url} target="_blank" rel="noreferrer">
                <Button>
                  <ExternalLink className="mr-2 size-4" />
                  Wikipedia
                </Button>
              </a>
            ) : null}

            <a href={getGoogleMapsUrl(place)} target="_blank" rel="noreferrer">
              <Button variant="outline">
                <MapPinned className="mr-2 size-4" />
                Open in Google Maps
              </Button>
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
