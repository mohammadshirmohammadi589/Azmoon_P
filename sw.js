const CACHE_NAME = 'konkoor-psy-v2';

const ASSETS = [
  '/Azmoon_P/',
  '/Azmoon_P/index.html',
  '/Azmoon_P/style.css',
  '/Azmoon_P/script.js',
  '/Azmoon_P/manifest.json',
  '/Azmoon_P/icons/icon-48.png',
  '/Azmoon_P/icons/icon-72.png',
  '/Azmoon_P/icons/icon-96.png',
  '/Azmoon_P/icons/icon-144.png',
  '/Azmoon_P/icons/icon-192.png',
  '/Azmoon_P/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => {
        if (k !== CACHE_NAME) return caches.delete(k);
      }))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
