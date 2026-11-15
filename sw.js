const CACHE_NAME = "englishgo-pwa-v3";
const APP_SHELL = ["./", "./index.html", "./englishgo-icon.png", "./manifest.webmanifest"];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function cacheResponseSafely(event, request, response, cacheKey = request) {
  if (!response || !response.ok) return;
  try {
    const copy = response.clone();
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => cache.put(cacheKey, copy))
        .catch(() => {})
    );
  } catch (error) {
    // Cache failures must never break the original page response.
  }
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        cacheResponseSafely(event, "./index.html", response, "./index.html");
        return response;
      }).catch(async () => (await caches.match(request)) || (await caches.match("./index.html")))
    );
    return;
  }

  if (url.pathname.endsWith(".png") || url.pathname.endsWith(".webmanifest")) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      cacheResponseSafely(event, request, response);
      return response;
    })));
  }
});
