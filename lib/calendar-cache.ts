import { fetchAllCalendarEvents, UpcomingCalendarEvent } from './calendar-events'

let cache: UpcomingCalendarEvent[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 15 * 60 * 1000

export async function getCalendarEvents(force = false): Promise<UpcomingCalendarEvent[]> {
  if (!force && cache && Date.now() - cacheTimestamp < CACHE_DURATION) return cache
  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return []
  cache = await fetchAllCalendarEvents(apiKey, 90)
  cacheTimestamp = Date.now()
  return cache
}
