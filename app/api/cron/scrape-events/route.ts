import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import { cookies } from 'next/headers'

export const maxDuration = 60

const CITY_CALENDAR_MAP: Record<string, string> = {
  NSW: '4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com',
  VIC: '641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com',
  QLD: 'f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com',
  WA:  'e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com',
  SA:  '6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com',
  ACT: '3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com',
  NT:  '27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com',
  TAS: '2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com',
}

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
  source: 'eventbrite' | 'trybooking'
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

      if (!res.ok) {
        console.error(`[scrape-events] Eventbrite ${city}: ${res.status}`)
        continue
      }

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

  // Deduplicate by title+date
  const seen = new Set<string>()
  return events.filter(e => {
    const key = `${e.title.toLowerCase()}|${e.startDateTime.slice(0, 10)}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

async function scrapeTryBooking(): Promise<ScrapedEvent[]> {
  const events: ScrapedEvent[] = []

  // TryBooking public search API (returns JSON)
  const searches = ['bachata', 'bachata dance', 'latin bachata']

  for (const term of searches) {
    try {
      const res = await fetch(
        `https://www.trybooking.com/api/event-search?term=${encodeURIComponent(term)}&country=AU&pageSize=50`,
        {
          headers: {
            Accept: 'application/json, text/plain, */*',
            'User-Agent': 'Mozilla/5.0 (compatible; BachataHubBot/1.0)',
          },
          next: { revalidate: 0 },
        }
      )

      if (res.ok) {
        const data = await res.json()
        const list: any[] = data.events ?? data.results ?? data.data ?? data ?? []

        for (const ev of list) {
          const title = ev.name || ev.title || ev.eventName
          const startDate = ev.startDate || ev.dateFrom || ev.start_date || ev.startDateTime
          if (!title || !startDate) continue

          const loc = [ev.venueName || ev.venue, ev.suburb || ev.city, ev.state, 'Australia']
            .filter(Boolean).join(', ')

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
        break // first working term is enough
      }
    } catch {}
  }

  // Fallback: scrape JSON-LD from TryBooking's public search HTML
  if (events.length === 0) {
    try {
      const res = await fetch('https://www.trybooking.com/search?term=bachata+dance&country=AU', {
        headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BachataHubBot/1.0)' },
      })
      const html = await res.text()

      // Extract JSON-LD Event schemas
      for (const m of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) {
        try {
          const schema = JSON.parse(m[1])
          const items: any[] = schema['@type'] === 'ItemList' ? schema.itemListElement?.map((i: any) => i.item) ?? [] : [schema]
          for (const item of items) {
            if (!['Event', 'SocialEvent', 'DanceEvent'].includes(item['@type'])) continue
            if (!item.name || !item.startDate) continue
            const loc = item.location?.name || item.location?.address?.streetAddress || ''
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
    } catch (e) {
      console.error('[scrape-events] TryBooking HTML fallback error:', e)
    }
  }

  // Deduplicate
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

  if (!process.env.GOOGLE_CLIENT_EMAIL || !process.env.GOOGLE_PRIVATE_KEY) {
    return NextResponse.json({ error: 'Google Calendar credentials not configured' }, { status: 500 })
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })
  const calendar = google.calendar({ version: 'v3', auth })

  // Collect existing event titles for deduplication
  const existingTitles = new Set<string>()
  await Promise.allSettled(
    Object.values(CITY_CALENDAR_MAP).map(async (calendarId) => {
      const res = await calendar.events.list({
        calendarId,
        timeMin: new Date().toISOString(),
        maxResults: 250,
        singleEvents: true,
        orderBy: 'startTime',
      })
      for (const ev of res.data.items ?? []) {
        if (ev.summary) existingTitles.add(ev.summary.toLowerCase().trim())
      }
    })
  )

  // Scrape both sources in parallel
  const [eventbriteEvents, trybookingEvents] = await Promise.all([
    scrapeEventbrite(),
    scrapeTryBooking(),
  ])
  const allEvents = [...eventbriteEvents, ...trybookingEvents]

  const added: string[] = []
  const skipped: string[] = []
  const failed: string[] = []
  const now = new Date()

  for (const event of allEvents) {
    const normalizedTitle = event.title.toLowerCase().trim()

    // Skip past events
    const startDate = new Date(event.startDateTime)
    if (isNaN(startDate.getTime()) || startDate < now) {
      skipped.push(event.title)
      continue
    }

    // Fuzzy dedup: skip if title already exists (or close match)
    const isDuplicate =
      existingTitles.has(normalizedTitle) ||
      [...existingTitles].some(existing => {
        const a = existing.slice(0, 25)
        const b = normalizedTitle.slice(0, 25)
        return a.length >= 10 && b.length >= 10 && (a === b || existing.includes(b) || normalizedTitle.includes(a))
      })

    if (isDuplicate) {
      skipped.push(event.title)
      continue
    }

    const state = detectState(event.location)
    const calendarId = CITY_CALENDAR_MAP[state]

    try {
      const endDate = new Date(event.endDateTime)
      const endDateTime = isNaN(endDate.getTime()) || endDate <= startDate
        ? new Date(startDate.getTime() + 2 * 60 * 60 * 1000) // default 2h
        : endDate

      const description = [
        event.description,
        event.url ? `\nEvent page: ${event.url}` : '',
        event.imageUrl ? `\n[image:${event.imageUrl}]` : '',
        `\nSource: ${event.source}`,
      ].filter(Boolean).join('')

      await calendar.events.insert({
        calendarId,
        requestBody: {
          summary: event.title,
          description,
          start: { dateTime: startDate.toISOString(), timeZone: 'Australia/Sydney' },
          end: { dateTime: endDateTime.toISOString(), timeZone: 'Australia/Sydney' },
          location: event.location,
        },
      })

      added.push(event.title)
      existingTitles.add(normalizedTitle)
    } catch (e) {
      console.error(`[scrape-events] Failed to add "${event.title}":`, e)
      failed.push(event.title)
    }
  }

  console.log(`[cron/scrape-events] added=${added.length} skipped=${skipped.length} failed=${failed.length}`)

  return NextResponse.json({
    added: added.length,
    skipped: skipped.length,
    failed: failed.length,
    addedEvents: added,
    failedEvents: failed,
    sources: {
      eventbrite: eventbriteEvents.length,
      trybooking: trybookingEvents.length,
    },
    message: `Added ${added.length} new event${added.length !== 1 ? 's' : ''} (skipped ${skipped.length} duplicates, ${failed.length} failed)`,
  })
}
