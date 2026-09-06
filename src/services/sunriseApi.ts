import type { SunTimes } from "../types/lighting";

interface SunriseApiResponse {
  results: {
    date: string;
    sunrise: string;
    sunset: string;
  };
  status: string;
  tzid: string;
}

export async function getSunTimes(
  latitude: number,
  longitude: number,
  date: string,
): Promise<SunTimes> {
  const url =
    `https://api.sunrisesunset.io/json` +
    `?lat=${latitude}` +
    `&lng=${longitude}` +
    `&date=${date}` +
    `&formatted=0`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(
      `No se pudieron obtener los datos solares: ${response.status}`,
    );
  }

  const data: SunriseApiResponse = await response.json();

  if (data.status !== "OK") {
    throw new Error("La API no pudo obtener los horarios solares.");
  }

  return {
    sunrise: new Date(data.results.sunrise),
    sunset: new Date(data.results.sunset),
  };
}