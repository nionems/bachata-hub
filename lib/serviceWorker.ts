export function registerServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    // Register immediately instead of waiting for load event for faster caching
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        registerSW()
      })
    } else {
      // DOM already loaded, register immediately
      registerSW()
    }
  }
}

function registerSW() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker
      .register('/sw.js', { scope: '/' })
      .then((registration) => {
        console.log('SW registered: ', registration)
        
        // Check for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                console.log('New content is available')
              }
            })
          }
        })
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError)
      })
  }
}

export function unregisterServiceWorker() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        registration.unregister()
      })
      .catch((error) => {
        console.error(error.message)
      })
  }
}

// Request background sync when online
export function requestBackgroundSync() {
  if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
    navigator.serviceWorker.ready
      .then((registration) => {
        // Check if sync is available (it's not in all browsers)
        if ('sync' in registration) {
          return (registration as any).sync.register('background-sync')
        }
        console.log('Background sync not supported in this browser')
      })
      .catch((error) => {
        console.log('Background sync registration failed:', error)
      })
  }
}
