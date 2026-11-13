import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import * as cheerio from 'cheerio'
import { getDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const COUNTRY_ISO: Record<string, string> = {
  AT: 'Austria', AU: 'Australia', BE: 'Belgium', BO: 'Bolivia', BR: 'Brazil',
  CA: 'Canada', CH: 'Switzerland', CL: 'Chile', CN: 'China', CO: 'Colombia',
  CU: 'Cuba', CZ: 'Czech Republic', DE: 'Germany', DK: 'Denmark', DO: 'Dominican Republic',
  EC: 'Ecuador', ES: 'Spain', FI: 'Finland', FR: 'France', GB: 'UK', GR: 'Greece',
  HR: 'Croatia', HU: 'Hungary', ID: 'Indonesia', IE: 'Ireland', IL: 'Israel',
  IT: 'Italy', JP: 'Japan', KR: 'South Korea', LT: 'Lithuania', LV: 'Latvia',
  MX: 'Mexico', MY: 'Malaysia', NL: 'Netherlands', NO: 'Norway', NZ: 'New Zealand',
  PE: 'Peru', PH: 'Philippines', PL: 'Poland', PT: 'Portugal', PR: 'Puerto Rico',
  RO: 'Romania', RS: 'Serbia', RU: 'Russia', SE: 'Sweden', SG: 'Singapore',
  SI: 'Slovenia', SK: 'Slovakia', TH: 'Thailand', TR: 'Turkey', TW: 'Taiwan',
  UA: 'Ukraine', US: 'USA', UY: 'Uruguay', VE: 'Venezuela', ZA: 'South Africa',
}

async function fetchFestivalDetail(url: string): Promise<any | null> {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BachataHub/1.0)' },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return null
    const html = await res.text()
    const $ = cheerio.load(html)

    // Parse JSON-LD schema
    for (const el of $('script[type="application/ld+json"]').toArray()) {
      try {
        const json = JSON.parse($(el).html() || '')
        const events = [json].flat().filter((s: any) => s?.['@type'] === 'Event' || s?.['@type'] === 'MusicEvent')
        if (events.length > 0) {
          const ev = events[0]
          const loc = ev.location || {}
          const addr = loc.address || {}
          const countryCode = addr.addressCountry || ''
          const country = COUNTRY_ISO[countryCode] || countryCode

          // Pick best image
          const images: string[] = Array.isArray(ev.image) ? ev.image : ev.image ? [ev.image] : []
          const ogImage = $('meta[property="og:image"]').attr('content') || ''
          if (ogImage && !images.includes(ogImage)) images.unshift(ogImage)
          const imageUrl = images.find(i => !i.includes('opengraph-image')) || images[0] || ''

          // Ticket link
          const ticketLink = $('a[href*="ticket"], a[href*="register"], a[href*="eventbrite"], a[href*="ti.to"]').first().attr('href') || ''

          return {
            name: ev.name || '',
            description: ev.description || '',
            startDate: (ev.startDate || '').slice(0, 10),
            endDate: (ev.endDate || '').slice(0, 10),
            location: [addr.addressLocality, addr.addressRegion].filter(Boolean).join(', ') || loc.name || '',
            country,
            imageUrl,
            eventLink: url,
            ticketLink,
            danceStyles: ['Bachata'],
          }
        }
      } catch {}
    }
  } catch {}
  return null
}

function sleep(ms: number) { return new Promise(r => setTimeout(r, ms)) }

export async function POST(request: Request) {
  const adminSession = cookies().get('admin_session')
  const isDev = process.env.NODE_ENV !== 'production'
  if (!isDev && adminSession?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let urls: string[]
  try {
    const body = await request.json()
    urls = body.urls
    if (!Array.isArray(urls) || urls.length === 0) throw new Error()
  } catch {
    return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
  }

  const db = getDb()
  const now = new Date().toISOString()
  const imported: string[] = []
  const skipped: string[] = []
  const errors: string[] = []

  // Check for existing eventLinks to avoid duplicates
  const existing = await db.collection('festivals').where('eventLink', 'in', urls.slice(0, 10)).get()
  const existingLinks = new Set(existing.docs.map(d => d.data().eventLink))

  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]

    if (existingLinks.has(url)) { skipped.push(url); continue }

    const data = await fetchFestivalDetail(url)
    if (!data) { errors.push(url); continue }

    try {
      await db.collection('festivals').add({
        ...data,
        state: 'N/A',
        featured: 'no',
        ambassadorCode: '',
        googleMapLink: '',
        published: true,
        source: 'bachataworld',
        createdAt: now,
        updatedAt: now,
      })
      imported.push(data.name)
    } catch {
      errors.push(url)
    }

    if (i < urls.length - 1) await sleep(300) // small throttle
  }

  return NextResponse.json({
    imported: imported.length,
    skipped: skipped.length,
    errors: errors.length,
    importedNames: imported,
    message: `Imported ${imported.length}, skipped ${skipped.length} duplicates, ${errors.length} errors`,
  })
}
