// Service Worker — Old Gabs 1era
// KILL-SWITCH: se desinstala solo y limpia todas las caches viejas,
// forzando a cada dispositivo a recargar la app fresca desde la red.
// (El SW anterior quedo sirviendo una version vieja de la app en algunos
// dispositivos; esto los saca de ese estado sin que el usuario tenga que
// borrar datos a mano.)

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.map(k => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: 'window' }))
      .then(clients => clients.forEach(client => client.navigate(client.url)))
  );
});
