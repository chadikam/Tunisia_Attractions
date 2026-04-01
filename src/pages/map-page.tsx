import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { PlacesMap } from "../components/places/places-map";
import type { LanguageCode, Place } from "../types/place";

interface MapPageProps {
  places: Place[];
  language: LanguageCode;
  onOpenDetails: (place: Place) => void;
}

export function MapPage({ places, language, onOpenDetails }: MapPageProps) {
  return (
    <Card className="flex-1 overflow-hidden" style={{ minHeight: "500px" }}>
      <CardHeader className="flex h-12 flex-row items-center border-b px-4 py-0">
        <CardTitle className="text-sm">Map View - Tunisia Attractions</CardTitle>
      </CardHeader>
      <CardContent className="h-[calc(100%-3rem)] p-0">
        <PlacesMap places={places} language={language} onOpenDetails={onOpenDetails} />
      </CardContent>
    </Card>
  );
}
