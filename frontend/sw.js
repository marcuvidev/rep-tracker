const CACHE_NAME = 'gym-tracker-v1.2';
const FILES_TO_CACHE = [
  '/frontend/',
  '/frontend/index.html',
  '/frontend/style.css',
  '/frontend/app.js',
  '/frontend/manifest.json',
  '/frontend/assets/gym.png',
  '/frontend/assets/pesa.png',
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES_TO_CACHE))
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames =>
      Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      )
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(networkResponse => {
        // Don't cache opaque (no-cors) or failed responses
        if (
          !networkResponse || 
          networkResponse.status !== 200 || 
          networkResponse.type === 'opaque'
        ) {
          return networkResponse;
        }

        const clonedResponse = networkResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, clonedResponse);
        });

        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
