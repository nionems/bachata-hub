import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

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

function detectState(location: string): string {
  const loc = (location || '').toLowerCase()
  if (/sydney|nsw|new south wales|bondi|manly|parramatta|newtown|surry hills|glebe/.test(loc)) return 'NSW'
  if (/melbourne|vic\b|victoria|richmond|fitzroy|st kilda|collingwood/.test(loc)) return 'VIC'
  if (/brisbane|qld|queensland|gold coast|sunshine coast/.test(loc)) return 'QLD'
  if (/perth|\bwa\b|western australia|fremantle/.test(loc)) return 'WA'
  if (/adelaide|\bsa\b|south australia/.test(loc)) return 'SA'
  if (/hobart|\btas\b|tasmania|launceston/.test(loc)) return 'TAS'
  if (/canberra|\bact\b|australian capital territory/.test(loc)) return 'ACT'
  if (/darwin|\bnt\b|northern territory/.test(loc)) return 'NT'
  return ''
}

function matchesEvent(calTitle: string, fbName: string): boolean {
  const cal = calTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const fb = fbName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  if (!cal || !fb) return false
  if (fb.length >= 4 && cal.includes(fb)) return true
  if (cal.length >= 4 && fb.includes(cal)) return true
  const calWords = new Set(cal.split(/\s+/).filter((w: string) => w.length > 3))
  const fbWords = fb.split(/\s+/).filter((w: string) => w.length > 3)
  return fbWords.filter((w: string) => calWords.has(w)).length >= 2
}

async function fetchCalendarEvents(apiKey: string): Promise<any[]> {
  const now = new Date()
  const future = new Date(now)
  future.setDate(now.getDate() + 90)

  const calendarIds = [
    ...CITY_CALENDAR_IDS,
    ...(process.env.GOOGLE_CALENDAR_ID ? [process.env.GOOGLE_CALENDAR_ID] : []),
  ]

  const results = await Promise.allSettled(
    calendarIds.map(async (id) => {
      try {
        const url =
          `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(id)}/events?` +
          `key=${apiKey}&timeMin=${now.toISOString()}&timeMax=${future.toISOString()}` +
          `&singleEvents=true&orderBy=startTime&maxResults=100`
        const res = await fetch(url)
        if (!res.ok) return []
        const data = await res.json()
        return (data.items || [])
          .filter((e: any) => e.summary && (e.start?.dateTime || e.start?.date))
          .map((e: any) => ({
            title: e.summary,
            start: e.start.dateTime || e.start.date,
            end: e.end?.dateTime || e.end?.date,
            description: e.description || '',
            location: e.location || '',
            htmlLink: e.htmlLink || '',
          }))
      } catch {
        return []
      }
    })
  )

  const all: any[] = []
  for (const r of results) {
    if (r.status === 'fulfilled') all.push(...r.value)
  }
  return all
}

export async function POST() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get('admin_session')
  if (!adminSession || adminSession.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_API_KEY not configured' }, { status: 500 })
  }

  const db = getDb()

  // Fetch existing Firestore events (all, not just published)
  const snapshot = await db.collection('events').get()
  const firestoreNames: string[] = snapshot.docs.map(d => d.data().name || '')

  // Fetch calendar events
  const calendarEvents = await fetchCalendarEvents(apiKey)

  // Deduplicate calendar events by title (keep earliest per unique title)
  const byTitle = new Map<string, any>()
  for (const ce of calendarEvents) {
    if (!byTitle.has(ce.title)) byTitle.set(ce.title, ce)
  }

  // Filter to calendar-only events (no matching Firestore event)
  const toImport = [...byTitle.values()].filter(
    ce => !firestoreNames.some(name => matchesEvent(ce.title, name))
  )

  if (toImport.length === 0) {
    return NextResponse.json({ imported: 0, message: 'No new calendar events to import' })
  }

  // Create Firestore documents
  const now = new Date().toISOString()
  const created: string[] = []

  for (const ce of toImport) {
    const startDate = ce.start.includes('T') ? ce.start.split('T')[0] : ce.start
    const startTime = ce.start.includes('T') ? ce.start.split('T')[1].slice(0, 5) : ''
    const endTime = ce.end?.includes('T') ? ce.end.split('T')[1].slice(0, 5) : ''
    const state = detectState(ce.location)

    const doc = {
      name: ce.title,
      eventDate: startDate,
      startTime,
      endTime,
      location: ce.location,
      city: '',
      state,
      description: ce.description,
      imageUrl: '',
      eventLink: ce.htmlLink,
      ticketLink: '',
      danceStyles: ['Bachata'],
      recurrence: '',
      isWeekly: false,
      isWorkshop: false,
      published: true,
      likesCount: 0,
      goingCount: 0,
      createdAt: now,
      updatedAt: now,
    }

    const ref = await db.collection('events').add(doc)
    created.push(`${ce.title} (${ref.id})`)
  }

  return NextResponse.json({
    imported: created.length,
    events: created,
    message: `Imported ${created.length} calendar events into Firestore`,
  })
}
