// Enhanced EduSync Service Worker – v2
const CACHE_NAME = "edusync-cache-v2";
const OFFLINE_URL = "/offline.html";
const STATIC_ASSETS = ["/", "/offline.html", "/logo.png", "/favicon.ico"];

// Install event – cache core assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("[SW] Caching static assets");
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate event – remove old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.map((key) => key !== CACHE_NAME && caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// Fetch handler
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== "GET") return;

  // Handle API calls (network-first)
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(request, clone));
          return response;
        })
        .catch(async () => {
          const cache = await caches.open(CACHE_NAME);
          const cached = await cache.match(request);
          return (
            cached ||
            new Response(
              JSON.stringify({ error: "Offline – API unavailable" }),
              { status: 503, headers: { "Content-Type": "application/json" } }
            )
          );
        })
    );
    return;
  }

  // For HTML pages – stale-while-revalidate strategy
  if (request.destination === "document") {
    event.respondWith(
      caches.match(request).then((cached) => {
        const networkFetch = fetch(request)
          .then((networkResponse) => {
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(request, networkResponse.clone())
            );
            return networkResponse;
          })
          .catch(() => caches.match(OFFLINE_URL));

        return cached || networkFetch;
      })
    );
    return;
  }

  // For other assets – cache-first strategy
  event.respondWith(
    caches.match(request).then((cached) => {
      return (
        cached ||
        fetch(request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) =>
              cache.put(request, clone)
            );
            return response;
          })
          .catch(() => caches.match(OFFLINE_URL))
      );
    })
  );
});
