"use client"

import { useEffect } from 'react'
import { registerServiceWorker } from '@/lib/serviceWorker'

export function ServiceWorkerRegistration() {
  useEffect(() => {
    registerServiceWorker()
  }, [])

  return null
}

