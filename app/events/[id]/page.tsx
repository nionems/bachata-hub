import type { Metadata } from 'next'
import { fetchAllCalendarEvents } from '@/lib/calendar-events'
import EventDetailClient from './EventDetailClient'

// 15-minute server-side cache for calendar events lookup
let _cache: Awaited<ReturnType<typeof fetchAllCalendarEvents>> | null = null
let _cacheTs = 0

async function getCalendarEvent(id: string) {
  if (!_cache || Date.now() - _cacheTs > 15 * 60 * 1000) {
    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) return null
    _cache = await fetchAllCalendarEvents(apiKey, 90)
    _cacheTs = Date.now()
  }
  return _cache.find(e => e.id === id) ?? null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  if (!params.id.startsWith('cal_')) return { title: 'Event | Bachata Hub Australia' }

  const event = await getCalendarEvent(params.id)
  if (!event) return { title: 'Event | Bachata Hub Australia' }

  const title = event.title
  const rawDesc = (event.description ?? '').replace(/<[^>]+>/g, '').replace(/https?:\/\/\S+/g, '').trim()
  const description = rawDesc.slice(0, 160) || `${title} – Bachata event in Australia`

  return {
    title: `${title} | Bachata Hub Australia`,
    description,
    alternates: { canonical: `https://bachata.au/events/${params.id}` },
    openGraph: {
      title,
      description,
      type: 'website',
      siteName: 'Bachata Hub Australia',
      url: `https://bachata.au/events/${params.id}`,
      images: [{ url: '/images/BACHATA.AU (13).png', width: 1200, height: 630 }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default function EventPage({ params }: { params: { id: string } }) {
  return <EventDetailClient id={params.id} />
}
