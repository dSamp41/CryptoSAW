// Incrementing OFFLINE_VERSION will kick off the install event and force previously cached resources to be updated from the network.
// This variable is intentionally declared and unused.

const OFFLINE_VERSION = 2;
const CACHE_NAME = "v1";

const OFFLINE_URL = "/offline.html";
const ICONS = [];
const urlsToCache = ['/', '/index.html', '/src/index.css','/src/main.tsx', '/app.webmanifest', ' https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2', 
    '/icon/192.png', '/icon/384.png', '/icon/maskable_icon.png', '/min_rocket.svg'];


self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);
      // Setting {cache: 'reload'} in the new request ensures that the response isn't fulfilled from the HTTP cache; i.e., it will be from the network.
      //await cache.add(new Request(OFFLINE_URL, { cache: "reload" }));
      await cache.add(OFFLINE_URL);
      caches.open(CACHE_NAME)
        //.then((cache) => cache.addAll(urlsToCache))
        .then(async (cache) => {
            for (const el of urlsToCache){
              try{
                await cache.add(el)
              }
              catch(err){
                console.error(`cache.add ${el}`)
              }
            }
        })
        .catch((err) => console.error(err))
    })()
  );
  // Force the waiting service worker to become the active service worker.
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      // Enable navigation preload if it's supported.
      // See https://developers.google.com/web/updates/2017/02/navigation-preload
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Tell the active service worker to take control of the page immediately.
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  // Only call event.respondWith() if this is a navigation request for an HTML page.
  if (event.request.mode === "navigate") {
    event.respondWith((async () => {
      try {
        // First, try to use the navigation preload response if it's supported.
        const preloadResponse = await event.preloadResponse;
        if (preloadResponse) {
          return preloadResponse;
        }

        // Always try the network first.
        const networkResponse = await fetch(event.request);
        return networkResponse;
      } 
      catch (error) {
        // catch is only triggered if an exception is thrown, which is likely due to a network error.
        // If fetch() returns a valid HTTP response with a response code in the 4xx or 5xx range, the catch() will NOT be called.
        console.debug("Fetch failed; returning offline page instead.", error);

        const cache = await caches.open(CACHE_NAME);
        const cachedResponse = await cache.match(OFFLINE_URL);
        return cachedResponse;
      }
    })()
    );
  }

  // If our if() condition is false, then this fetch handler won't intercept the request. 
  // If there are any other fetch handlers registered, they will get a chance to call event.respondWith().
  // If no fetch handlers call event.respondWith(), the request will be handled by the browser as if there were no service worker involvement.
});