
import { useEffect, useState } from "react";

import LocationSearch from "./components/LocationSearch";
import LightingSettings from "./components/LightingSettings";
import NotificationSettings from "./components/NotificationSettings";
import LightingCalendar from "./components/LightingCalendar";

import { getSunTimes } from "./services/sunriseApi";

import {
  getSavedLightingConfig,
  getSavedLocation,
  saveLightingConfig,
  saveLocation,
} from "./services/storage";

import { calculateLightingSchedule } from "./utils/lightingCalculator";

import type {
  DailyLightingSchedule,
  LightingConfig,
} from "./types/lighting";

import type { FarmLocation } from "./types/location";

import { sendLightingNotification } from "./services/notificationService";


const DEFAULT_LOCATION: FarmLocation = {
  name: "Talagante, Chile",
  latitude: -33.6639,
  longitude: -70.9276,
};


function App() {
  // =========================
  // ESTADOS
  // =========================

  const [location, setLocation] = useState<FarmLocation>(
    () => getSavedLocation() ?? DEFAULT_LOCATION,
  );


  const [lightingConfig, setLightingConfig] =
    useState<LightingConfig>(() => {
      return (
        getSavedLightingConfig() ?? {
          targetLightHours: 14,
          notificationMinutesBefore: 30,
          lightingStrategy: "morning",
        }
      );
    });



  // Horario de hoy
  const [schedule, setSchedule] =
    useState<DailyLightingSchedule | null>(null);

  // Horarios de los próximos 7 días
  const [schedules, setSchedules] =
    useState<DailyLightingSchedule[]>([]);

  // Mostrar u ocultar calendario
  const [showCalendar, setShowCalendar] =
    useState(false);

  // Error
  const [error, setError] =
    useState<string | null>(null);


  // =========================
  // GUARDAR UBICACIÓN
  // =========================

  useEffect(() => {
    saveLocation(location);
  }, [location]);


  // =========================
  // GUARDAR CONFIGURACIÓN
  // =========================

  useEffect(() => {
    saveLightingConfig(lightingConfig);
  }, [lightingConfig]);


// =========================
// NOTIFICACIÓN AUTOMÁTICA
// =========================

useEffect(() => {
  if (!schedule) {
    return;
  }

  const notificationTime =
    schedule.notificationTime;

  const notificationKey =
    `lighting-notification-${schedule.date.toDateString()}`;

  function checkNotification() {
    const now = new Date();

    const difference =
      now.getTime() -
      notificationTime.getTime();

    // Avisamos durante el primer minuto
    // después de llegar a la hora programada.
    if (
      difference >= 0 &&
      difference < 60 * 1000
    ) {
      // Revisamos si ya notificamos hoy.
      if (localStorage.getItem(notificationKey)) {
        return;
      }

      sendLightingNotification(
        lightingConfig.notificationMinutesBefore,
      );

      // Guardamos que ya enviamos la notificación.
      localStorage.setItem(
        notificationKey,
        "sent",
      );
    }
  }

  // Revisamos inmediatamente.
  checkNotification();

  // Revisamos cada 30 segundos.
  const interval = setInterval(
    checkNotification,
    30 * 1000,
  );

  // Limpiamos el intervalo.
  return () => {
    clearInterval(interval);
  };
}, [
  schedule,
  lightingConfig.notificationMinutesBefore,
]);


  // =========================
  // CARGAR Y CALCULAR
  // LOS PRÓXIMOS 7 DÍAS
  // =========================

  useEffect(() => {
    async function loadSchedules() {
      try {
        setError(null);

        const nextDays = getNextDays(7);

        const calculatedSchedules =
          await Promise.all(
            nextDays.map(async (day) => {
              const date =
                day.toISOString().split("T")[0];

              const sunTimes = await getSunTimes(
                location.latitude,
                location.longitude,
                date,
              );

              return calculateLightingSchedule(
                day,
                sunTimes,
                lightingConfig,
              );
            }),
          );

        // Guardamos los 7 días
        setSchedules(calculatedSchedules);

        // El primer día corresponde a hoy
        setSchedule(calculatedSchedules[0]);

      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Ocurrió un error inesperado.",
        );
      }
    }

    loadSchedules();

  }, [location, lightingConfig]);


  // =========================
  // SELECCIONAR UBICACIÓN
  // =========================

  function handleLocationSelect(
    selectedLocation: FarmLocation,
  ) {
    setLocation(selectedLocation);
  }


  // =========================
  // GENERAR PRÓXIMOS DÍAS
  // =========================

  function getNextDays(days: number): Date[] {
    const dates: Date[] = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();

      date.setDate(
        date.getDate() + i,
      );

      dates.push(date);
    }

    return dates;
  }


  // =========================
  // INTERFAZ
  // =========================

  return (
    <main className="min-h-screen bg-green-50 p-6">
      <div className="mx-auto max-w-5xl">


        {/* HEADER */}

        <header>
          <h1 className="text-4xl font-bold text-green-800">
            🐔 Gallinas App
          </h1>

          <p className="mt-2 text-gray-600">
            Control de iluminación para gallinas ponedoras
          </p>
        </header>


        {/* BUSCADOR DE UBICACIÓN */}

        <div className="mt-8">
          <LocationSearch
            onLocationSelect={handleLocationSelect}
          />
        </div>


        {/* CONFIGURACIÓN + HORARIO */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">


          {/* CONFIGURACIÓN */}

          <LightingSettings
            config={lightingConfig}
            onConfigChange={setLightingConfig}
          />


          {/* HORARIO DE HOY */}

          <div>

            {/* ERROR */}

            {error && (
              <section className="rounded-xl bg-red-50 p-6">
                <h2 className="text-xl font-semibold text-red-700">
                  Error
                </h2>

                <p className="mt-2 text-red-600">
                  {error}
                </p>
              </section>
            )}


            {/* CARGANDO */}

            {!error && !schedule && (
              <section className="rounded-xl bg-white p-6 shadow">
                <p>
                  Cargando datos solares... 🌅
                </p>
              </section>
            )}


            {/* DATOS DEL HORARIO */}

            {schedule && (
              <section className="rounded-xl bg-white p-6 shadow">

                <h2 className="text-2xl font-semibold">
                  📅 Horario de hoy
                </h2>

                <p className="mt-2 text-gray-600">
                  📍 {location.name}
                </p>


                <div className="mt-6 grid grid-cols-2 gap-4">


                  {/* AMANECER */}

                  <div>
                    <p className="text-gray-500">
                      🌅 Amanecer
                    </p>

                    <p className="text-xl font-bold">
                      {schedule.sunrise.toLocaleTimeString(
                        "es-CL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>


                  {/* ATARDECER */}

                  <div>
                    <p className="text-gray-500">
                      🌇 Atardecer
                    </p>

                    <p className="text-xl font-bold">
                      {schedule.sunset.toLocaleTimeString(
                        "es-CL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>


                  {/* LUZ NATURAL */}

                  <div>
                    <p className="text-gray-500">
                      ☀️ Luz natural
                    </p>

                    <p className="text-xl font-bold">
                      {Math.floor(
                        schedule.naturalLightMinutes / 60,
                      )}{" "}
                      h{" "}
                      {Math.round(
                        schedule.naturalLightMinutes % 60,
                      )}{" "}
                      min
                    </p>
                  </div>


                  {/* LUZ ARTIFICIAL */}

                  <div>
                    <p className="text-gray-500">
                      💡 Luz artificial
                    </p>

                    <p className="text-xl font-bold">
                      {Math.floor(
                        schedule.artificialLightMinutes / 60,
                      )}{" "}
                      h{" "}
                      {Math.round(
                        schedule.artificialLightMinutes % 60,
                      )}{" "}
                      min
                    </p>
                  </div>


                  {/* ENCENDER LUZ */}

                  <div>
                    <p className="text-gray-500">
                      💡 Encender luz
                    </p>

                    <p className="text-xl font-bold">
                      {schedule.lightOn.toLocaleTimeString(
                        "es-CL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>


                  {/* APAGAR LUZ */}

                  <div>
                    <p className="text-gray-500">
                      🌙 Apagar luz
                    </p>

                    <p className="text-xl font-bold">
                      {schedule.lightOff.toLocaleTimeString(
                        "es-CL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>

                  {/* NOTIFICACIÓN */}

                  <div>
                    <p className="text-gray-500">
                      🔔 Avisar
                    </p>

                    <p className="text-xl font-bold">
                      {schedule.notificationTime.toLocaleTimeString(
                        "es-CL",
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </p>
                  </div>


                </div>

              </section>
            )}

          </div>

        </div>


        {/* NOTIFICACIONES */}

        <div className="mt-6">
          <NotificationSettings />
        </div>


        {/* BOTÓN CALENDARIO */}

        <div className="mt-6">
          <button
            onClick={() =>
              setShowCalendar(!showCalendar)
            }
            className="w-full rounded-xl bg-green-700 px-6 py-4 text-lg font-semibold text-white shadow transition hover:bg-green-800"
          >
            {showCalendar
              ? "📅 Ocultar planificación de los próximos 7 días ▲"
              : "📅 Ver planificación de los próximos 7 días ▼"}
          </button>


          {/* CALENDARIO */}

          {showCalendar && (
            <LightingCalendar
              schedules={schedules}
            />
          )}

        </div>


      </div>
    </main>
  );
}

export default App;

