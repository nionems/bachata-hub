import { NextResponse } from 'next/server'

const CITY_CALENDAR_IDS = [
  '4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com',
  '641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com',
  'f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com',
  '6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com',
  'c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com',
  'e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com',
  '3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com',
  '27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com',
  '2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com',
]

export interface UpcomingCalendarEvent {
  title: string
  start: string // ISO date or dateTime string
}

let cache: UpcomingCalendarEvent[] | null = null
let cacheTimestamp = 0
const CACHE_DURATION = 15 * 60 * 1000 // 15 minutes

export async function GET() {
  if (cache && Date.now() - cacheTimestamp < CACHE_DURATION) {
    return NextResponse.json(cache)
  }

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) return NextResponse.json([])

  const now = new Date()
  const future = new Date(now)
  future.setDate(now.getDate() + 60)

  const calendarIds = [
    ...CITY_CALENDAR_IDS,
    ...(process.env.GOOGLE_CALENDAR_ID ? [process.env.GOOGLE_CALENDAR_ID] : []),
    ...(process.env.GOOGLE_CLIENT_EMAIL ? [process.env.GOOGLE_CLIENT_EMAIL] : []),
  ]

  const results = await Promise.allSettled(
    calendarIds.map(id => fetchCalendar(id, now, future, apiKey))
  )

  const allEvents: UpcomingCalendarEvent[] = []
  for (const result of results) {
    if (result.status === 'fulfilled') allEvents.push(...result.value)
  }

  // Sort chronologically, then deduplicate by title+date
  allEvents.sort((a, b) => a.start.localeCompare(b.start))
  const seen = new Set<string>()
  const deduped = allEvents.filter(e => {
    const key = `${e.title.toLowerCase()}|${e.start.slice(0, 10)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })

  cache = deduped
  cacheTimestamp = Date.now()
  return NextResponse.json(deduped)
}

async function fetchCalendar(
  calendarId: string,
  start: Date,
  end: Date,
  apiKey: string
): Promise<UpcomingCalendarEvent[]> {
  try {
    const isPrivate =
      calendarId.includes('@') && !calendarId.includes('@group.calendar.google.com')

    if (isPrivate && process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      const { google } = await import('googleapis')
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
      })
      const calendar = google.calendar({ version: 'v3', auth })
      const response = await calendar.events.list({
        calendarId,
        timeMin: start.toISOString(),
        timeMax: end.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
        maxResults: 100,
      })
      return (response.data.items || [])
        .filter((e: any) => e.summary && (e.start?.dateTime || e.start?.date))
        .map((e: any) => ({ title: e.summary, start: e.start.dateTime || e.start.date }))
    }

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `key=${apiKey}&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}` +
      `&singleEvents=true&orderBy=startTime&maxResults=100`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (data.items || [])
      .filter((e: any) => e.summary && (e.start?.dateTime || e.start?.date))
      .map((e: any) => ({ title: e.summary, start: e.start.dateTime || e.start.date }))
  } catch {
    return []
  }
}
