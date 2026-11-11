import { NextResponse } from 'next/server'
import { fetchAllCalendarEvents } from '@/lib/calendar-events'

// Reuse the same in-process cache as the /api/calendar/upcoming route
let cache: Awaited<ReturnType<typeof fetchAllCalendarEvents>> | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 15 * 60 * 1000

async function getEvents() {
  if (cache && Date.now() - cacheTimestamp < CACHE_DURATION) return cache
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return []
  cache = await fetchAllCalendarEvents(apiKey, 90)
  cacheTimestamp = Date.now()
  return cache
}

export async function GET(_: Request, { params }: { params: { id: string } }) {
  const events = await getEvents()
  const event = events.find(e => e.id === params.id)
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  return NextResponse.json(event)
}
