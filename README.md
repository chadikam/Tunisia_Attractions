# Tunisia Attractions - Frontend

Frontend-only tourism discovery platform built with React + TypeScript and local JSON data.

## Tech

- React
- TypeScript
- Vite
- Tailwind CSS
- Leaflet + react-leaflet

## Features

- Explore view with reusable UI cards
- Search by English/French/Arabic names
- Category and subcategory filters
- Map view with markers and popups
- Place details modal with multilingual names, wiki link, coordinates
- Open in Google Maps action
- EN / FR / AR language toggle
- Responsive layout and transitions

## Project Structure

```text
src/
  components/
    layout/
    places/
    ui/
  data/
    places.json
  hooks/
  lib/
  pages/
  types/
  utils/
```

## Dataset Placement

Put your dataset in:

`src/data/places.json`

Expected item format:

```ts
type Place = {
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
```

## Run Locally

```bash
npm install
npm run dev
```

Build production bundle:

```bash
npm run build
```
