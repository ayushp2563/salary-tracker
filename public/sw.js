const CACHE_NAME = 'salary-tracker-v2.0.0';
const PRECACHE_URLS = ['/manifest.json', '/icon-192.png', '/icon-512.png'];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)));
      await self.clients.claim();
    })()
  );
});

// Network-first for HTML/JS/CSS so deploys are visible immediately.
// Cache-first only for static icons/manifest.
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  const isAsset =
    url.pathname.startsWith('/assets/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.html') ||
    url.pathname === '/';

  if (isAsset || request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.ok && request.method === 'GET') {
            const copy = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return cached || caches.match('/');
        })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request))
  );
});

self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || "Don't forget to log your hours for today!",
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1,
      url: data.url || '/?tab=daily-hours',
    },
    actions: [
      { action: 'log-hours', title: 'Log Hours', icon: '/icon-192.png' },
      { action: 'dismiss', title: 'Dismiss', icon: '/icon-192.png' },
    ],
    requireInteraction: false,
    tag: 'daily-reminder',
  };

  event.waitUntil(
    self.registration.showNotification(data.title || 'Salary Tracker Reminder', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'log-hours') {
    event.waitUntil(clients.openWindow(event.notification.data.url || '/?tab=daily-hours'));
  } else if (event.action !== 'dismiss') {
    event.waitUntil(clients.openWindow('/'));
  }
});
