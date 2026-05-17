import { NextResponse } from 'next/server'
import { fetchAllCalendarEvents, UpcomingCalendarEvent } from '@/lib/calendar-events'

export type { UpcomingCalendarEvent }

let cache: UpcomingCalendarEvent[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 15 * 60 * 1000

export async function GET() {
  if (cache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json(cache)
  }

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return NextResponse.json([])

  const events = await fetchAllCalendarEvents(apiKey, 60)

  cache = events
  cacheTimestamp = Date.now()
  return NextResponse.json(events)
}
