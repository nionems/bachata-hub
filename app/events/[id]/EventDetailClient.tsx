'use client'

import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { MapPin, Calendar, Clock, ArrowLeft, ExternalLink } from 'lucide-react'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface EventDetail {
  id: string
  name?: string
  title?: string
  date?: string
  start?: string
  time?: string
  description?: string
  location?: string
  imageUrl?: string
  ticketLink?: string
  htmlLink?: string
  eventLink?: string
  googleMapLink?: string
  price?: string
}

function getTitle(e: EventDetail) { return e.title || e.name || 'Event' }
function getDate(e: EventDetail) {
  if (e.date) return e.date
  if (e.start) {
    const d = new Date(e.start)
    return d.toLocaleDateString('en-AU', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })
  }
  return ''
}
function getTime(e: EventDetail) {
  if (e.time) return e.time
  if (e.start?.includes('T')) {
    return new Date(e.start).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })
  }
  return ''
}

export default function EventDetailClient({ id }: { id: string }) {
  const router = useRouter()
  const [event, setEvent] = useState<EventDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const isCalEvent = id.startsWith('cal_')
    const url = isCalEvent ? `/api/calendar/event/${id}` : `/api/events/${id}`
    fetch(url)
      .then(r => r.ok ? r.json() : Promise.reject())
      .then(data => { setEvent(data); setIsLoading(false) })
      .catch(() => { setError(true); setIsLoading(false) })
  }, [id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500" />
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h1 className="text-2xl font-bold text-red-600 mb-4">Event not found</h1>
        <Button onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
      </div>
    )
  }

  const title = getTitle(event)
  const date = getDate(event)
  const time = getTime(event)
  const image = event.imageUrl || '/images/BACHATA.AU (13).png'
  const externalLink = event.ticketLink || event.htmlLink || event.eventLink
  const mapLink = event.googleMapLink || (event.location ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}` : null)
  const cleanDesc = event.description?.replace(/<[^>]+>/g, '').replace(/https?:\/\/\S+/g, '').trim()

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Back nav */}
      <div className="container mx-auto px-4 pt-6 pb-2">
        <Link href="/events" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-green-600 transition-colors">
          <ArrowLeft className="h-4 w-4" /> All Events
        </Link>
      </div>

      <div className="container mx-auto px-4 pb-12 max-w-2xl">
        {/* Hero image */}
        <div className="relative w-full h-64 sm:h-80 rounded-2xl overflow-hidden shadow-lg mb-6">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, 672px"
            onError={(e: any) => { e.currentTarget.src = '/images/BACHATA.AU (13).png' }}
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <h1 className="text-white text-xl sm:text-2xl font-bold leading-tight drop-shadow">{title}</h1>
          </div>
        </div>

        {/* Details card */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 p-5 sm:p-6 space-y-4">
          {date && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Calendar className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{date}{time ? ` · ${time}` : ''}</span>
            </div>
          )}
          {event.location && (
            <div className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
              <MapPin className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
              <span>{event.location}</span>
            </div>
          )}
          {event.price && (
            <div className="flex items-center gap-3 text-gray-700 dark:text-gray-300">
              <Clock className="h-5 w-5 text-green-500 flex-shrink-0" />
              <span>{event.price}</span>
            </div>
          )}

          {cleanDesc && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-2">About this event</h2>
              <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed whitespace-pre-line">{cleanDesc}</p>
            </div>
          )}

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            {externalLink && (
              <a
                href={externalLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg text-sm"
              >
                <ExternalLink className="h-4 w-4" />
                {event.ticketLink ? 'Get Tickets' : 'View Event'}
              </a>
            )}
            {mapLink && (
              <a
                href={mapLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 border border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-green-400 hover:text-green-600 font-medium py-3 px-4 rounded-xl transition-all duration-200 text-sm"
              >
                <MapPin className="h-4 w-4" />
                View on Map
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
