export interface VideoTrack {
  id: string
  name: string
  artists: string[]
  albumArt: string
  youtubeUrl: string
  viewCount: number
  publishedAt: string
}

const EXCLUDE_GENRES = ['merengue', 'salsa', 'cumbia', 'reggaeton', 'dembow', 'vallenato']
const EXCLUDE_SUFFIX = EXCLUDE_GENRES.map(g => `-${g}`).join(' ')

// General trending queries — 30 day window
const GENERAL_QUERIES = [
  `bachata 2025 ${EXCLUDE_SUFFIX}`,
  `bachata hits 2025 ${EXCLUDE_SUFFIX}`,
  `bachata romantica 2025 ${EXCLUDE_SUFFIX}`,
  `nueva bachata 2025 ${EXCLUDE_SUFFIX}`,
  `bachata sensual 2025 ${EXCLUDE_SUFFIX}`,
]

// Artist queries — 90 day window so they always appear even without recent uploads
const ARTIST_QUERIES = [
  'dj husky bachata',
  'charles luis bachata',
  'bachata rising',
  'dimelo cupido bachata',
  'prince royce bachata',
  'pinto picasso bachata',
  'shama bachata',
  'dj cat bachata',
  'dj tronky bachata',
  'sebas gareta bachata',
  'sebas garreta bachata',
  'dani j bachata',
  'johnny sky bachata',
  'esme bachata',
  'akai rojas bachata',
  'kewin cosmos bachata',
  'montelier bachata',
]

async function searchVideos(apiKey: string, query: string, daysBack: number): Promise<string[]> {
  const publishedAfter = new Date(Date.now() - daysBack * 24 * 60 * 60 * 1000).toISOString()
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=id&type=video&videoCategoryId=10&order=viewCount` +
    `&maxResults=5&publishedAfter=${publishedAfter}` +
    `&q=${encodeURIComponent(query)}&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`YouTube search failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return (data.items ?? []).map((item: any) => item.id?.videoId).filter(Boolean)
}

async function getVideoDetails(apiKey: string, videoIds: string[]): Promise<VideoTrack[]> {
  if (videoIds.length === 0) return []
  // YouTube videos.list accepts max 50 IDs at once
  const chunks: string[][] = []
  for (let i = 0; i < videoIds.length; i += 50) chunks.push(videoIds.slice(i, i + 50))

  const results: VideoTrack[] = []
  for (const chunk of chunks) {
    const url =
      `https://www.googleapis.com/youtube/v3/videos` +
      `?part=snippet,statistics&id=${chunk.join(',')}&key=${apiKey}`
    const res = await fetch(url)
    if (!res.ok) continue
    const data = await res.json()
    for (const item of data.items ?? []) {
      results.push({
        id: item.id,
        name: item.snippet?.title ?? 'Unknown',
        artists: [item.snippet?.channelTitle ?? 'Unknown'],
        albumArt: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? '',
        youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
        viewCount: parseInt(item.statistics?.viewCount ?? '0', 10),
        publishedAt: item.snippet?.publishedAt ?? '',
      })
    }
  }
  return results
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/\(.*?\)/g, '')
    .replace(/\[.*?\]/g, '')
    .replace(/official|video|audio|lyrics|lyric|ft\.?|feat\.?/gi, '')
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
}

export async function fetchTopBachataVideos(apiKey: string): Promise<VideoTrack[]> {
  const seenIds = new Set<string>()
  const allIds: string[] = []

  const collect = (ids: string[]) => {
    for (const id of ids) {
      if (!seenIds.has(id)) { seenIds.add(id); allIds.push(id) }
    }
  }

  await Promise.all([
    ...GENERAL_QUERIES.map(async (q) => {
      try { collect(await searchVideos(apiKey, q, 30)) } catch { }
    }),
    ...ARTIST_QUERIES.map(async (q) => {
      try { collect(await searchVideos(apiKey, q, 90)) } catch { }
    }),
  ])

  if (allIds.length === 0) throw new Error('No videos found from YouTube')

  const tracks = await getVideoDetails(apiKey, allIds)
  if (tracks.length === 0) throw new Error('Could not fetch video details from YouTube')

  const excludeRegex = new RegExp(EXCLUDE_GENRES.join('|'), 'i')
  const now = Date.now()
  const seenTitles = new Set<string>()
  const artistCount = new Map<string, number>()

  const scored = tracks
    .filter(t => {
      if (excludeRegex.test(t.name)) return false
      const norm = normalizeTitle(t.name)
      if (seenTitles.has(norm)) return false
      seenTitles.add(norm)
      return true
    })
    .map(t => {
      const ageMs = now - (t.publishedAt ? new Date(t.publishedAt).getTime() : now)
      const ageDays = Math.max(ageMs / (1000 * 60 * 60 * 24), 1)
      return { track: t, score: t.viewCount / ageDays }
    })
    .sort((a, b) => b.score - a.score)

  // 1 song per artist — best velocity wins their slot
  // then re-sort by total view count so rank 1 = most viewed
  return scored
    .filter(({ track }) => {
      const artist = track.artists[0].toLowerCase()
      if ((artistCount.get(artist) ?? 0) >= 1) return false
      artistCount.set(artist, 1)
      return true
    })
    .slice(0, 20)
    .sort((a, b) => b.track.viewCount - a.track.viewCount)
    .map(s => s.track)
}
