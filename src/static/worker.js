const CURRENT = Date.now(), // Current date
  TTL = 1000 * 60 * 60 * 24 * 7, // Cache lives 7 days
  EXTENSIONS = ['woff', 'woff2'];

let CACHE_NAME; // Cache name

/**
 * Check all caches and delete all caches that older the three days
 */
caches.keys().then(function(cacheNames) {
  for (let index in cacheNames) {
    let diff = Math.abs(CURRENT - cacheNames[index]);
    if (!isNaN(diff) && diff < TTL) {
      CACHE_NAME = cacheNames[index];
    } else {
      caches.delete(cacheNames[index]);
    }
  }
  if (typeof CACHE_NAME === 'undefined') CACHE_NAME = CURRENT;
});

/**
 * On each request cache it
 */
self.addEventListener('fetch', function(event) {
  let domain = event.request.url
    .replace('http://', '')
    .replace('https://', '')
    .split(/[/?#]/)[0];
  let extension = event.request.url
    .split('?')[0]
    .split('/')
    .pop()
    .split('.')
    .pop();

  // We should cache only get requests
  if (event.request.method !== 'GET') return;

  // We should cache only selected extensions
  if (!EXTENSIONS.includes(extension)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.match(event.request.url).then(function(response) {
        if (typeof response !== 'undefined') return response;
        return fetch(event.request.url).then(function(response) {
          if (!response.ok) return response;
          let clone = response.clone();
          cache.put(event.request.url, response);
          return clone;
        });
      });
    }),
  );
});
