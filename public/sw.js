const CACHE_NAME = 'bachata-hub-v2'
const FESTIVAL_CACHE_NAME = 'festivals-cache-v1'
const STATIC_CACHE_NAME = 'static-assets-v2'

// Files to cache immediately - critical for initial load
const urlsToCache = [
  '/',
  '/images/placeholder.jpg',
  '/images/placeholder.svg',
  '/images/BACHATA.AU (13).png',
  '/images/ticketlime.JPG'
]

// Install event - cache essential files with skipWaiting for faster activation
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then((cache) => {
        console.log('Caching static assets')
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/api')))
      }),
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Opened main cache')
        // Only cache non-API routes
        return cache.addAll(urlsToCache.filter(url => !url.startsWith('/api')))
      })
    ]).then(() => {
      // Skip waiting to activate immediately
      return self.skipWaiting()
    })
  )
})

// Fetch event - optimized caching strategy for performance
self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') {
    return
  }
  
  // Handle static assets (JS, CSS, images, fonts) - Cache First for speed
  if (
    request.destination === 'script' ||
    request.destination === 'style' ||
    request.destination === 'image' ||
    request.destination === 'font' ||
    url.pathname.startsWith('/_next/static') ||
    url.pathname.startsWith('/images/') ||
    url.pathname.endsWith('.js') ||
    url.pathname.endsWith('.css') ||
    url.pathname.endsWith('.woff') ||
    url.pathname.endsWith('.woff2')
  ) {
    event.respondWith(
      caches.open(STATIC_CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              // Return cached version immediately for speed
              if (cachedResponse) {
                return cachedResponse
              }
              
              // Fetch from network and cache for next time
              return fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone()
                    cache.put(request, responseToCache)
                  }
                  return networkResponse
                })
                .catch(() => {
                  // For images, return placeholder if network fails
                  if (request.destination === 'image') {
                    return caches.match('/images/placeholder.svg')
                  }
                  throw new Error('Network request failed')
                })
            })
        })
    )
    return
  }
  
  // Handle festival API requests - Stale While Revalidate
  if (request.url.includes('/api/festivals')) {
    event.respondWith(
      caches.open(FESTIVAL_CACHE_NAME)
        .then((cache) => {
          return cache.match(request)
            .then((cachedResponse) => {
              // Return cached response immediately
              const fetchPromise = fetch(request)
                .then((networkResponse) => {
                  if (networkResponse.status === 200) {
                    const responseToCache = networkResponse.clone()
                    cache.put(request, responseToCache)
                  }
                  return networkResponse
                })
                .catch(() => null)
              
              // Return cached version immediately, update in background
              return cachedResponse || fetchPromise
            })
        })
    )
    return
  }
  
  // Handle Google Calendar API requests - Always fetch fresh, no caching
  if (request.url.includes('googleapis.com/calendar') || request.url.includes('googleapis.com/calendars')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Don't cache calendar API responses - always get fresh data
          return networkResponse
        })
        .catch(() => {
          // If network fails, don't return stale cached data for calendar
          throw new Error('Calendar API request failed')
        })
    )
    return
  }
  
  // Handle API requests - Network First with short cache for non-calendar APIs
  if (request.url.includes('/api/')) {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
          // Only cache non-calendar API responses, and with a short TTL
          if (networkResponse.status === 200 && !request.url.includes('calendar')) {
            const responseToCache = networkResponse.clone()
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(request, responseToCache)
              })
          }
          return networkResponse
        })
        .catch(() => {
          // Return cached response if network fails (only for non-calendar APIs)
          if (!request.url.includes('calendar')) {
            return caches.match(request)
          }
          throw new Error('API request failed')
        })
    )
    return
  }
  
  // Handle HTML pages - Network First with cache fallback
  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(
      fetch(request)
        .then((networkResponse) => {
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
          // Return cached page if network fails
          return caches.match(request)
            .then((cachedPage) => {
              if (cachedPage) {
                return cachedPage
              }
              // Fallback to home page if specific page not cached
              return caches.match('/')
            })
        })
    )
    return
  }
  
  // For other requests, try network first, then cache
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.status === 200) {
          const responseToCache = response.clone()
          caches.open(CACHE_NAME)
            .then((cache) => {
              cache.put(request, responseToCache)
            })
        }
        return response
      })
      .catch(() => {
        return caches.match(request)
      })
  )
})

// Activate event - clean up old caches and claim clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (
              cacheName !== CACHE_NAME &&
              cacheName !== FESTIVAL_CACHE_NAME &&
              cacheName !== STATIC_CACHE_NAME
            ) {
              console.log('Deleting old cache:', cacheName)
              return caches.delete(cacheName)
            }
          })
        )
      }),
      // Claim all clients immediately for faster activation
      self.clients.claim()
    ])
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
