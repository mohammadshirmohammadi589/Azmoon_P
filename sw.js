const CACHE_NAME = 'azmoon-psy-v3';
const BASE = './';

const ASSETS = [
  BASE,
  BASE + 'index.html',
  BASE + 'style.css',
  BASE + 'script.js',
  BASE + 'manifest.json',
  BASE + 'icons/icon-192.png',
  BASE + 'icons/icon-512.png'
];

// Install
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// Activate
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

// Fetch
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (!res || res.status !== 200) return res;

        const copy = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));

        return res;
      })
      .catch(() => {
        return caches.match(event.request)
          || caches.match(BASE + 'index.html');
      })
  );
});
