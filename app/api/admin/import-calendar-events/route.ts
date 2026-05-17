import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/firebase-admin'
import { fetchAllCalendarEvents } from '@/lib/calendar-events'

export const maxDuration = 60

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

  try {
    const db = getDb()

    // Fetch calendar events and existing Firestore names in parallel
    const [calendarEvents, snapshot] = await Promise.all([
      fetchAllCalendarEvents(apiKey, 90),
      db.collection('events').select('name').get(),
    ])

    if (calendarEvents.length === 0) {
      return NextResponse.json({ imported: 0, message: 'No calendar events found' })
    }

    const firestoreNames: string[] = snapshot.docs.map(d => (d.data().name as string) || '')

    // Deduplicate by title, keep only calendar-only events
    const byTitle = new Map<string, any>()
    for (const ce of calendarEvents) {
      if (ce.title && !byTitle.has(ce.title)) byTitle.set(ce.title, ce)
    }

    const toImport = [...byTitle.values()].filter(
      ce => !firestoreNames.some(name => matchesEvent(ce.title, name))
    )

    if (toImport.length === 0) {
      return NextResponse.json({ imported: 0, message: 'All calendar events are already in Firestore' })
    }

    const now = new Date().toISOString()

    const results = await Promise.allSettled(
      toImport.map(async (ce) => {
        const startDate = ce.start?.includes('T') ? ce.start.split('T')[0] : (ce.start || '')
        const startTime = ce.start?.includes('T') ? ce.start.split('T')[1].slice(0, 5) : ''
        const endTime = ce.end?.includes('T') ? ce.end.split('T')[1].slice(0, 5) : ''

        await db.collection('events').add({
          name: ce.title,
          eventDate: startDate,
          startTime,
          endTime,
          location: ce.location || '',
          city: '',
          state: detectState(ce.location || ''),
          description: ce.description || '',
          imageUrl: '',
          eventLink: ce.htmlLink || '',
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
        })
        return ce.title
      })
    )

    const created = results
      .filter(r => r.status === 'fulfilled')
      .map(r => (r as PromiseFulfilledResult<string>).value)
    const failed = results.filter(r => r.status === 'rejected').length

    return NextResponse.json({
      imported: created.length,
      failed,
      events: created,
      message: `Imported ${created.length} event${created.length !== 1 ? 's' : ''}${failed ? `, ${failed} failed` : ''}`,
    })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
