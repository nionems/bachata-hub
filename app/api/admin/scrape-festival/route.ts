import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

function meta($: cheerio.CheerioAPI, name: string): string {
  return (
    $(`meta[property="${name}"]`).attr('content') ||
    $(`meta[name="${name}"]`).attr('content') ||
    ''
  ).trim()
}

function extractDates(text: string): { startDate: string; endDate: string } {
  // ISO dates
  const isoMatches = text.match(/\d{4}-\d{2}-\d{2}/g)
  if (isoMatches && isoMatches.length >= 2) return { startDate: isoMatches[0], endDate: isoMatches[1] }
  if (isoMatches && isoMatches.length === 1) return { startDate: isoMatches[0], endDate: isoMatches[0] }

  // "15 March 2025" or "March 15, 2025"
  const months = 'January|February|March|April|May|June|July|August|September|October|November|December'
  const dateRx = new RegExp(`(\\d{1,2})(?:st|nd|rd|th)?\\s+(${months})\\s+(\\d{4})`, 'gi')
  const dateRx2 = new RegExp(`(${months})\\s+(\\d{1,2})(?:st|nd|rd|th)?,?\\s+(\\d{4})`, 'gi')

  const hits: string[] = []
  let m
  while ((m = dateRx.exec(text)) !== null) hits.push(new Date(`${m[2]} ${m[1]}, ${m[3]}`).toISOString().slice(0, 10))
  if (hits.length === 0) {
    while ((m = dateRx2.exec(text)) !== null) hits.push(new Date(`${m[1]} ${m[2]}, ${m[3]}`).toISOString().slice(0, 10))
  }
  if (hits.length >= 2) return { startDate: hits[0], endDate: hits[1] }
  if (hits.length === 1) return { startDate: hits[0], endDate: hits[0] }
  return { startDate: '', endDate: '' }
}

function guessCountry(text: string): string {
  const lower = text.toLowerCase()
  const map: Record<string, string> = {
    'united states': 'USA', 'usa': 'USA', ' us ': 'USA',
    'united kingdom': 'UK', 'england': 'UK', ' uk ': 'UK',
    'france': 'France', 'paris': 'France',
    'spain': 'Spain', 'madrid': 'Spain', 'barcelona': 'Spain',
    'germany': 'Germany', 'berlin': 'Germany',
    'italy': 'Italy', 'rome': 'Italy',
    'netherlands': 'Netherlands', 'amsterdam': 'Netherlands',
    'portugal': 'Portugal', 'lisbon': 'Portugal',
    'brazil': 'Brazil', 'são paulo': 'Brazil', 'rio': 'Brazil',
    'colombia': 'Colombia', 'bogota': 'Colombia',
    'mexico': 'Mexico', 'cancun': 'Mexico',
    'canada': 'Canada', 'toronto': 'Canada',
    'japan': 'Japan', 'tokyo': 'Japan',
    'singapore': 'Singapore',
    'thailand': 'Thailand', 'bangkok': 'Thailand',
    'dominican republic': 'Dominican Republic', 'santo domingo': 'Dominican Republic',
    'puerto rico': 'Puerto Rico',
    'cuba': 'Cuba', 'havana': 'Cuba',
    'greece': 'Greece', 'athens': 'Greece',
    'turkey': 'Turkey', 'istanbul': 'Turkey',
    'uae': 'UAE', 'dubai': 'UAE', 'abu dhabi': 'UAE',
    'south africa': 'South Africa', 'cape town': 'South Africa',
    'australia': 'Australia', 'sydney': 'Australia', 'melbourne': 'Australia',
  }
  for (const [key, country] of Object.entries(map)) {
    if (lower.includes(key)) return country
  }
  return ''
}

function bestImage(images: string[], baseUrl: string): string {
  // Prefer images that look like posters/events (larger, not icons/logos)
  const skip = /favicon|logo|icon|sprite|pixel|1x1|avatar/i
  const good = images.filter(src => !skip.test(src) && src.length > 10)
  if (good.length === 0) return ''
  // Prefer og:image (already first), or first large-looking URL
  return good[0]
}

export async function POST(request: Request) {
  const adminSession = cookies().get('admin_session')
  const isDev = process.env.NODE_ENV !== 'production'
  if (!isDev && adminSession?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let url: string
  try {
    const body = await request.json()
    url = body.url?.trim()
    if (!url) throw new Error('missing url')
    if (!url.startsWith('http')) url = 'https://' + url
    new URL(url) // validate
  } catch {
    return NextResponse.json({ error: 'Invalid URL' }, { status: 400 })
  }

  let html: string
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; BachataHub/1.0)',
        'Accept': 'text/html,application/xhtml+xml',
      },
      signal: AbortSignal.timeout(10_000),
    })
    if (!res.ok) return NextResponse.json({ error: `Fetch failed: ${res.status}` }, { status: 400 })
    html = await res.text()
  } catch (e: any) {
    return NextResponse.json({ error: `Could not fetch URL: ${e.message}` }, { status: 400 })
  }

  const $ = cheerio.load(html)
  const baseUrl = new URL(url).origin

  // ── Extract fields ──────────────────────────────────────────────────────────
  const name =
    meta($, 'og:title') ||
    meta($, 'twitter:title') ||
    $('h1').first().text().trim() ||
    $('title').text().split('|')[0].trim()

  const description =
    meta($, 'og:description') ||
    meta($, 'description') ||
    meta($, 'twitter:description') ||
    $('meta[name="description"]').attr('content') || ''

  // Images: og:image first, then all src attrs
  const ogImage = meta($, 'og:image') || meta($, 'twitter:image')
  const allImages: string[] = []
  if (ogImage) allImages.push(ogImage.startsWith('http') ? ogImage : baseUrl + ogImage)
  $('img[src]').each((_, el) => {
    const src = $(el).attr('src') || ''
    if (src) allImages.push(src.startsWith('http') ? src : baseUrl + src)
  })
  const imageUrl = bestImage(allImages, baseUrl)

  // Dates: schema.org Event, then meta, then body text scan
  let startDate = ''
  let endDate = ''
  const schemaScript = $('script[type="application/ld+json"]').map((_, el) => $(el).html()).get().join('\n')
  if (schemaScript) {
    try {
      const schemas = JSON.parse(schemaScript.includes('[') ? schemaScript : `[${schemaScript}]`)
      const events = [schemas].flat().filter((s: any) => s?.['@type'] === 'Event' || s?.['@type'] === 'MusicEvent')
      if (events.length > 0) {
        const ev = events[0]
        startDate = (ev.startDate || '').slice(0, 10)
        endDate = (ev.endDate || '').slice(0, 10)
      }
    } catch {}
  }
  if (!startDate) {
    const bodyText = $('body').text()
    const extracted = extractDates(bodyText)
    startDate = extracted.startDate
    endDate = extracted.endDate
  }

  // Location
  let location = ''
  let country = ''
  const ogLocale = meta($, 'og:locale')
  const ldLocation = (() => {
    try {
      const schemas = JSON.parse(schemaScript.includes('[') ? schemaScript : `[${schemaScript}]`)
      const ev = [schemas].flat().find((s: any) => s?.['@type'] === 'Event' || s?.['@type'] === 'MusicEvent')
      if (ev?.location) {
        const loc = ev.location
        const addr = loc.address || {}
        return [addr.addressLocality, addr.addressRegion, addr.addressCountry, loc.name].filter(Boolean).join(', ')
      }
    } catch {}
    return ''
  })()
  if (ldLocation) {
    location = ldLocation
    country = guessCountry(ldLocation)
  } else {
    const bodyText = $('body').text().slice(0, 5000)
    country = guessCountry(name + ' ' + description + ' ' + bodyText)
    location = ''
  }

  // Ticket / event link
  const ticketLink =
    $('a[href*="ticket"], a[href*="register"], a[href*="eventbrite"], a[href*="ti.to"]').first().attr('href') || ''

  return NextResponse.json({
    name: name.replace(/&#\d+;/g, '').trim(),
    description: description.trim(),
    imageUrl,
    startDate,
    endDate,
    location,
    country: country || '',
    eventLink: url,
    ticketLink: ticketLink.startsWith('http') ? ticketLink : ticketLink ? baseUrl + ticketLink : '',
    danceStyles: ['Bachata'],
  })
}
