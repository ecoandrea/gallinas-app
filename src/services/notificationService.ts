
export function sendLightingNotification(
  minutesBefore: number,
) {
  if (Notification.permission !== "granted") {
    return;
  }

  const message =
    minutesBefore === 0
      ? "Es hora de encender la luz del gallinero."
      : `En ${minutesBefore} minutos debes encender la luz del gallinero.`;

  new Notification("🐔 Gallinas App", {
    body: message,
  });
}

