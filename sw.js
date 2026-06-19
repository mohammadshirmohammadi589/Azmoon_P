const CACHE_NAME = 'psy-app-v2';

// فقط فایل‌های واقعی + مهم
const ASSETS = [
  '/Azmoon_P/',
  '/Azmoon_P/index.html',
  '/Azmoon_P/style.css',
  '/Azmoon_P/script.js',
  '/Azmoon_P/manifest.json',
  '/Azmoon_P/icons/icon-192.png',
  '/Azmoon_P/icons/icon-512.png'
];

// ─────────────────────────────
// INSTALL
// ─────────────────────────────
self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
});

// ─────────────────────────────
// ACTIVATE
// ─────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// ─────────────────────────────
// FETCH (نسخه حرفه‌ای + ضد سفید شدن)
// ─────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // فقط برای GET
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then(response => {
        // فقط پاسخ‌های سالم را کش کن
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        // اگر آفلاین شد

        return caches.match(event.request).then(cached => {
          if (cached) return cached;

          // fallback مهم (حل صفحه سفید)
          if (event.request.destination === 'document') {
            return caches.match('/Azmoon_P/index.html');
          }

          return null;
        });
      })
  );
});
