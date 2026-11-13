'use client'

import { useEffect, useRef, useState } from 'react'
import { School } from '@/types/school'

interface SchoolWithCoords extends School {
  lat: number
  lng: number
}

const GEO_CACHE_KEY = 'bachata_school_geocache_v1'
const NOMINATIM_DELAY = 1100 // ms between requests (Nominatim limit: 1/s)

function loadGeoCache(): Record<string, { lat: number; lng: number }> {
  try {
    return JSON.parse(localStorage.getItem(GEO_CACHE_KEY) || '{}')
  } catch {
    return {}
  }
}

function saveGeoCache(cache: Record<string, { lat: number; lng: number }>) {
  try {
    localStorage.setItem(GEO_CACHE_KEY, JSON.stringify(cache))
  } catch {}
}

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query + ', Australia')}&countrycodes=au&format=json&limit=1`
    const res = await fetch(url, { headers: { 'Accept-Language': 'en' } })
    const data = await res.json()
    if (data.length > 0) return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }
  } catch {}
  return null
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

interface Props {
  schools: School[]
}

export default function SchoolsMap({ schools }: Props) {
  const mapRef = useRef<any>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const [located, setLocated] = useState<SchoolWithCoords[]>([])
  const [status, setStatus] = useState<'loading' | 'done'>('loading')

  useEffect(() => {
    if (!schools.length) return

    let cancelled = false

    async function run() {
      const cache = loadGeoCache()
      const results: SchoolWithCoords[] = []
      const toFetch: School[] = []

      // Use cache first
      for (const s of schools) {
        const key = `${s.location},${s.state}`
        if (cache[key]) {
          results.push({ ...s, ...cache[key] })
        } else {
          toFetch.push(s)
        }
      }

      setLocated([...results])

      // Fetch missing geocodes sequentially (respect 1 req/s limit)
      for (let i = 0; i < toFetch.length; i++) {
        if (cancelled) break
        const s = toFetch[i]
        const key = `${s.location},${s.state}`
        const coords = await geocode(`${s.location} ${s.state}`)
        if (coords) {
          cache[key] = coords
          results.push({ ...s, ...coords })
          if (!cancelled) setLocated([...results])
        }
        if (i < toFetch.length - 1) await sleep(NOMINATIM_DELAY)
      }

      saveGeoCache(cache)
      if (!cancelled) setStatus('done')
    }

    run()
    return () => { cancelled = true }
  }, [schools])

  // Lazy-load Leaflet on the client only
  useEffect(() => {
    if (!containerRef.current || located.length === 0) return

    let L: any
    let map: any

    async function initMap() {
      L = (await import('leaflet')).default
      await import('leaflet/dist/leaflet.css')

      // Fix default marker icon path broken by webpack
      delete (L.Icon.Default.prototype as any)._getIconUrl
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
        iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
        shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
      })

      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }

      map = L.map(containerRef.current!).setView([-25.2744, 133.7751], 4)
      mapRef.current = map

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 18,
      }).addTo(map)

      located.forEach(school => {
        const styles = Array.isArray(school.danceStyles)
          ? school.danceStyles.join(', ')
          : school.danceStyles || ''

        const popup = `
          <div style="min-width:180px;font-family:sans-serif">
            ${school.imageUrl ? `<img src="${school.imageUrl}" alt="${school.name}" style="width:100%;height:80px;object-fit:cover;border-radius:4px;margin-bottom:6px">` : ''}
            <strong style="font-size:14px">${school.name}</strong><br>
            <span style="font-size:12px;color:#666">${school.location}, ${school.state}</span><br>
            ${styles ? `<span style="font-size:11px;color:#888">${styles}</span><br>` : ''}
            ${school.website ? `<a href="${school.website}" target="_blank" rel="noopener" style="font-size:12px;color:#2563eb">Visit website →</a>` : ''}
          </div>
        `
        L.marker([school.lat, school.lng]).addTo(map).bindPopup(popup)
      })

      // Fit bounds if we have markers
      if (located.length > 0) {
        const bounds = L.latLngBounds(located.map(s => [s.lat, s.lng]))
        map.fitBounds(bounds, { padding: [40, 40], maxZoom: 10 })
      }
    }

    initMap()

    return () => {
      if (mapRef.current) {
        mapRef.current.remove()
        mapRef.current = null
      }
    }
  }, [located])

  return (
    <div className="w-full rounded-xl overflow-hidden shadow-md border border-gray-200">
      {status === 'loading' && located.length === 0 && (
        <div className="flex items-center justify-center h-12 bg-blue-50 text-blue-700 text-sm gap-2">
          <span className="animate-spin">⏳</span> Locating schools on map…
        </div>
      )}
      {status === 'loading' && located.length > 0 && (
        <div className="text-center bg-blue-50 text-blue-600 text-xs py-1">
          Geocoding remaining schools…
        </div>
      )}
      <div ref={containerRef} style={{ height: '480px', width: '100%' }} />
    </div>
  )
}
