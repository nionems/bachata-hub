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

function extractDriveImageUrl(description?: string): string {
  if (!description) return ''
  const tagMatch = description.match(/\[image:(https?:\/\/[^\]]+)\]/)
  if (tagMatch) return tagMatch[1]
  const driveMatch = description.match(
    /https?:\/\/drive\.google\.com\/(?:file\/d\/([^/\s?#]+)|open\?[^&\s]*id=([^&\s#]+)|uc\?[^&\s]*id=([^&\s#]+))/
  )
  if (!driveMatch) return ''
  const fileId = driveMatch[1] || driveMatch[2] || driveMatch[3]
  if (!fileId) return ''
  return `https://drive.google.com/thumbnail?id=${fileId}&sz=w400`
}

export async function GET(request: Request) {
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
      db.collection('events').get(),
    ])

    if (calendarEvents.length === 0) {
      return NextResponse.json({ imported: 0, updated: 0, unpublished: 0, flagged: 0, message: 'No calendar events found' })
    }

    // Deduplicate calendar events by title (keep earliest occurrence)
    const byTitle = new Map<string, any>()
    for (const ce of calendarEvents) {
      if (ce.title && !byTitle.has(ce.title)) byTitle.set(ce.title, ce)
    }

    const firestoreDocs = snapshot.docs.map(d => ({ id: d.id, ...d.data() } as any))
    const now = new Date().toISOString()

    // ── 1. Import new events + backfill images ─────────────────────────────
    const toImport: any[] = []
    const toUpdate: { id: string; imageUrl: string }[] = []

    for (const ce of byTitle.values()) {
      const match = firestoreDocs.find(doc => matchesEvent(ce.title, doc.name || ''))
      if (!match) {
        toImport.push(ce)
      } else if (!match.imageUrl) {
        const imageUrl = extractDriveImageUrl(ce.description)
        if (imageUrl) toUpdate.push({ id: match.id, imageUrl })
      }
    }

    const [importResults, updateResults] = await Promise.all([
      Promise.allSettled(
        toImport.map(async (ce) => {
          const startDate = ce.start?.includes('T') ? ce.start.split('T')[0] : (ce.start || '')
          const startTime = ce.start?.includes('T') ? ce.start.split('T')[1].slice(0, 5) : ''
          const endTime = ce.end?.includes('T') ? ce.end.split('T')[1].slice(0, 5) : ''
          const imageUrl = extractDriveImageUrl(ce.description)
          await db.collection('events').add({
            name: ce.title,
            eventDate: startDate,
            startTime,
            endTime,
            location: ce.location || '',
            city: '',
            state: detectState(ce.location || ''),
            description: ce.description || '',
            imageUrl,
            eventLink: ce.htmlLink || '',
            ticketLink: '',
            danceStyles: ['Bachata'],
            recurrence: '',
            isWeekly: false,
            isWorkshop: false,
            published: true,
            calendarSynced: true,   // mark as auto-imported so cross-check can manage it
            likesCount: 0,
            goingCount: 0,
            createdAt: now,
            updatedAt: now,
          })
          return ce.title
        })
      ),
      Promise.allSettled(
        toUpdate.map(async ({ id, imageUrl }) => {
          await db.collection('events').doc(id).update({ imageUrl, updatedAt: now })
          return id
        })
      ),
    ])

    const created = importResults.filter(r => r.status === 'fulfilled').map(r => (r as PromiseFulfilledResult<string>).value)
    const updatedImages = updateResults.filter(r => r.status === 'fulfilled').length

    // ── 2. Cross-check: detect cancelled events ────────────────────────────
    // For each published Firestore event, check whether ANY upcoming calendar
    // event still matches it. If the user cancelled it in Google Calendar the
    // event will simply disappear from the upcoming list.
    //
    // • calendarSynced events  → auto-unpublish (safe: they were created by the cron)
    // • Manually-entered events → flag with noCalendarMatch:true but leave published
    //   so admins can review without data loss
    const toUnpublish: { id: string; name: string }[] = []
    const toFlag: { id: string; name: string }[] = []

    for (const doc of firestoreDocs) {
      if (!doc.published) continue

      const hasCalendarMatch = calendarEvents.some(ce => matchesEvent(ce.title, doc.name || ''))

      if (!hasCalendarMatch) {
        if (doc.calendarSynced === true) {
          toUnpublish.push({ id: doc.id, name: doc.name })
        } else {
          // Don't auto-remove manually entered events — just flag for admin review
          toFlag.push({ id: doc.id, name: doc.name })
        }
      } else if (doc.noCalendarMatch) {
        // Previously flagged but now matched — clear the flag
        await db.collection('events').doc(doc.id).update({ noCalendarMatch: false, updatedAt: now })
      }
    }

    const crossCheckResults = await Promise.allSettled([
      ...toUnpublish.map(({ id }) =>
        db.collection('events').doc(id).update({
          published: false,
          cancelledAt: now,
          cancellationNote: 'Auto-unpublished: no upcoming occurrence found in Google Calendar',
          updatedAt: now,
        })
      ),
      ...toFlag.map(({ id }) =>
        db.collection('events').doc(id).update({
          noCalendarMatch: true,
          updatedAt: now,
        })
      ),
    ])

    const unpublished = crossCheckResults.slice(0, toUnpublish.length).filter(r => r.status === 'fulfilled').length
    const flagged = crossCheckResults.slice(toUnpublish.length).filter(r => r.status === 'fulfilled').length
    const failed =
      importResults.filter(r => r.status === 'rejected').length +
      updateResults.filter(r => r.status === 'rejected').length +
      crossCheckResults.filter(r => r.status === 'rejected').length

    console.log(`[cron/sync-calendar] imported=${created.length} images=${updatedImages} unpublished=${unpublished} flagged=${flagged} failed=${failed}`)

    return NextResponse.json({
      imported: created.length,
      updatedImages,
      unpublished,
      flagged,
      failed,
      unpublishedEvents: toUnpublish.map(e => e.name),
      flaggedEvents: toFlag.map(e => e.name),
      newEvents: created,
      message: [
        `Imported ${created.length} new event${created.length !== 1 ? 's' : ''}`,
        `updated image for ${updatedImages}`,
        `unpublished ${unpublished} cancelled event${unpublished !== 1 ? 's' : ''}`,
        `flagged ${flagged} for review`,
        failed ? `${failed} failed` : '',
      ].filter(Boolean).join(', '),
    })
  } catch (error) {
    console.error('[cron/sync-calendar] Error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
