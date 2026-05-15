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

// Spotify editorial playlists + user-provided playlist
const SEED_PLAYLIST_IDS = [
  '37i9dQZF1DX9pIn6tM2ADM', // Bachata Hits (Spotify Editorial)
  '37i9dQZF1DZ06evO4ZbNyO', // This Is Bachata (Spotify Editorial)
  '37i9dQZF1DWY3MFYA5XfEd', // Bachata Romántica
  '37i9dQZF1DX0HRj9P7NxeE', // Bachata Sensual
  '37i9dQZF1DXaym5ohD2SxG', // Éxitos Bachata
  '37i9dQZF1DX1Mv9USgbXV2', // Baila Bachata
  '37i9dQZF1EIY1iYw3s6uQb', // User-provided playlist
]

// Artist IDs — their top tracks are included in the pool
const ARTIST_IDS = [
  '7KpJV35QbeZ1ZCn34bnypL',
  '3JEHkKoCwbqnsqJxumsmy5',
  '56O28NX1Su8GSYhuNGupjI',
]

// Search Spotify for more popular bachata playlists dynamically
async function discoverBachataPlaylistIds(token: string): Promise<string[]> {
  const queries = ['bachata hits', 'bachata romántica', 'bachata sensual', 'top bachata', 'best bachata']
  const ids = new Set<string>(SEED_PLAYLIST_IDS)

  await Promise.all(
    queries.map(async (q) => {
      try {
        const url = `https://api.spotify.com/v1/search?q=${encodeURIComponent(q)}&type=playlist&limit=10`
        const res = await fetch(url, { headers: { Authorization: `Bearer ${token}` } })
        if (!res.ok) return
        const data = await res.json()
        for (const pl of data.playlists?.items ?? []) {
          if (pl?.id && pl.tracks?.total > 20) ids.add(pl.id)
        }
      } catch {
        // ignore
      }
    })
  )

  return Array.from(ids)
}

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
      if (!t?.id) continue
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

async function fetchArtistTopTracks(token: string, artistId: string): Promise<SpotifyTrack[]> {
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${artistId}/top-tracks?market=AU`,
    { headers: { Authorization: `Bearer ${token}` } }
  )
  if (!res.ok) return []
  const data = await res.json()

  return (data.tracks ?? []).map((t: any) => ({
    id: t.id,
    name: t.name,
    artists: t.artists.map((a: any) => a.name),
    album: t.album.name,
    albumArt: t.album.images?.[0]?.url ?? '',
    popularity: t.popularity ?? 0,
    previewUrl: t.preview_url ?? null,
    spotifyUrl: t.external_urls?.spotify ?? '',
    durationMs: t.duration_ms,
  }))
}

export async function fetchTopBachataTrack(token: string): Promise<SpotifyTrack[]> {
  const playlistIds = await discoverBachataPlaylistIds(token)
  const seen = new Set<string>()
  const all: SpotifyTrack[] = []

  const addTrack = (t: SpotifyTrack) => {
    if (seen.has(t.id)) return
    seen.add(t.id)
    all.push(t)
  }

  // Fetch playlist tracks and artist top tracks in parallel
  await Promise.all([
    ...playlistIds.map(async (id) => {
      try {
        const tracks = await fetchPlaylistTracks(token, id)
        tracks.forEach(addTrack)
      } catch { }
    }),
    ...ARTIST_IDS.map(async (id) => {
      try {
        const tracks = await fetchArtistTopTracks(token, id)
        tracks.forEach(addTrack)
      } catch { }
    }),
  ])

  return all
    .filter(t => t.popularity > 0)
    .sort((a, b) => b.popularity - a.popularity)
    .slice(0, 20)
}
