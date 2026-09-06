
import type {
  DailyLightingSchedule,
  LightingConfig,
  SunTimes,
} from "../types/lighting";

export function calculateLightingSchedule(
  date: Date,
  sunTimes: SunTimes,
  config: LightingConfig,
): DailyLightingSchedule {
  const { sunrise, sunset } = sunTimes;

  const {
    targetLightHours,
    notificationMinutesBefore,
    lightingStrategy,
  } = config;

  // Convertimos las horas objetivo a minutos.
  const targetLightMinutes =
    targetLightHours * 60;

  // Calculamos los minutos de luz natural.
  const naturalLightMinutes =
    (sunset.getTime() - sunrise.getTime()) /
    (1000 * 60);

  // Calculamos cuántos minutos de luz artificial faltan.
  const artificialLightMinutes = Math.max(
    0,
    targetLightMinutes - naturalLightMinutes,
  );

  let lightOn: Date;
  let lightOff: Date;

  // 🌅 MADRUGADA
  if (lightingStrategy === "morning") {
    // Encendemos antes del amanecer.
    lightOn = new Date(
      sunrise.getTime() -
        artificialLightMinutes * 60 * 1000,
    );

    // Apagamos cuando amanece.
    lightOff = new Date(
      sunrise.getTime(),
    );
  }

  // 🌇 NOCHE
  else {
    // Encendemos cuando anochece.
    lightOn = new Date(
      sunset.getTime(),
    );

    // Apagamos después de completar
    // las horas artificiales necesarias.
    lightOff = new Date(
      sunset.getTime() +
        artificialLightMinutes * 60 * 1000,
    );
  }

  // Calculamos cuándo enviar la notificación.
  const notificationTime = new Date(
    lightOn.getTime() -
      notificationMinutesBefore *
        60 *
        1000,
  );

  return {
    date,
    sunrise,
    sunset,
    naturalLightMinutes,
    artificialLightMinutes,
    lightOn,
    lightOff,
    notificationTime,
  };
}

