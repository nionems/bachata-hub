import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/firebase-admin'

export const maxDuration = 60

function detectState(location: string): string {
  const loc = (location || '').toLowerCase()
  if (/sydney|nsw|new south wales|bondi|manly|parramatta|newtown|surry hills/.test(loc)) return 'NSW'
  if (/melbourne|vic\b|victoria|richmond|fitzroy|st kilda/.test(loc)) return 'VIC'
  if (/brisbane|qld|queensland/.test(loc)) return 'QLD'
  if (/gold coast/.test(loc)) return 'QLD'
  if (/perth|\bwa\b|western australia|fremantle/.test(loc)) return 'WA'
  if (/adelaide|\bsa\b|south australia/.test(loc)) return 'SA'
  if (/hobart|\btas\b|tasmania/.test(loc)) return 'TAS'
  if (/canberra|\bact\b|australian capital/.test(loc)) return 'ACT'
  if (/darwin|\bnt\b|northern territory/.test(loc)) return 'NT'
  return 'NSW'
}

interface ScrapedEvent {
  title: string
  description: string
  location: string
  startDateTime: string
  endDateTime: string
  url: string
  imageUrl?: string
  source: 'eventbrite' | 'trybooking' | 'humanitix'
}

async function scrapeEventbrite(): Promise<ScrapedEvent[]> {
  const apiKey = process.env.EVENTBRITE_API_KEY
  if (!apiKey) {
    console.log('[scrape-events] No EVENTBRITE_API_KEY — skipping Eventbrite')
    return []
  }

  const events: ScrapedEvent[] = []
  const cities = ['Sydney', 'Melbourne', 'Brisbane', 'Perth', 'Adelaide', 'Canberra']

  for (const city of cities) {
    try {
      const url = new URL('https://www.eventbriteapi.com/v3/events/search/')
      url.searchParams.set('q', 'bachata')
      url.searchParams.set('location.address', `${city}, Australia`)
      url.searchParams.set('location.within', '50km')
      url.searchParams.set('start_date.range_start', new Date().toISOString())
      url.searchParams.set('sort_by', 'date')
      url.searchParams.set('expand', 'venue')

      const res = await fetch(url.toString(), {
        headers: { Authorization: `Bearer ${apiKey}` },
      })
      if (!res.ok) continue

      const data = await res.json()
      for (const ev of data.events ?? []) {
        if (!ev.name?.text || !ev.start?.local) continue
        const title = ev.name.text
        const desc = (ev.description?.text || '').toLowerCase()
        if (!title.toLowerCase().includes('bachata') && !desc.includes('bachata')) continue

        const location = [
          ev.venue?.address?.address_1,
          ev.venue?.address?.city,
          ev.venue?.address?.region,
          'Australia',
        ].filter(Boolean).join(', ')

        events.push({
          title,
          description: ev.description?.text || '',
          location,
          startDateTime: ev.start.local,
          endDateTime: ev.end?.local || ev.start.local,
          url: ev.url,
          imageUrl: ev.logo?.original?.url || ev.logo?.url,
          source: 'eventbrite',
        })
      }
    } catch (e) {
      console.error(`[scrape-events] Eventbrite error for ${city}:`, e)
    }
  }

  const seen = new Set<string>()
  return events.filter(e => {
    const key = `${e.title.toLowerCase()}|${e.startDateTime.slice(0, 10)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function scrapeHumanitix(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = []
  const apiKey = process.env.HUMANITIX_API_KEY

  if (apiKey) {
    try {
      const res = await fetch(
        'https://api.humanitix.com/v1/events/public?keywords=bachata&country=AU&upcoming=true&pageSize=50',
        { headers: { 'x-api-key': apiKey, Accept: 'application/json' } }
      )
      if (res.ok) {
        const data = await res.json()
        for (const ev of data.events ?? data.data ?? []) {
          const title = ev.name || ev.title
          const startDate = ev.startDate || ev.startDateTime || ev.dates?.[0]?.startDate
          if (!title || !startDate) continue
          const venue = ev.venue || ev.location || {}
          const loc = [venue.name, venue.suburb || venue.city, venue.state, 'Australia'].filter(Boolean).join(', ')
          events.push({
            title,
            description: ev.description || ev.summary || '',
            location: loc,
            startDateTime: startDate,
            endDateTime: ev.endDate || ev.endDateTime || ev.dates?.[0]?.endDate || startDate,
            url: ev.url || `https://events.humanitix.com/${ev.slug || ev.id}`,
            imageUrl: ev.bannerImage || ev.image?.url || ev.imageUrl,
            source: 'humanitix',
          })
        }
        const seen = new Set<string>()
        return events.filter(e => {
          const key = `${e.title.toLowerCase()}|${String(e.startDateTime).slice(0, 10)}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
      }
    } catch (e) {
      console.error('[scrape-events] Humanitix API error:', e)
    }
  }

  // Fallback: JSON-LD from public search
  try {
    const res = await fetch('https://events.humanitix.com/search?q=bachata&country=AU', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BachataHubBot/1.0)' },
    })
    const html = await res.text()
    for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
      try {
        const schema = JSON.parse(m[1])
        const items: any[] = schema['@type'] === 'ItemList'
          ? (schema.itemListElement ?? []).map((i: any) => i.item ?? i)
          : [schema]
        for (const item of items) {
          if (!['Event', 'SocialEvent', 'DanceEvent', 'MusicEvent'].includes(item['@type'])) continue
          if (!item.name || !item.startDate) continue
          const loc = item.location?.name || item.location?.address?.addressLocality || ''
          events.push({
            title: item.name,
            description: item.description || '',
            location: loc ? `${loc}, Australia` : 'Australia',
            startDateTime: item.startDate,
            endDateTime: item.endDate || item.startDate,
            url: item.url || '',
            imageUrl: Array.isArray(item.image) ? item.image[0] : item.image,
            source: 'humanitix',
          })
        }
      } catch {}
    }
  } catch (e) {
    console.error('[scrape-events] Humanitix fallback error:', e)
  }

  const seen = new Set<string>()
  return events.filter(e => {
    const key = `${e.title.toLowerCase()}|${String(e.startDateTime).slice(0, 10)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function scrapeTryBooking(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = []

  for (const term of ['bachata', 'bachata dance']) {
    try {
      const res = await fetch(
        `https://www.trybooking.com/api/event-search?term=${encodeURIComponent(term)}&country=AU&pageSize=50`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (compatible; BachataHubBot/1.0)',
          },
        }
      )
      if (res.ok) {
        const data = await res.json()
        const list: any[] = data.events ?? data.results ?? data.data ?? []
        for (const ev of list) {
          const title = ev.name || ev.title || ev.eventName
          const startDate = ev.startDate || ev.dateFrom || ev.start_date || ev.startDateTime
          if (!title || !startDate) continue
          const loc = [ev.venueName || ev.venue, ev.suburb || ev.city, ev.state, 'Australia'].filter(Boolean).join(', ')
          events.push({
            title,
            description: ev.description || ev.summary || '',
            location: loc,
            startDateTime: startDate,
            endDateTime: ev.endDate || ev.dateTo || ev.end_date || startDate,
            url: ev.bookingUrl || ev.url || `https://www.trybooking.com/events/${ev.eventId || ev.id}`,
            imageUrl: ev.imageUrl || ev.image,
            source: 'trybooking',
          })
        }
        break
      }
    } catch {}
  }

  // Fallback: JSON-LD from public search HTML
  if (events.length === 0) {
    try {
      const res = await fetch('https://www.trybooking.com/search?term=bachata+dance&country=AU', {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BachataHubBot/1.0)' },
      })
      const html = await res.text()
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
          const schema = JSON.parse(m[1])
          const items: any[] = schema['@type'] === 'ItemList'
            ? (schema.itemListElement ?? []).map((i: any) => i.item ?? i)
            : [schema]
          for (const item of items) {
            if (!['Event', 'SocialEvent', 'DanceEvent'].includes(item['@type'])) continue
            if (!item.name || !item.startDate) continue
            const loc = item.location?.name || item.location?.address?.addressLocality || ''
            events.push({
              title: item.name,
              description: item.description || '',
              location: loc ? `${loc}, Australia` : 'Australia',
              startDateTime: item.startDate,
              endDateTime: item.endDate || item.startDate,
              url: item.url || '',
              imageUrl: Array.isArray(item.image) ? item.image[0] : item.image,
              source: 'trybooking',
            })
          }
        } catch {}
      }
    } catch {}
  }

  const seen = new Set<string>()
  return events.filter(e => {
    const key = `${e.title.toLowerCase()}|${String(e.startDateTime).slice(0, 10)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const adminSession = cookies().get('admin_session')
  const isAuthed =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    adminSession?.value === 'true'

  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  const now = new Date()

  // Load existing names from both collections for deduplication
  const [eventsSnap, festivalsSnap] = await Promise.all([
    db.collection('events').get(),
    db.collection('festivals').get(),
  ])
  const existingNames = new Set<string>([
    ...eventsSnap.docs.map(d => ((d.data().name as string) || '').toLowerCase().trim()),
    ...festivalsSnap.docs.map(d => ((d.data().name as string) || '').toLowerCase().trim()),
  ])

  // Scrape all sources in parallel
  const [eventbriteEvents, trybookingEvents, humanitixEvents] = await Promise.all([
    scrapeEventbrite(),
    scrapeTryBooking(),
    scrapeHumanitix(),
  ])
  const allEvents = [...eventbriteEvents, ...trybookingEvents, ...humanitixEvents]

  const added: string[] = []
  const addedFestivals: string[] = []
  const skipped: string[] = []
  const failed: string[] = []
  const nowIso = now.toISOString()

  for (const event of allEvents) {
    const normalizedTitle = event.title.toLowerCase().trim()

    // Skip past events
    const startDate = new Date(event.startDateTime)
    if (isNaN(startDate.getTime()) || startDate < now) {
      skipped.push(event.title)
      continue
    }

    // Fuzzy dedup against both collections
    const isDuplicate =
      existingNames.has(normalizedTitle) ||
      [...existingNames].some(existing => {
        const a = existing.slice(0, 25)
        const b = normalizedTitle.slice(0, 25)
        return a.length >= 10 && b.length >= 10 && (a === b || existing.includes(b) || normalizedTitle.includes(a))
      })

    if (isDuplicate) {
      skipped.push(event.title)
      continue
    }

    try {
      const endDate = new Date(event.endDateTime)
      const endDateTime = isNaN(endDate.getTime()) || endDate <= startDate
        ? new Date(startDate.getTime() + 2 * 60 * 60 * 1000)
        : endDate

      const startDateStr = startDate.toISOString().slice(0, 10)
      const endDateStr = endDateTime.toISOString().slice(0, 10)
      const startTime = startDate.toISOString().slice(11, 16)
      const endTime = endDateTime.toISOString().slice(11, 16)
      const state = detectState(event.location)

      // Multi-day event (spans 2+ calendar days) → festivals collection
      const isMultiDay = endDateStr > startDateStr

      const description = [
        event.description,
        event.url ? `Event page: ${event.url}` : '',
      ].filter(Boolean).join('\n\n')

      if (isMultiDay) {
        await db.collection('festivals').add({
          name: event.title,
          startDate: startDateStr,
          endDate: endDateStr,
          location: event.location,
          state,
          country: 'Australia',
          description,
          imageUrl: event.imageUrl || '',
          eventLink: event.url || '',
          ticketLink: event.url || '',
          danceStyles: ['Bachata'],
          price: '',
          published: true,
          status: 'approved',
          autoScraped: true,
          scrapeSource: event.source,
          featured: 'no',
          createdAt: nowIso,
          updatedAt: nowIso,
        })
        addedFestivals.push(event.title)
      } else {
        await db.collection('events').add({
          name: event.title,
          eventDate: startDateStr,
          startTime,
          endTime,
          location: event.location,
          city: '',
          state,
          description,
          imageUrl: event.imageUrl || '',
          eventLink: event.url || '',
          ticketLink: event.url || '',
          danceStyles: ['Bachata'],
          recurrence: '',
          isWeekly: false,
          isWorkshop: false,
          published: true,
          autoScraped: true,
          scrapeSource: event.source,
          likesCount: 0,
          goingCount: 0,
          createdAt: nowIso,
          updatedAt: nowIso,
        })
        added.push(event.title)
      }

      existingNames.add(normalizedTitle)
    } catch (e) {
      console.error(`[scrape-events] Failed to save "${event.title}":`, e)
      failed.push(event.title)
    }
  }

  console.log(`[cron/scrape-events] events=${added.length} festivals=${addedFestivals.length} skipped=${skipped.length} failed=${failed.length}`)

  return NextResponse.json({
    added: added.length + addedFestivals.length,
    addedEvents: added.length,
    addedFestivals: addedFestivals.length,
    skipped: skipped.length,
    failed: failed.length,
    newEvents: added,
    newFestivals: addedFestivals,
    failedEvents: failed,
    sources: {
      eventbrite: eventbriteEvents.length,
      trybooking: trybookingEvents.length,
      humanitix: humanitixEvents.length,
    },
    message: `Added ${added.length} new event${added.length !== 1 ? 's' : ''} (skipped ${skipped.length} duplicates, ${failed.length} failed)`,
  })
}
