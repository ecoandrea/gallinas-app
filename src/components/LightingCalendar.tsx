
import type { DailyLightingSchedule } from "../types/lighting";

interface LightingCalendarProps {
  schedules: DailyLightingSchedule[];
}

function LightingCalendar({
  schedules,
}: LightingCalendarProps) {
  function getDayName(
    date: Date,
    index: number,
  ): string {
    if (index === 0) {
      return "Hoy";
    }

    if (index === 1) {
      return "Mañana";
    }

    return date.toLocaleDateString(
      "es-CL",
      {
        weekday: "long",
        day: "numeric",
        month: "long",
      },
    );
  }

  return (
    <section className="mt-6 rounded-xl bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold">
        📅 Próximos 7 días
      </h2>

      {schedules.length === 0 ? (
        <p className="mt-4 text-gray-500">
          Cargando planificación...
        </p>
      ) : (
        <div className="mt-6 space-y-4">
          {schedules.map((schedule, index) => (
            <div
              key={index}
              className="rounded-lg border border-gray-200 p-4"
            >
              <p className="font-semibold capitalize">
                {getDayName(
                  schedule.sunrise,
                  index,
                )}
              </p>

              <div className="mt-3 grid grid-cols-2 gap-4 sm:grid-cols-5">
                {/* AMANECER */}
                <div>
                  <p className="text-sm text-gray-500">
                    🌅 Amanecer
                  </p>

                  <p className="font-semibold">
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
                  <p className="text-sm text-gray-500">
                    🌇 Atardecer
                  </p>

                  <p className="font-semibold">
                    {schedule.sunset.toLocaleTimeString(
                      "es-CL",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                {/* ENCENDER */}
                <div>
                  <p className="text-sm text-gray-500">
                    💡 Encender
                  </p>

                  <p className="font-semibold">
                    {schedule.lightOn.toLocaleTimeString(
                      "es-CL",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                {/* APAGAR */}
                <div>
                  <p className="text-sm text-gray-500">
                    🌙 Apagar
                  </p>

                  <p className="font-semibold">
                    {schedule.lightOff.toLocaleTimeString(
                      "es-CL",
                      {
                        hour: "2-digit",
                        minute: "2-digit",
                      },
                    )}
                  </p>
                </div>

                {/* AVISAR */}
                <div>
                  <p className="text-sm text-gray-500">
                    🔔 Avisar
                  </p>

                  <p className="font-semibold">
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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default LightingCalendar;

