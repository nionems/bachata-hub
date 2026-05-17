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
    const data = await res.json()
    results.artistTracks = {
      status: res.status,
      count: data.tracks?.length ?? 0,
      first: data.tracks?.[0]?.name ?? null,
      error: data.error ?? null,
    }
  } catch (e) {
    results.artistTracks = String(e)
  }

  // Step 3: Playlist tracks
  try {
    const res = await fetch(
      'https://api.spotify.com/v1/playlists/37i9dQZF1DX9pIn6tM2ADM/tracks?limit=5',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    results.playlistTracks = {
      status: res.status,
      count: data.items?.length ?? 0,
      first: data.items?.[0]?.track?.name ?? null,
      error: data.error ?? null,
    }
  } catch (e) {
    results.playlistTracks = String(e)
  }

  // Step 4: Search
  try {
    const res = await fetch(
      'https://api.spotify.com/v1/search?q=bachata&type=track&limit=3',
      { headers: { Authorization: `Bearer ${token}` } }
    )
    const data = await res.json()
    results.search = {
      status: res.status,
      count: data.tracks?.items?.length ?? 0,
      first: data.tracks?.items?.[0]?.name ?? null,
      error: data.error ?? null,
    }
  } catch (e) {
    results.search = String(e)
  }

  return NextResponse.json(results)
}
