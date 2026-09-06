import type { LightingConfig } from "../types/lighting";
import type { FarmLocation } from "../types/location";

const LOCATION_KEY = "gallinas-app-location";
const LIGHTING_CONFIG_KEY = "gallinas-app-lighting-config";

export function saveLocation(location: FarmLocation): void {
  localStorage.setItem(
    LOCATION_KEY,
    JSON.stringify(location),
  );
}

export function getSavedLocation(): FarmLocation | null {
  const savedLocation = localStorage.getItem(LOCATION_KEY);

  if (!savedLocation) {
    return null;
  }

  return JSON.parse(savedLocation) as FarmLocation;
}

export function saveLightingConfig(
  config: LightingConfig,
): void {
  localStorage.setItem(
    LIGHTING_CONFIG_KEY,
    JSON.stringify(config),
  );
}

export function getSavedLightingConfig(): LightingConfig | null {
  const savedConfig = localStorage.getItem(
    LIGHTING_CONFIG_KEY,
  );

  if (!savedConfig) {
    return null;
  }

  return JSON.parse(savedConfig) as LightingConfig;
}