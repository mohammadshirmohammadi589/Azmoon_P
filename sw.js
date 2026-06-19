const CACHE_NAME = "psy-app-v1";

const BASE = "/Azmoon_P/";

const ASSETS = [
  BASE,
  BASE + "index.html",
  BASE + "style.css",
  BASE + "script.js",
  BASE + "manifest.json",
  BASE + "icons/icon-192.png",
  BASE + "icons/icon-512.png"
];

// install
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
  self.skipWaiting();
});

// activate
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

// fetch (اصلاح‌شده و پایدار)
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;

      return fetch(event.request)
        .then((res) => {
          return res;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match(BASE);
          }
        });
    })
  );
});
