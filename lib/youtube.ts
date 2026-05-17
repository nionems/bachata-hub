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

const SEARCH_QUERIES = [
  `bachata 2025 ${EXCLUDE_SUFFIX}`,
  `bachata hits 2025 ${EXCLUDE_SUFFIX}`,
  `bachata romantica 2024 2025 ${EXCLUDE_SUFFIX}`,
  `nueva bachata 2025 ${EXCLUDE_SUFFIX}`,
  `bachata sensual 2024 2025 ${EXCLUDE_SUFFIX}`,
  `dj husky bachata 2025`,
  `charles luis bachata 2025`,
  `bachata rising 2025`,
  `dimelo cupido bachata 2025`,
  `prince royce bachata 2025`,
  `pinto picasso bachata 2025`,
  `shama bachata 2025`,
  `dj cat bachata 2025`,
  `dj tronky bachata 2025`,
  `sebas gareta bachata 2025`,
  `dani j bachata 2025`,
]

async function searchVideos(apiKey: string, query: string): Promise<string[]> {
  // Only videos published in the last 30 days
  const publishedAfter = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=id&type=video&videoCategoryId=10&order=viewCount` +
    `&maxResults=10&publishedAfter=${publishedAfter}` +
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
  const url =
    `https://www.googleapis.com/youtube/v3/videos` +
    `?part=snippet,statistics&id=${videoIds.join(',')}&key=${apiKey}`
  const res = await fetch(url)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(`YouTube videos fetch failed (${res.status}): ${text.slice(0, 200)}`)
  }
  const data = await res.json()
  return (data.items ?? []).map((item: any) => ({
    id: item.id,
    name: item.snippet?.title ?? 'Unknown',
    artists: [item.snippet?.channelTitle ?? 'Unknown'],
    albumArt: item.snippet?.thumbnails?.high?.url ?? item.snippet?.thumbnails?.default?.url ?? '',
    youtubeUrl: `https://www.youtube.com/watch?v=${item.id}`,
    viewCount: parseInt(item.statistics?.viewCount ?? '0', 10),
    publishedAt: item.snippet?.publishedAt ?? '',
  }))
}

export async function fetchTopBachataVideos(apiKey: string): Promise<VideoTrack[]> {
  const seen = new Set<string>()
  const allIds: string[] = []

  await Promise.all(
    SEARCH_QUERIES.map(async (q) => {
      try {
        const ids = await searchVideos(apiKey, q)
        for (const id of ids) {
          if (!seen.has(id)) {
            seen.add(id)
            allIds.push(id)
          }
        }
      } catch {
        // ignore individual query failures
      }
    })
  )

  if (allIds.length === 0) {
    throw new Error('No videos found from YouTube')
  }

  const tracks = await getVideoDetails(apiKey, allIds)

  if (tracks.length === 0) {
    throw new Error('Could not fetch video details from YouTube')
  }

  const excludeRegex = new RegExp(EXCLUDE_GENRES.join('|'), 'i')
  const now = Date.now()

  // Score by views-per-day so recently uploaded songs that are trending
  // rank higher than older videos that merely have more total views
  const scored = tracks
    .filter(t => !excludeRegex.test(t.name))
    .map(t => {
      const ageMs = now - (t.publishedAt ? new Date(t.publishedAt).getTime() : now)
      const ageDays = Math.max(ageMs / (1000 * 60 * 60 * 24), 1)
      return { track: t, score: t.viewCount / ageDays }
    })

  return scored
    .sort((a, b) => b.score - a.score)
    .slice(0, 20)
    .map(s => s.track)
}
