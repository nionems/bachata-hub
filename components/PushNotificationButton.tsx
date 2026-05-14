"use client"

import { useState, useEffect } from 'react'
import { Bell, BellOff } from 'lucide-react'

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64)
  return Uint8Array.from([...rawData].map(char => char.charCodeAt(0)))
}

export function PushNotificationButton() {
  const [status, setStatus] = useState<'unsupported' | 'default' | 'subscribed' | 'denied'>('default')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      setStatus('unsupported')
      return
    }
    if (Notification.permission === 'denied') {
      setStatus('denied')
      return
    }
    // Check if already subscribed
    navigator.serviceWorker.ready.then(reg => {
      reg.pushManager.getSubscription().then(sub => {
        setStatus(sub ? 'subscribed' : 'default')
      })
    })
  }, [])

  const subscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(
          process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
        ),
      })
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscription: sub.toJSON() }),
      })
      setStatus('subscribed')
    } catch {
      setStatus(Notification.permission === 'denied' ? 'denied' : 'default')
    } finally {
      setLoading(false)
    }
  }

  const unsubscribe = async () => {
    setLoading(true)
    try {
      const reg = await navigator.serviceWorker.ready
      const sub = await reg.pushManager.getSubscription()
      if (sub) {
        await fetch('/api/push/subscribe', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ endpoint: sub.endpoint }),
        })
        await sub.unsubscribe()
      }
      setStatus('default')
    } finally {
      setLoading(false)
    }
  }

  if (status === 'unsupported') return null

  return (
    <button
      onClick={status === 'subscribed' ? unsubscribe : subscribe}
      disabled={loading || status === 'denied'}
      className={`inline-flex items-center justify-center p-2 rounded-full transition-colors duration-200 ${
        status === 'subscribed'
          ? 'text-primary hover:bg-primary/10'
          : status === 'denied'
          ? 'text-gray-300 cursor-not-allowed'
          : 'text-gray-500 hover:text-primary hover:bg-primary/10'
      }`}
      title={
        status === 'subscribed' ? 'Turn off notifications'
        : status === 'denied' ? 'Notifications blocked in browser settings'
        : 'Get notified about upcoming events'
      }
    >
      {status === 'subscribed'
        ? <Bell className="h-4 w-4 fill-primary" />
        : <BellOff className="h-4 w-4" />
      }
    </button>
  )
}
