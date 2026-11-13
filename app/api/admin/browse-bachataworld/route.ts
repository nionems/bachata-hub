import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import * as cheerio from 'cheerio'

export const dynamic = 'force-dynamic'

// Simple in-memory cache so repeated admin page loads don't hammer BachataWorld
let cache: { data: any[]; ts: number } | null = null
const CACHE_TTL = 30 * 60 * 1000 // 30 min

export async function GET() {
  const adminSession = cookies().get('admin_session')
  const isDev = process.env.NODE_ENV !== 'production'
  if (!isDev && adminSession?.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return NextResponse.json(cache.data)
  }

  let html: string
  try {
    const res = await fetch('https://www.bachataworld.com/festivals', {
      headers: { 'User-Agent': 'Mozilla/5.0 (compatible; BachataHub/1.0)' },
      signal: AbortSignal.timeout(15_000),
      next: { revalidate: 0 },
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    html = await res.text()
  } catch (e: any) {
    return NextResponse.json({ error: `Could not fetch BachataWorld: ${e.message}` }, { status: 502 })
  }

  const $ = cheerio.load(html)
  const festivals: any[] = []

  $('a[href*="/events/"]').each((_, el) => {
    const href = $(el).attr('href') || ''
    if (!href || href.includes('#')) return
    const url = href.startsWith('http') ? href : `https://www.bachataworld.com${href}`

    const dateText = $(el).find('.tabular-nums').first().text().trim()
    const name = $(el).find('.font-semibold').first().text().trim()
    const locationRaw = $(el).find('.text-fg-muted').not('.tabular-nums').first().text().trim()

    if (!name) return

    // Parse country and city from "Venue, City, Country"
    const parts = locationRaw.split(',').map((p: string) => p.trim()).filter(Boolean)
    const country = parts[parts.length - 1] || ''
    const city = parts[parts.length - 2] || ''

    // Extract ISO start date from slug (ends with YYYY-MM-DD)
    const dateMatch = url.match(/(\d{4}-\d{2}-\d{2})$/)
    const startDate = dateMatch?.[1] || ''

    festivals.push({ url, dateText, name, city, country, startDate, locationRaw })
  })

  cache = { data: festivals, ts: Date.now() }
  return NextResponse.json(festivals)
}
