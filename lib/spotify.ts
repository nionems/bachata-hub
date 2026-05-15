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

// Spotify's official editorial Bachata playlists (stable IDs maintained by Spotify)
// These are curated by Spotify's editorial team and reflect what's actually popular
const SPOTIFY_BACHATA_PLAYLISTS = [
  '37i9dQZF1DX9pIn6tM2ADM', // Bachata Hits (Spotify Editorial)
  '37i9dQZF1DZ06evO4ZbNyO', // This Is Bachata (Spotify Editorial)
  '37i9dQZF1DWY3MFYA5XfEd', // Bachata Romántica
]

async function fetchPlaylistTracks(token: string, playlistId: string): Promise<SpotifyTrack[]> {
  const tracks: SpotifyTrack[] = []
  let url: string | null =
    `https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=50&fields=next,items(track(id,name,artists,album,popularity,preview_url,external_urls,duration_ms))`

  while (url) {
    const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
    if (!res.ok) break
    const data = await res.json()

    for (const item of data.items ?? []) {
      const t = item?.track
      if (!t || !t.id) continue
      tracks.push({
        id: t.id,
        name: t.name,
        artists: t.artists.map((a: any) => a.name),
        album: t.album.name,
        albumArt: t.album.images?.[0]?.url ?? '',
        popularity: t.popularity ?? 0,
        previewUrl: t.preview_url ?? null,
        spotifyUrl: t.external_urls?.spotify ?? '',
        durationMs: t.duration_ms,
      })
    }

    url = data.next ?? null
  }

  return tracks
}

export async function fetchTopBachataTrack(token: string): Promise<SpotifyTrack[]> {
  const seen = new Set<string>()
  const all: SpotifyTrack[] = []

  // Fetch all tracks from Spotify's official bachata playlists
  await Promise.all(
    SPOTIFY_BACHATA_PLAYLISTS.map(async (id) => {
      try {
        const tracks = await fetchPlaylistTracks(token, id)
        for (const t of tracks) {
          if (seen.has(t.id)) continue
          seen.add(t.id)
          all.push(t)
        }
      } catch {
        // skip failed playlists
      }
    })
  )

  // Sort by Spotify popularity (0–100) — this reflects actual global stream counts
  return all
    .filter(t => t.popularity > 0)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
}
