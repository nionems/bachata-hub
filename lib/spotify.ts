// Spotify Client Credentials flow — server-side only
let cachedToken: { token: string; expiresAt: number } | null = null

export async function getSpotifyToken(): Promise<string> {
  if (cachedToken && Date.now() < cachedToken.expiresAt) {
    return cachedToken.token
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!
  const credentials = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')

  const res = await fetch('https://accounts.spotify.com/api/token', {
    method: 'POST',
    headers: {
      Authorization: `Basic ${credentials}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: 'grant_type=client_credentials',
  })

  if (!res.ok) throw new Error(`Spotify auth failed: ${res.status}`)

  const data = await res.json()
  cachedToken = {
    token: data.access_token,
    expiresAt: Date.now() + (data.expires_in - 60) * 1000,
  }
  return cachedToken.token
}

export interface SpotifyTrack {
  id: string
  name: string
  artists: string[]
  album: string
  albumArt: string
  popularity: number
  previewUrl: string | null
  spotifyUrl: string
  durationMs: number
}

export async function fetchTopBachataTrack(token: string): Promise<SpotifyTrack[]> {
  const queries = ['genre:bachata', 'bachata romantica', 'bachata sensual', 'bachata moderna']
  const seen = new Set<string>()
  const tracks: SpotifyTrack[] = []

  await Promise.all(
    queries.map(async (q) => {
      const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=track&limit=50&market=AU`
      const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
      if (!res.ok) return
      const data = await res.json()
      for (const item of data.tracks?.items ?? []) {
        if (seen.has(item.id) || !item.popularity) continue
        seen.add(item.id)
        tracks.push({
          id: item.id,
          name: item.name,
          artists: item.artists.map((a: any) => a.name),
          album: item.album.name,
          albumArt: item.album.images?.[0]?.url ?? '',
          popularity: item.popularity,
          previewUrl: item.preview_url ?? null,
          spotifyUrl: item.external_urls?.spotify ?? '',
          durationMs: item.duration_ms,
        })
      }
    })
  )

  return tracks
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
}
