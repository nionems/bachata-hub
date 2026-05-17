export interface VideoTrack {
  id: string
  name: string
  artists: string[]
  albumArt: string
  youtubeUrl: string
  viewCount: number
}

const SEARCH_QUERIES = [
  'bachata 2025',
  'bachata hits 2025',
  'bachata romantica 2024 2025',
  'nueva bachata 2025',
  'bachata sensual 2024 2025',
]

async function searchVideos(apiKey: string, query: string): Promise<string[]> {
  // Only videos published in the last 12 months
  const publishedAfter = new Date(Date.now() - 365 * 24 * 60 * 60 * 1000).toISOString()
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

  return tracks
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 20)
}
