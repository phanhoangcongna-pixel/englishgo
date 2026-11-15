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

function cacheResponseSafely(request, response, cacheKey = request) {
  if (!response || !response.ok) return Promise.resolve();
  let copy;
  try {
    copy = response.clone();
  } catch (error) {
    return Promise.resolve();
  }
  return caches.open(CACHE_NAME)
    .then((cache) => cache.put(cacheKey, copy))
    .catch(() => {});
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== "GET" || url.origin !== self.location.origin) return;

  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request).then((response) => {
        return cacheResponseSafely("./index.html", response, "./index.html").then(() => response);
      }).catch(async () => (await caches.match(request)) || (await caches.match("./index.html")))
    );
    return;
  }

  if (url.pathname.endsWith(".png") || url.pathname.endsWith(".webmanifest")) {
    event.respondWith(caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      return cacheResponseSafely(request, response).then(() => response);
    })));
  }
});
