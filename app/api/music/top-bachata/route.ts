import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { getSpotifyToken, fetchTopBachataTrack } from '@/lib/spotify'
import { cookies } from 'next/headers'

const CACHE_DOC = 'topBachata'
const CACHE_TTL_MS = 24 * 60 * 60 * 1000 // 24 hours

// GET /api/music/top-bachata — returns cached top 20, refreshes if stale
export async function GET() {
  if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
    return NextResponse.json({ tracks: [], updatedAt: null, error: 'Spotify not configured' })
  }

  try {
    const db = getDb()
    const ref = db.collection('musicCache').doc(CACHE_DOC)
    const snap = await ref.get()

    if (snap.exists) {
      const { tracks, updatedAt } = snap.data()!
      if (Date.now() - updatedAt < CACHE_TTL_MS) {
        return NextResponse.json({ tracks, updatedAt })
      }
    }

    // Cache stale or missing — fetch fresh from Spotify
    const token = await getSpotifyToken()
    const tracks = await fetchTopBachataTrack(token)
    const updatedAt = Date.now()

    await ref.set({ tracks, updatedAt })
    return NextResponse.json({ tracks, updatedAt })
  } catch (error) {
    console.error('Error fetching top bachata:', error)
    return NextResponse.json({ error: String(error), tracks: [] }, { status: 500 })
  }
}

// POST /api/music/top-bachata — admin-only force refresh
export async function POST() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get('admin_session')
  if (!adminSession || adminSession.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const token = await getSpotifyToken()
    const tracks = await fetchTopBachataTrack(token)
    const updatedAt = Date.now()

    const db = getDb()
    await db.collection('musicCache').doc(CACHE_DOC).set({ tracks, updatedAt })
    return NextResponse.json({ tracks, updatedAt })
  } catch (error) {
    console.error('Error refreshing top bachata:', error)
    return NextResponse.json({ error: 'Failed to refresh' }, { status: 500 })
  }
}
