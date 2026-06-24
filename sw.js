// این Service Worker همه کش‌های قدیمی را پاک می‌کند
self.addEventListener('install', function(e) {
  self.skipWaiting();
});

self.addEventListener('activate', function(e) {
  e.waitUntil(
    caches.keys().then(function(keys) {
      return Promise.all(keys.map(function(k) {
        console.log('Deleting cache:', k);
        return caches.delete(k);
      }));
    }).then(function() {
      return self.clients.claim();
    })
  );
});

self.addEventListener('fetch', function(e) {
  // بدون کش — همیشه از شبکه
  e.respondWith(fetch(e.request));
});
