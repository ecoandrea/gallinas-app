import { useState } from "react";
import { searchLocation } from "../services/geocodingApi";
import type { FarmLocation } from "../types/location";

interface LocationSearchProps {
    onLocationSelect: (location: FarmLocation) => void;
}

function LocationSearch({ onLocationSelect }: LocationSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<FarmLocation[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    async function handleSearch() {
        if (!query.trim()) {
            return;
        }

        try {
            setIsLoading(true);
            setError(null);

            const locations = await searchLocation(query);

            setResults(locations);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Ocurrió un error al buscar la ubicación.",
            );
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <section className="rounded-xl bg-white p-6 shadow">
            <h2 className="text-2xl font-semibold">⚙️ Configuración</h2>

            <div className="mt-6">
                <label
                    htmlFor="location"
                    className="block text-sm font-medium text-gray-700"
                >
                    📍 Ubicación del gallinero
                </label>

                <div className="mt-2 flex flex-col gap-3 sm:flex-row">
                    <input
                        id="location"
                        type="text"
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                handleSearch();
                            }
                        }}
                        placeholder="Ej: Talagante, Copiapó..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-green-600"
                    />

                    <button
                        type="button"
                        onClick={handleSearch}
                        disabled={isLoading}
                        className="rounded-lg bg-green-700 px-5 py-3 font-medium text-white hover:bg-green-800 disabled:opacity-50"
                    >
                        {isLoading ? "Buscando..." : "🔍 Buscar"}
                    </button>
                </div>

                {error && <p className="mt-3 text-sm text-red-600">{error}</p>}

                {results.length > 0 && (
                    <div className="mt-4">
                        <p className="mb-2 text-sm font-medium text-gray-700">
                            Selecciona una ubicación:
                        </p>

                        <div className="space-y-2">
                            {results.map((location) => (
                                <button
                                    key={`${location.latitude}-${location.longitude}`}
                                    type="button"
                                    onClick={() => {
                                        onLocationSelect(location);
                                        setQuery(location.name);
                                        setResults([]);
                                    }}
                                    className="w-full rounded-lg border border-gray-200 p-4 text-left hover:bg-green-50"
                                >
                                    📍 {location.name}
                                </button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default LocationSearch;