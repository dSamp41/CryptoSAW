const CACHE_NAME = "v1";
const OFFLINE_URL = 'src/offline.html';
const urlsToCache = ['/', 'index.html', 'src/index.css','src/main.tsx', '/app.webmanifest', OFFLINE_URL, ' https://fonts.gstatic.com/s/montserrat/v25/JTUSjIg1_i6t8kCHKm459Wlhyw.woff2', 
    'src/assets/reactive-trader.ico', '/vite.svg'];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(urlsToCache))
    );
    console.log('Successfully installed')
});

self.addEventListener('activate', event => {
    console.log('Activating')
})

/*
self.addEventListener('fetch', (event) => {
    console.log(`Fetching: ${event.request.url}`);
    //event.respondWith(
        (async () => {
            try {
                caches.match(event.request).then(function(response) {
                    return response || fetch(event.request);
                })
            }
            catch (error){
                console.log("Offline");
                //await caches.match(OFFLINE_URL);
            }
        })()
    );//

    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            return response || fetch(event.request);
        })
    )
});
*/

/*
self.addEventListener('fetch', event => {
    //console.log(`Fetching: ${event.request.url}`);
    if(event.request.mode === 'navigate'){
        event.respondWith((async () => {
            const cache = await caches.open(CACHE_NAME);
            
            // Try the cache first.
            const cachedResponse = await cache.match(event.request);
            if (cachedResponse !== undefined) {
                return cachedResponse;
            } else {
                try {
                    const fetchResponse = await fetch(event.request);
                    if (!event.request.url.includes('v2/assets') && !event.request.url.includes('firestore.googleapis.com')) {
                        // Save the new resource in the cache (responses are streams, so we need to clone in order to use it here).
                        cache.put(event.request, fetchResponse.clone());
                    }
                    
                    return fetchResponse;
                } 
                catch (e) {
                    // Fetching didn't work let's go to the error page.
                    if (event.request.mode === 'navigate') {
                        await rememberRequestedTip(event.request.url);
                        
                        const errorResponse = await cache.match(OFFLINE_URL);
                        return errorResponse;
                    }
                }
            }
        })());
    }
});
*/

self.addEventListener("fetch", (event) => {
    // Only call event.respondWith() if this is a navigation request
    // for an HTML page.
    if (event.request.mode === "navigate") {
      event.respondWith(
        (async () => {
          try {
            // First, try to use the navigation preload response if it's
            // supported.
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              return preloadResponse;
            }
  
            // Always try the network first.
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // catch is only triggered if an exception is thrown, which is
            // likely due to a network error.
            // If fetch() returns a valid HTTP response with a response code in
            // the 4xx or 5xx range, the catch() will NOT be called.
            console.log("Fetch failed; returning offline page instead.", error);
  
            const cache = await caches.open(CACHE_NAME);
            const cachedResponse = await cache.match(OFFLINE_URL);
            return cachedResponse;
          }
        })()
      );
    }
});

self.addEventListener('message', (event) => {
    if(event.data && event.data.type === 'OFFLINE'){
        console.log('Currently offline')
        
        caches.match(OFFLINE_URL)
            .then((response) => {
                console.log(`RESP: ${response.url}`)
                return response})
            .catch((error) => {console.error(`ERR: ${error}`)})
    }
})