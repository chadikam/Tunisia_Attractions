import { MapPin, Info, Landmark, ScrollText, Trees, Mountain } from "lucide-react";
import type { LanguageCode, Place } from "../../types/place";
import { getPlaceName } from "../../utils/place";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { translateCategory, translateSubcategory } from "../../utils/i18n";
import { getCategoryColorHex } from "../../constants/place-category-colors";
import { cn } from "../../lib/utils";

interface PlaceCardProps {
  place: Place;
  language: LanguageCode;
  onOpenDetails: (place: Place) => void;
  imageUrl?: string;
  description?: string;
}

const tagIconMap = {
  historic: Landmark,
  heritage: Landmark,
  landmark: Landmark,
  archaeological_site: ScrollText,
  park: Trees,
  nature: Trees,
  viewpoint: Mountain,
  peak: Mountain,
  beach: Mountain,
  museum: Landmark,
};

function getTagIcon(key: string) {
  if (key in tagIconMap) {
    return tagIconMap[key as keyof typeof tagIconMap];
  }
  return null;
}

export function PlaceCard({ place, language, onOpenDetails, imageUrl, description }: PlaceCardProps) {
  const categoryColor = getCategoryColorHex(place.category);
  const categoryLabel = translateCategory(language, place.category);
  const subcategoryLabel = translateSubcategory(language, place.subcategory);
  
  const CategoryIcon = getTagIcon(place.category);
  const SubcategoryIcon = getTagIcon(place.subcategory);

  const renderBadges = (glass: boolean) => (
    <div className="flex flex-wrap items-center gap-1.5">
      <span 
        className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white shadow-sm",
          glass ? "bg-white/20 backdrop-blur-md border border-white/10" : ""
        )}
        style={!glass ? { backgroundColor: categoryColor } : {}}
      >
        {CategoryIcon && <CategoryIcon className="size-3" />}
        {categoryLabel}
      </span>
      {subcategoryLabel && subcategoryLabel !== categoryLabel && (
        <span className={cn(
          "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-[10px] font-medium",
          glass ? "bg-black/20 text-white/90 backdrop-blur-md border border-white/5" : "border bg-muted/30 text-muted-foreground"
        )}>
          {SubcategoryIcon && <SubcategoryIcon className="size-3" />}
          {subcategoryLabel}
        </span>
      )}
    </div>
  );

  return (
    <Card className="group flex h-full flex-col transition-all duration-300 hover:-translate-y-1 hover:shadow-lg overflow-hidden">
      {imageUrl && (
        <div className="relative h-32 w-full overflow-hidden shrink-0">
          <img 
            src={imageUrl} 
            alt={getPlaceName(place, language)} 
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
          <div className="absolute bottom-3 left-3">
            {renderBadges(true)}
          </div>
        </div>
      )}
      <CardHeader className="pb-3">
        <div className="flex flex-col gap-2.5">
          {/* Metadata badges (only if no image) */}
          {!imageUrl && renderBadges(false)}
          
          <CardTitle className="line-clamp-2 text-base font-bold leading-tight">
            {getPlaceName(place, language)}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="flex-1 pb-4">
        <div className="relative">
          <CardDescription className="line-clamp-2 text-sm leading-relaxed text-muted-foreground/80">
            {description || (place.name_en !== getPlaceName(place, language) ? place.name_en : "")}
          </CardDescription>
          {/* Fade overflow for description */}
          <div className="pointer-events-none absolute bottom-0 left-0 h-5 w-full bg-gradient-to-t from-card to-transparent" />
        </div>
      </CardContent>
      
      <CardFooter className="mt-auto border-t bg-muted/10 p-0">
        <Button 
          variant="ghost"
          className="h-12 w-full justify-between rounded-none rounded-b-lg px-6 font-medium transition-colors hover:bg-muted/40" 
          onClick={() => onOpenDetails(place)}
        >
          <span className="flex items-center gap-2">
            <Info className="size-4 opacity-70" />
            View Details
          </span>
          <span className="opacity-40 transition-transform group-hover:translate-x-1">→</span>
        </Button>
      </CardFooter>
    </Card>
  );
}
