"use client"

import { useState, useEffect, useRef } from 'react'
import { Music, Play, Pause, ExternalLink, Youtube } from 'lucide-react'
import Image from 'next/image'

interface Track {
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

function formatDuration(ms: number) {
  const m = Math.floor(ms / 60000)
  const s = Math.floor((ms % 60000) / 1000)
  return `${m}:${s.toString().padStart(2, '0')}`
}

export default function TopBachataPage() {
  const [tracks, setTracks] = useState<Track[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [updatedAt, setUpdatedAt] = useState<number | null>(null)
  const [playingId, setPlayingId] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement | null>(null)

  useEffect(() => {
    fetch('/api/music/top-bachata')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        setTracks(data.tracks ?? [])
        setUpdatedAt(data.updatedAt)
      })
      .catch(() => setError('Could not load top songs. Check back soon.'))
      .finally(() => setLoading(false))
  }, [])

  const togglePreview = (track: Track) => {
    if (!track.previewUrl) return

    if (playingId === track.id) {
      audioRef.current?.pause()
      setPlayingId(null)
    } else {
      if (audioRef.current) {
        audioRef.current.pause()
      }
      const audio = new Audio(track.previewUrl)
      audio.play()
      audio.onended = () => setPlayingId(null)
      audioRef.current = audio
      setPlayingId(track.id)
    }
  }

  // Stop audio on unmount
  useEffect(() => () => { audioRef.current?.pause() }, [])

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
            Ranked by Spotify popularity · Updated daily
          </p>
          {updatedAt && (
            <p className="text-gray-400 dark:text-gray-500 text-xs mt-1">
              Last updated {new Date(updatedAt).toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' })}
            </p>
          )}
        </div>

        {/* List */}
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
              <li
                key={track.id}
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

                {/* Album art */}
                <div className="relative h-12 w-12 flex-shrink-0 rounded-lg overflow-hidden bg-gray-200 dark:bg-gray-700">
                  {track.albumArt ? (
                    <Image src={track.albumArt} alt={track.album} fill className="object-cover" sizes="48px" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Music className="h-5 w-5 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">{track.name}</div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 truncate">{track.artists.join(', ')}</div>
                </div>

                {/* Duration */}
                <span className="text-xs text-gray-400 dark:text-gray-600 hidden sm:block flex-shrink-0">
                  {formatDuration(track.durationMs)}
                </span>

                {/* Preview play button */}
                {track.previewUrl && (
                  <button
                    onClick={() => togglePreview(track)}
                    className="flex-shrink-0 p-2 rounded-full bg-primary/10 hover:bg-primary/20 text-primary transition-colors"
                    title={playingId === track.id ? 'Pause preview' : 'Play 30s preview'}
                  >
                    {playingId === track.id
                      ? <Pause className="h-4 w-4" />
                      : <Play className="h-4 w-4" />
                    }
                  </button>
                )}

                {/* YouTube link */}
                <a
                  href={`https://www.youtube.com/results?search_query=${encodeURIComponent(`${track.name} ${track.artists[0]}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-[#FF0000] transition-colors"
                  title="Search on YouTube"
                  onClick={e => e.stopPropagation()}
                >
                  <Youtube className="h-4 w-4" />
                </a>

                {/* Spotify link */}
                <a
                  href={track.spotifyUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-shrink-0 p-2 rounded-full text-gray-400 hover:text-[#1DB954] transition-colors"
                  title="Open in Spotify"
                  onClick={e => e.stopPropagation()}
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              </li>
            ))}
          </ol>
        )}

        {/* Powered by Spotify */}
        {!loading && !error && tracks.length > 0 && (
          <p className="text-center text-xs text-gray-400 dark:text-gray-600 mt-8">
            Powered by Spotify · Data reflects global streaming popularity
          </p>
        )}
      </div>
    </div>
  )
}
