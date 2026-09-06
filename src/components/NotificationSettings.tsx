
import { useState } from "react";

function NotificationSettings() {
  const [permission, setPermission] =
    useState<NotificationPermission>(
      "Notification" in window
        ? Notification.permission
        : "denied",
    );

  function handleEnableNotifications() {
    if (!("Notification" in window)) {
      alert(
        "Este navegador no soporta notificaciones.",
      );

      return;
    }

    Notification.requestPermission()
      .then((result) => {
        setPermission(result);
      });
  }

  function getStatusMessage() {
    if (permission === "granted") {
      return "Notificaciones activadas 🔔";
    }

    if (permission === "denied") {
      return "Las notificaciones están bloqueadas en el navegador.";
    }

    return "Activa las notificaciones para recibir avisos.";
  }

  return (
    <section className="rounded-xl bg-white p-6 shadow">
      <h2 className="text-2xl font-semibold">
        🔔 Notificaciones
      </h2>

      <p className="mt-2 text-gray-600">
        {getStatusMessage()}
      </p>

      {permission !== "granted" && (
        <button
          onClick={handleEnableNotifications}
          className="mt-4 rounded-lg bg-green-700 px-5 py-3 font-semibold text-white transition hover:bg-green-800"
        >
          Activar notificaciones
        </button>
      )}

      {permission === "granted" && (
        <p className="mt-4 font-semibold text-green-700">
          ✓ Recibirás avisos antes de encender la luz.
        </p>
      )}
    </section>
  );
}

export default NotificationSettings;

