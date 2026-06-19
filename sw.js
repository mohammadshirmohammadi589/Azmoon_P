const CACHE_NAME = 'psy-app-v1';

// مهم: همه مسیرها باید با /Azmoon_P/ باشند
const ASSETS = [
  '/Azmoon_P/',
  '/Azmoon_P/index.html',
  '/Azmoon_P/style.css',
  '/Azmoon_P/script.js',
  '/Azmoon_P/manifest.json',
  '/Azmoon_P/icons/icon-192.png',
  '/Azmoon_P/icons/icon-512.png'
];

// نصب
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      );
    })
  );
  self.clients.claim();
});

// fetch (مهم‌ترین بخش)
self.addEventListener('fetch', event => {
  event.respondWith(
    fetch(event.request)
      .then(response => {
        // فقط درخواست‌های معتبر را کش کن
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => {
            cache.put(event.request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(event.request).then(cached => {
          // اگر آفلاین بود
          return cached || caches.match('/Azmoon_P/index.html');
        });
      })
  );
});
