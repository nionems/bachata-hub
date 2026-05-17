import { NextResponse } from 'next/server'
import { getSpotifyToken } from '@/lib/spotify'

export async function GET() {
  const results: Record<string, any> = {}

  // Step 1: Auth
  let token: string
  try {
    token = await getSpotifyToken()
    results.auth = 'ok'
  } catch (e) {
    return NextResponse.json({ auth: String(e) })
  }

  // Step 2: Artist top tracks (most reliable endpoint)
  try {
    const res = await fetch(
      'https://api.spotify.com/v1/artists/7KpJV35QbeZ1ZCn34bnypL/top-tracks?market=AU',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const text = await res.text()
    let data: any
    try { data = JSON.parse(text) } catch { data = text }
    results.artistTracks = { status: res.status, response: data }
  } catch (e) {
    results.artistTracks = String(e)
  }

  // Step 3: Playlist tracks
  try {
    const res = await fetch(
      'https://api.spotify.com/v1/playlists/37i9dQZF1DX9pIn6tM2ADM/tracks?limit=3',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const text = await res.text()
    let data: any
    try { data = JSON.parse(text) } catch { data = text }
    results.playlistTracks = { status: res.status, response: typeof data === 'object' ? { count: data.items?.length, first: data.items?.[0]?.track?.name, error: data.error } : data }
  } catch (e) {
    results.playlistTracks = String(e)
  }

  // Step 4: Search
  try {
    const res = await fetch(
      'https://api.spotify.com/v1/search?q=bachata&type=track&limit=3',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const text = await res.text()
    let data: any
    try { data = JSON.parse(text) } catch { data = text }
    results.search = { status: res.status, response: typeof data === 'object' ? { count: data.tracks?.items?.length, first: data.tracks?.items?.[0]?.name, error: data.error } : data }
  } catch (e) {
    results.search = String(e)
  }

  return NextResponse.json(results)
}
