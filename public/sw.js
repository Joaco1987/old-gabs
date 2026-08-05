// Service Worker — Old Gabs 1era
// Estrategia: network-first. Siempre intenta obtener la versión más nueva.
// Si no hay red, usa la caché como fallback.

const CACHE_NAME = 'oldgabs-v2';

self.addEventListener('install', (e) => {
  self.skipWaiting(); // Activa el SW nuevo inmediatamente
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  // Solo manejar requests GET
  if (e.request.method !== 'GET') return;

  // Para el HTML principal y los JS/CSS — network first, caché como fallback
  e.respondWith(
    fetch(e.request)
      .then(response => {
        // Si la respuesta es válida, la guardamos en caché y la devolvemos
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone));
        }
        return response;
      })
      .catch(() => {
        // Sin red: usar caché
        return caches.match(e.request);
      })
  );
});
