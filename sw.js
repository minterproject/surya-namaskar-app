const CACHE_NAME = 'namaskar-counter-v5';
const URLS_TO_CACHE = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

// Install event - cache all resources aggressively
self.addEventListener('install', event => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Caching app resources');
        // Use addAll with individual requests to ensure all resources are cached
        const cachePromises = URLS_TO_CACHE.map(url => {
          return fetch(url)
            .then(response => {
              if (!response.ok) {
                throw new Error(`Failed to fetch ${url}: ${response.status}`);
              }
              return cache.put(url, response);
            })
            .catch(error => {
              console.error(`Failed to cache ${url}:`, error);
              // Continue with other resources even if one fails
            });
        });
        return Promise.all(cachePromises);
      })
      .then(() => {
        console.log('All resources cached successfully');
        // Force activation of new service worker
        return self.skipWaiting();
      })
      .catch(error => {
        console.error('Failed to cache resources:', error);
      })
  );
});

// Activate event - clean up old caches and take control
self.addEventListener('activate', event => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker activated and taking control');
      // Take control of all pages immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - serve from cache first (offline-first strategy)
self.addEventListener('fetch', event => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') return;
  
  event.respondWith(
    caches.match(event.request)
      .then(cachedResponse => {
        // Return cached version if available
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }
        
        // Try to fetch from network
        console.log('Fetching from network:', event.request.url);
        return fetch(event.request)
          .then(networkResponse => {
            // Cache successful responses for same-origin requests
            if (networkResponse.status === 200 && 
                (event.request.url.startsWith(self.location.origin) || 
                 event.request.url.startsWith('http://localhost') ||
                 event.request.url.includes('127.0.0.1'))) {
              const responseClone = networkResponse.clone();
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseClone);
                  console.log('Cached new resource:', event.request.url);
                });
            }
            return networkResponse;
          })
          .catch(error => {
            console.log('Network failed, trying cache fallback:', error);
            // Network failed, try to serve index.html for navigation requests
            if (event.request.destination === 'document') {
              return caches.match('./index.html');
            }
            // For other failed requests, return a basic offline response
            return new Response('Offline - resource not available', { 
              status: 503, 
              statusText: 'Service Unavailable',
              headers: {'Content-Type': 'text/plain'}
            });
          });
      })
  );
});

// Listen for messages from the main thread
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'CACHE_URLS') {
    // Force cache specific URLs
    event.waitUntil(
      caches.open(CACHE_NAME)
        .then(cache => cache.addAll(URLS_TO_CACHE))
        .then(() => {
          event.ports[0].postMessage({success: true});
        })
        .catch(error => {
          event.ports[0].postMessage({success: false, error: error.message});
        })
    );
  }
});