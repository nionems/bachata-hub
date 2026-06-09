export interface UpcomingCalendarEvent {
  id: string
  title: string
  start: string
  end?: string
  description?: string
  location?: string
  htmlLink?: string
  calendarCity: string
  state: string
}

const CITY_CALENDAR_MAP: { id: string; city: string; state: string }[] = [
  { id: '4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com', city: 'sydney', state: 'NSW' },
  { id: '641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com', city: 'melbourne', state: 'VIC' },
  { id: 'f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com', city: 'brisbane', state: 'QLD' },
  { id: '6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com', city: 'adelaide', state: 'SA' },
  { id: 'c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com', city: 'gold-coast', state: 'QLD' },
  { id: 'e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com', city: 'perth', state: 'WA' },
  { id: '3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com', city: 'canberra', state: 'ACT' },
  { id: '27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com', city: 'darwin', state: 'NT' },
  { id: '2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com', city: 'hobart', state: 'TAS' },
]

function detectState(location: string): string {
  const loc = (location || '').toLowerCase()
  if (/\bnsw\b|sydney|parramatta|newtown|bondi|manly|surry hills|glebe/.test(loc)) return 'NSW'
  if (/\bvic\b|melbourne|richmond|fitzroy|st kilda|collingwood/.test(loc)) return 'VIC'
  if (/\bqld\b|brisbane|gold coast|sunshine coast/.test(loc)) return 'QLD'
  if (/\bwa\b|perth|fremantle/.test(loc)) return 'WA'
  if (/\bsa\b|adelaide/.test(loc)) return 'SA'
  if (/\btas\b|hobart|launceston/.test(loc)) return 'TAS'
  if (/\bact\b|canberra/.test(loc)) return 'ACT'
  if (/\bnt\b|darwin/.test(loc)) return 'NT'
  return ''
}

function makeCalEventId(title: string, start: string): string {
  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 24).replace(/-$/, '')
  const date = start.slice(0, 10).replace(/-/g, '')
  return `cal_${slug}_${date}`
}

async function fetchOneCalendar(
  calendarId: string,
  city: string,
  state: string,
  start: Date,
  end: Date,
  apiKey: string
): Promise<UpcomingCalendarEvent[]> {
  const toEvent = (e: any): UpcomingCalendarEvent => {
    const startStr = e.start?.dateTime || e.start?.date || ''
    const detectedState = state || detectState(e.location || '')
    return {
      id: makeCalEventId(e.summary || '', startStr),
      title: e.summary || '',
      start: startStr,
      end: e.end?.dateTime || e.end?.date,
      description: e.description,
      location: e.location,
      htmlLink: e.htmlLink,
      calendarCity: city,
      state: detectedState,
    }
  }

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
        maxResults: 250,
      })
      return (response.data.items || [])
        .filter((e: any) => e.summary && (e.start?.dateTime || e.start?.date))
        .map(toEvent)
    }

    const url =
      `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
      `key=${apiKey}&timeMin=${start.toISOString()}&timeMax=${end.toISOString()}` +
      `&singleEvents=true&orderBy=startTime&maxResults=250`
    const res = await fetch(url)
    if (!res.ok) return []
    const data = await res.json()
    return (data.items || [])
      .filter((e: any) => e.summary && (e.start?.dateTime || e.start?.date))
      .map(toEvent)
  } catch {
    return []
  }
}

export async function fetchAllCalendarEvents(
  apiKey: string,
  daysAhead = 90
): Promise<UpcomingCalendarEvent[]> {
  // Start from midnight UTC so events earlier today (in Australian timezones) are included
  const todayMidnightUTC = new Date()
  todayMidnightUTC.setUTCHours(0, 0, 0, 0)

  const future = new Date(todayMidnightUTC)
  future.setDate(todayMidnightUTC.getDate() + daysAhead)

  const calendarEntries: { id: string; city: string; state: string }[] = [
    ...CITY_CALENDAR_MAP,
    ...(process.env.GOOGLE_CALENDAR_ID
      ? [{ id: process.env.GOOGLE_CALENDAR_ID, city: 'main', state: '' }]
      : []),
    ...(process.env.GOOGLE_CLIENT_EMAIL
      ? [{ id: process.env.GOOGLE_CLIENT_EMAIL, city: 'main', state: '' }]
      : []),
  ]

  const results = await Promise.allSettled(
    calendarEntries.map(({ id, city, state }) =>
      fetchOneCalendar(id, city, state, todayMidnightUTC, future, apiKey)
    )
  )

  const all: UpcomingCalendarEvent[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }

  all.sort((a, b) => a.start.localeCompare(b.start))

  // Deduplicate: same title on same date from multiple calendars → keep first occurrence
  const seen = new Set<string>()
  return all.filter(e => {
    const key = `${e.title.toLowerCase()}|${e.start.slice(0, 10)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}
