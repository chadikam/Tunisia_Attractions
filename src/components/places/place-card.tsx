import { MapPin } from "lucide-react";
import type { LanguageCode, Place } from "../../types/place";
import { getPlaceName } from "../../utils/place";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";

interface PlaceCardProps {
  place: Place;
  language: LanguageCode;
  onOpenDetails: (place: Place) => void;
}

export function PlaceCard({ place, language, onOpenDetails }: PlaceCardProps) {
  return (
    <Card className="group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <CardHeader>
        <CardTitle className="line-clamp-1">{getPlaceName(place, language)}</CardTitle>
        <CardDescription className="line-clamp-1">{place.name_en}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="size-4" />
          <span className="line-clamp-1">{place.category} / {place.subcategory}</span>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="w-full" onClick={() => onOpenDetails(place)}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  );
}
