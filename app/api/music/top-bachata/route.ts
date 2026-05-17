import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { fetchTopBachataVideos } from '@/lib/youtube'
import { cookies } from 'next/headers'

const CACHE_DOC = 'topBachata'
const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000 // 7 days
const CACHE_VERSION = 8 // bump to force refresh when query logic changes

export async function GET() {
  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ tracks: [], updatedAt: null, error: 'YouTube API not configured' })
  }

  try {
    const db = getDb()
    const ref = db.collection('musicCache').doc(CACHE_DOC)
    const snap = await ref.get()

    if (snap.exists) {
      const { tracks, updatedAt, version } = snap.data()!
      if (tracks?.length > 0 && version === CACHE_VERSION && Date.now() - updatedAt < CACHE_TTL_MS) {
        return NextResponse.json({ tracks, updatedAt })
      }
    }

    const tracks = await fetchTopBachataVideos(process.env.YOUTUBE_API_KEY)
    const updatedAt = Date.now()

    if (tracks.length > 0) {
      await ref.set({ tracks, updatedAt, version: CACHE_VERSION })
    }
    return NextResponse.json({ tracks, updatedAt })
  } catch (error) {
    // Fall back to stale cache if Spotify/YouTube fails
    try {
      const db = getDb()
      const snap = await db.collection('musicCache').doc(CACHE_DOC).get()
      if (snap.exists) {
        const { tracks, updatedAt } = snap.data()!
        if (tracks?.length > 0) {
          return NextResponse.json({ tracks, updatedAt, stale: true })
        }
      }
    } catch { }

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

  if (!process.env.YOUTUBE_API_KEY) {
    return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 })
  }

  try {
    const tracks = await fetchTopBachataVideos(process.env.YOUTUBE_API_KEY)
    const updatedAt = Date.now()

    const db = getDb()
    await db.collection('musicCache').doc(CACHE_DOC).set({ tracks, updatedAt })
    return NextResponse.json({ tracks, updatedAt })
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}
