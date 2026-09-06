import type { FarmLocation } from "../types/location";

interface GeocodingApiResult {
  display_name: string;
  lat: string;
  lon: string;
}

export async function searchLocation(
  query: string,
): Promise<FarmLocation[]> {
  const params = new URLSearchParams({
    q: query,
    format: "jsonv2",
    limit: "5",
    countrycodes: "cl",
    "accept-language": "es",
  });

  const url =
    `https://nominatim.openstreetmap.org/search?${params.toString()}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `No se pudo buscar la ubicación: ${response.status}`,
    );
  }

  const data: GeocodingApiResult[] = await response.json();

  return data.map((location) => ({
    name: location.display_name,
    latitude: Number(location.lat),
    longitude: Number(location.lon),
  }));
}