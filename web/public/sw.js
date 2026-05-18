/* Legacy cleanup — unregister this service worker and clear old caches (fixes blank/stale pages). */
self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => self.registration.unregister())
      .then(() => self.clients.matchAll({ type: "window" }).then((clients) => {
        clients.forEach((c) => c.navigate(c.url));
      }))
  );
});

/* Do not intercept fetches — pass through to network. */
self.addEventListener("fetch", () => {});
