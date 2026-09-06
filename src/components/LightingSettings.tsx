
import type {
  LightingConfig,
  LightingStrategy,
} from "../types/lighting";

interface LightingSettingsProps {
  config: LightingConfig;

  onConfigChange: (
    config: LightingConfig,
  ) => void;
}

function LightingSettings({
  config,
  onConfigChange,
}: LightingSettingsProps) {
  function handleTargetLightHoursChange(
    value: string,
  ) {
    onConfigChange({
      ...config,
      targetLightHours: Number(value),
    });
  }

  function handleNotificationMinutesChange(
    value: string,
  ) {
    onConfigChange({
      ...config,
      notificationMinutesBefore: Number(value),
    });
  }

  function handleLightingStrategyChange(
    strategy: LightingStrategy,
  ) {
    onConfigChange({
      ...config,
      lightingStrategy: strategy,
    });
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold">
        💡 Configuración de iluminación
      </h2>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="targetLightHours"
            className="block text-sm font-medium text-gray-700"
          >
            Horas de luz objetivo
          </label>

          <input
            id="targetLightHours"
            type="number"
            min="1"
            max="24"
            value={config.targetLightHours}
            onChange={(event) =>
              handleTargetLightHoursChange(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>

        <div>
          <label
            htmlFor="notificationMinutes"
            className="block text-sm font-medium text-gray-700"
          >
            Avisar antes (minutos)
          </label>

          <input
            id="notificationMinutes"
            type="number"
            min="0"
            max="180"
            value={config.notificationMinutesBefore}
            onChange={(event) =>
              handleNotificationMinutesChange(
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
          />
        </div>
      </div>

      {/* ESTRATEGIA DE ILUMINACIÓN */}

      <div className="mt-6">
        <p className="text-sm font-medium text-gray-700">
          ¿Cuándo completar la luz?
        </p>

        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          {/* MADRUGADA */}

          <button
            type="button"
            onClick={() =>
              handleLightingStrategyChange(
                "morning",
              )
            }
            className={`rounded-xl border-2 p-4 text-left transition ${
              config.lightingStrategy === "morning"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <p className="font-semibold">
              🌅 Madrugada
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Completar las horas de luz antes del
              amanecer.
            </p>
          </button>

          {/* NOCHE */}

          <button
            type="button"
            onClick={() =>
              handleLightingStrategyChange(
                "evening",
              )
            }
            className={`rounded-xl border-2 p-4 text-left transition ${
              config.lightingStrategy === "evening"
                ? "border-green-600 bg-green-50"
                : "border-gray-200 hover:border-green-300"
            }`}
          >
            <p className="font-semibold">
              🌇 Noche
            </p>

            <p className="mt-1 text-sm text-gray-600">
              Completar las horas de luz después del
              atardecer.
            </p>
          </button>
        </div>
      </div>
    </section>
  );
}

export default LightingSettings;

