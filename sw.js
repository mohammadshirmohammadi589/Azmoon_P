// Service Worker — کنکور ارشد روانشناسی
const CACHE_NAME = 'konkoor-psy-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/style.css',
  './script.js',
  '/manifest.json',
  '/icons/icon-48.png',
  '/icons/icon-72.png',
  '/icons/icon-96.png',
  '/icons/icon-144.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// نصب: همه فایل‌ها را کش کن
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching app shell');
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// فعال‌سازی: کش‌های قدیمی را پاک کن
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

// درخواست‌ها: اول از کش، بعد شبکه
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        // فایل‌های مهم را کش کن
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      }).catch(() => {
        // اگر آفلاین و کش نداریم، صفحه اصلی برگردان
        if (event.request.destination === 'document') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
