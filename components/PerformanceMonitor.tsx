import { useEffect, useState } from 'react'

interface PerformanceMonitorProps {
  name: string
  onLoadComplete?: (duration: number) => void
}

export function PerformanceMonitor({ name, onLoadComplete }: PerformanceMonitorProps) {
  const [startTime] = useState(Date.now())
  const [loadTime, setLoadTime] = useState<number | null>(null)

  useEffect(() => {
    const handleLoad = () => {
      const duration = Date.now() - startTime
      setLoadTime(duration)
      onLoadComplete?.(duration)
      
      // Log performance data
      console.log(`🚀 ${name} loaded in ${duration}ms`)
      
      // Send to analytics if needed
      if (typeof window !== 'undefined' && window.gtag) {
        window.gtag('event', 'timing_complete', {
          name: name,
          value: duration,
          event_category: 'performance'
        })
      }
    }

    // Use different load events for better accuracy
    if (document.readyState === 'complete') {
      handleLoad()
    } else {
      window.addEventListener('load', handleLoad)
      return () => window.removeEventListener('load', handleLoad)
    }
  }, [name, startTime, onLoadComplete])

  // Only show in development
  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 text-white px-3 py-1 rounded-full text-xs z-50">
      {name}: {loadTime ? `${loadTime}ms` : 'Loading...'}
    </div>
  )
}
