"use client"

import { useState, useEffect } from 'react'
import { Music, Youtube } from 'lucide-react'

interface Track {
  id: string
  name: string
  artists: string[]
  albumArt: string
  youtubeUrl: string
  viewCount: number
}

function formatViews(n: number) {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M views`
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K views`
  return `${n} views`
}

export default function TopBachataPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)

  useEffect(() => {
    fetch('/api/music/top-bachata')
      .then(r => r.json())
      .then(data => {
        if (data.error && !data.tracks?.length) setError(data.error)
        setTracks(data.tracks ?? [])
        setUpdatedAt(data.updatedAt)
      })
      .catch(() => setError('Could not load top songs. Check back soon.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-3xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-3">
            <div className="bg-gradient-to-r from-emerald-400 to-violet-500 p-3 rounded-full">
              <Music className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Top 20 Bachata Songs
          </h1>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Most viewed bachata videos on YouTube · Updated weekly
          </p>
          {updatedAt && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Last updated {new Date(updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        {loading && (
          <div className="space-y-3">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="h-20 bg-gray-100 dark:bg-gray-800 rounded-xl animate-pulse" />
            ))}
          </div>
        )}

        {error && (
          <div className="text-center py-16 text-gray-500 dark:text-gray-400">
            <Music className="h-12 w-12 mx-auto mb-3 opacity-30" />
            <p>{error}</p>
          </div>
        )}

        {!loading && !error && (
          <ol className="space-y-2">
            {tracks.map((track, index) => (
              <li key={track.id}>
                <a
                  href={track.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 bg-gray-50 dark:bg-gray-900 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl px-3 py-3 transition-colors group"
                >
                  {/* Rank */}
                  <span className={`w-7 text-center font-bold text-sm flex-shrink-0 ${
                    index === 0 ? 'text-yellow-500' :
                    index === 1 ? 'text-gray-400' :
                    index === 2 ? 'text-amber-600' :
                    'text-gray-400 dark:text-gray-600'
                  }`}>
                    {index + 1}
                  </span>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{track.name}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artists.join(', ')}</div>
                  </div>

                  {/* View count */}
                  <span className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block flex-shrink-0">
                    {track.viewCount > 0 ? formatViews(track.viewCount) : ''}
                  </span>

                  {/* YouTube icon */}
                  <Youtube className="h-5 w-5 text-gray-400 group-hover:text-[#FF0000] transition-colors flex-shrink-0" />
                </a>
              </li>
            ))}
          </ol>
        )}

        {!loading && !error && tracks.length > 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
            Powered by YouTube · Ranked by view count
          </p>
        )}
      </div>
    </div>
  )
}
