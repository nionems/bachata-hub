const CACHE_NAME = 'bachata-hub-v1'
const FESTIVAL_CACHE_NAME = 'festivals-cache-v1'

// Files to cache immediately
const urlsToCache = [
  '/',
  '/festivals',
  '/api/festivals',
  '/images/placeholder.jpg'
]

// Install event - cache essential files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
  )
})

// Fetch event - serve from cache when possible
self.addEventListener('fetch', (event) => {
  const { request } = event
  
  // Handle festival API requests
  if (request.url.includes('/api/festivals')) {
    event.respondWith(
      caches.open(FESTIVAL_CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((response) => {
              // Return cached response if available
              if (response) {
                return response
              }
              
              // Fetch from network and cache
              return fetch(request)
                .then((networkResponse) => {
                  // Clone the response before caching
                  const responseToCache = networkResponse.clone()
                  cache.put(request, responseToCache)
                  return networkResponse
                })
                .catch(() => {
                  // Return cached response if network fails
                  return cache.match(request)
                })
            })
        })
    )
    return
  }
  
  // Handle image requests
  if (request.destination === 'image') {
    event.respondWith(
      caches.match(request)
        .then((response) => {
          // Return cached image if available
          if (response) {
            return response
          }
          
          // Fetch from network and cache
          return fetch(request)
            .then((networkResponse) => {
              // Only cache successful responses
              if (networkResponse.status === 200) {
                const responseToCache = networkResponse.clone()
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    cache.put(request, responseToCache)
                  })
              }
              return networkResponse
            })
            .catch(() => {
              // Return placeholder if image fails to load
              return caches.match('/images/placeholder.jpg')
            })
        })
    )
    return
  }
  
  // For other requests, try network first, then cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        // Clone the response before caching
        const responseToCache = response.clone()
        caches.open(CACHE_NAME)
          .then((cache) => {
            cache.put(request, responseToCache)
          })
        return response
      })
      .catch(() => {
        // Return cached response if network fails
        return caches.match(request)
      })
  )
})

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME && cacheName !== FESTIVAL_CACHE_NAME) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      })
  )
})

// Background sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(
      // Sync festival data when back online
      fetch('/api/festivals')
        .then((response) => response.json())
        .then((data) => {
          // Update cache with fresh data
          return caches.open(FESTIVAL_CACHE_NAME)
            .then((cache) => {
              return cache.put('/api/festivals', new Response(JSON.stringify(data)))
            })
        })
        .catch((error) => {
          console.log('Background sync failed:', error)
        })
    )
  }
})
