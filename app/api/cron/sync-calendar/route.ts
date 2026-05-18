import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/firebase-admin'
import { fetchAllCalendarEvents } from '@/lib/calendar-events'

export const maxDuration = 60

const STOP_WORDS = new Set([
  'salsa', 'bachata', 'dance', 'dancing', 'class', 'classes', 'social',
  'latin', 'night', 'party', 'event', 'show', 'kizomba', 'zouk',
  'workshop', 'with', 'and', 'the', 'monday', 'tuesday', 'wednesday',
  'thursday', 'friday', 'saturday', 'sunday', 'weekly', 'monthly',
])

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
  const calWords = new Set(cal.split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w)))
  const fbWords = fb.split(/\s+/).filter(w => w.length > 3 && !STOP_WORDS.has(w))
  if (fbWords.length === 0) return false
  return fbWords.filter(w => calWords.has(w)).length >= 2
}

export async function GET(request: Request) {
  // Accept Vercel cron secret header or admin session cookie for manual testing
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const adminSession = cookies().get('admin_session')
  const isAuthed = (cronSecret && authHeader === `Bearer ${cronSecret}`) || adminSession?.value === 'true'
  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const apiKey = process.env.GOOGLE_API_KEY
  if (!apiKey) {
    return NextResponse.json({ error: 'GOOGLE_API_KEY not configured' }, { status: 500 })
  }

  try {
    const db = getDb()

    const [calendarEvents, snapshot] = await Promise.all([
      fetchAllCalendarEvents(apiKey, 90),
      db.collection('events').select('name').get(),
    ])

    if (calendarEvents.length === 0) {
      return NextResponse.json({ imported: 0, message: 'No calendar events found' })
    }

    const firestoreNames: string[] = snapshot.docs.map(d => (d.data().name as string) || '')

    // Deduplicate calendar events by title, skip ones already in Firestore
    const byTitle = new Map<string, any>()
    for (const ce of calendarEvents) {
      if (ce.title && !byTitle.has(ce.title)) byTitle.set(ce.title, ce)
    }

    const toImport = [...byTitle.values()].filter(
      ce => !firestoreNames.some(name => matchesEvent(ce.title, name))
    )

    if (toImport.length === 0) {
      return NextResponse.json({ imported: 0, message: 'No new events to import' })
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

    console.log(`[cron/sync-calendar] Imported ${created.length} events, ${failed} failed:`, created)

    return NextResponse.json({
      imported: created.length,
      failed,
      events: created,
      message: `Imported ${created.length} new event${created.length !== 1 ? 's' : ''}${failed ? `, ${failed} failed` : ''}`,
    })
  } catch (error) {
    console.error('[cron/sync-calendar] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
