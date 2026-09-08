const CACHE_NAME = 'pci-report-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './css/app.css',
  './css/print.css',
  './js/presets.js',
  './js/app.js',
  './js/pdf.js',
  './js/sw-register.js',
  './assets/cks-logo.svg',
  './assets/nabh-logo.svg',
  './assets/icon.svg',
  './manifest.json',
  'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js'
];

/**
 * Helper to strip redirection status from a Response object.
 * Browsers throw an error when a Service Worker serves a response with response.redirected === true.
 */
function cleanResponse(response) {
  if (!response || !response.redirected) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers
  });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      console.log('[ServiceWorker] Pre-caching offline assets');
      await Promise.all(
        ASSETS_TO_CACHE.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              const clean = cleanResponse(response);
              await cache.put(url, clean);
            }
          } catch (err) {
            console.warn('[ServiceWorker] Failed to pre-cache asset:', url, err);
          }
        })
      );
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('[ServiceWorker] Clearing old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  // Only intercept GET requests
  if (event.request.method !== 'GET') return;

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cleanResponse(cachedResponse);
      }
      return fetch(event.request).then((networkResponse) => {
        if (!networkResponse || (networkResponse.status !== 200 && networkResponse.type !== 'opaque')) {
          return networkResponse;
        }

        const responseToReturn = cleanResponse(networkResponse);

        if (networkResponse.type === 'basic' || networkResponse.type === 'cors') {
          const responseToCache = responseToReturn.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }

        return responseToReturn;
      }).catch(() => {
        // Offline fallback if fetch fails
        if (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html')) {
          return caches.match('./index.html').then(res => res ? cleanResponse(res) : undefined);
        }
      });
    })
  );
});

