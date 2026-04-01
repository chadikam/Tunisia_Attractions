import { Compass, Filter, Globe2, MapPinned, Search } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";

export function ExplorePage() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Discover Tunisia, Smarter</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            Tunisia Explorer is a frontend-only discovery platform built around a local places dataset.
            It helps travelers and researchers explore attractions by category, language, and location.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" size="sm">
              <Compass className="mr-2 size-4" />
              Explore the Platform
            </Button>
            <Button variant="outline" size="sm">
              <MapPinned className="mr-2 size-4" />
              Open Map View
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Search className="mr-2 size-4" />
              Multilingual Search
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Find places by English, French, or Arabic names with a single search input.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Filter className="mr-2 size-4" />
              Smart Filters
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Narrow down attractions by category and subcategory to discover relevant places quickly.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <MapPinned className="mr-2 size-4" />
              Interactive Map
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Visualize all filtered places on Leaflet with direct access to place details from map popups.
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-base">
              <Globe2 className="mr-2 size-4" />
              Local-Only Data
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            No backend, no API calls. Everything loads from your local JSON dataset for fast iteration.
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
