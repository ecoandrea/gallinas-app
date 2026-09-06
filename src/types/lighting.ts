
export type LightingStrategy =
  | "morning"
  | "evening";

export interface LightingConfig {
  targetLightHours: number;
  notificationMinutesBefore: number;
  lightingStrategy: LightingStrategy;
}

export interface SunTimes {
  sunrise: Date;
  sunset: Date;
}

export interface DailyLightingSchedule {
  date: Date;

  sunrise: Date;
  sunset: Date;

  naturalLightMinutes: number;
  artificialLightMinutes: number;

  lightOn: Date;
  lightOff: Date;

  notificationTime: Date;
}

