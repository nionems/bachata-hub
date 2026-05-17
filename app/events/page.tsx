"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp, X, Search, Clock, CalendarPlus, ExternalLink, Heart, UserCheck, Ticket } from "lucide-react"
import Link from 'next/link'
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { format } from "date-fns";
import { ContactForm } from "@/components/ContactForm"
import { EventSubmissionForm } from "@/components/EventSubmissionForm"
import CalendarMenu from "@/components/calendar-menu"
import { LoadingSpinner } from '@/components/loading-spinner'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getNextOccurrence, getDayOfWeek, formatNextDate, formatTime, buildGoogleCalendarUrl } from '@/lib/recurrence'


interface Event {
  id: string
  name: string
  eventDate: string
  startTime: string
  endTime: string
  location: string
  city: string
  state: string
  description: string
  price?: string
  danceStyles?: string[] | string
  imageUrl?: string
  eventLink?: string
  ticketLink?: string
  comment?: string
  date?: string
  googleMapLink?: string
  isWeekly?: boolean
  recurrence?: string
  isWorkshop?: boolean
  published?: boolean
  likesCount?: number
  goingCount?: number
  nextOccurrence?: Date | null
  nextOccurrenceConfirmed?: boolean
  dayOfWeek?: string | null
}

// Match a Google Calendar event title to a Firestore event name for confirmed date detection
function matchesEvent(calendarTitle: string, firestoreName: string): boolean {
  const cal = calendarTitle.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  const fb = firestoreName.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim()
  if (!cal || !fb) return false
  if (fb.length >= 4 && cal.includes(fb)) return true
  if (cal.length >= 4 && fb.includes(cal)) return true
  const calWords = new Set(cal.split(/\s+/).filter(w => w.length > 3))
  const fbWords = fb.split(/\s+/).filter(w => w.length > 3)
  return fbWords.filter(w => calWords.has(w)).length >= 2
}

const AT_THE_DOOR_EVENTS = ['bachateame', 'salsachata']

function isAtTheDoor(event: Event): boolean {
  const title = (event.name ?? '').toLowerCase()
  return AT_THE_DOOR_EVENTS.some(name => title.includes(name))
}

function extractTicketLink(event: Event): string | undefined {
  if (event.ticketLink) return event.ticketLink
  const urlMatch = event.description?.match(/https?:\/\/[^\s\])"]+/)
  if (!urlMatch) return undefined
  const url = urlMatch[0]
  if (/drive\.google\.com|docs\.google\.com|photos\.google\.com/i.test(url)) return undefined
  return url
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set())
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [goingEvents, setGoingEvents] = useState<Set<string>>(new Set())
  const [goingCounts, setGoingCounts] = useState<Record<string, number>>({})
  const [goingConfirmEventId, setGoingConfirmEventId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDanceStyle, setSelectedDanceStyle] = useState("all")
  const [selectedDay, setSelectedDay] = useState("all")
  const [availableDanceStyles, setAvailableDanceStyles] = useState<string[]>([])
  const [availableDays, setAvailableDays] = useState<string[]>([])

  const { selectedState, setSelectedState, filteredItems: filteredEvents, isGeoLoading, error: geoError } = useStateFilter(events)

  const searchFilteredEvents = filteredEvents.filter(event => {
    const nameMatch = event.name.toLowerCase().includes(searchTerm.toLowerCase())
    const locationMatch = event.location.toLowerCase().includes(searchTerm.toLowerCase())
    const danceStylesMatch = Array.isArray(event.danceStyles) && event.danceStyles.some(style =>
      style.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const danceStyleMatch = selectedDanceStyle === "all" ||
      (Array.isArray(event.danceStyles) && event.danceStyles.includes(selectedDanceStyle))
    const dayMatch = selectedDay === "all" || event.dayOfWeek === selectedDay

    return (nameMatch || locationMatch || danceStylesMatch) && danceStyleMatch && dayMatch
  })

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const [eventsRes, calendarRes] = await Promise.all([
          fetch('/api/events?t=' + Date.now()),
          fetch('/api/calendar/upcoming'),
        ])

        const eventsList = eventsRes.ok ? (await eventsRes.json() as Event[]) : []
        const calendarEvents: { title: string; start: string; end?: string; description?: string; location?: string; htmlLink?: string }[] = calendarRes.ok
          ? await calendarRes.json()
          : []

        // Use start-of-today so today's events show even if their start time passed
        const todayStart = new Date()
        todayStart.setHours(0, 0, 0, 0)

        const eventsWithNext = eventsList.map(event => {
          const calendarMatch = calendarEvents.find(ce => matchesEvent(ce.title, event.name))
          const confirmed = calendarMatch ? new Date(calendarMatch.start) : null
          const nextOccurrence = confirmed && !isNaN(confirmed.getTime()) && confirmed >= todayStart ? confirmed : null
          return {
            ...event,
            nextOccurrence,
            nextOccurrenceConfirmed: true,
            dayOfWeek: event.recurrence ? getDayOfWeek(event.recurrence) : null,
          }
        })

        eventsWithNext.sort((a, b) => {
          if (!a.nextOccurrence && !b.nextOccurrence) return a.name.localeCompare(b.name)
          if (!a.nextOccurrence) return 1
          if (!b.nextOccurrence) return -1
          return (a.nextOccurrence as Date).getTime() - (b.nextOccurrence as Date).getTime()
        })

        setEvents(eventsWithNext)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  useEffect(() => {
    const styles = new Set<string>()
    const days = new Set<string>()
    filteredEvents.forEach(event => {
      if (event.danceStyles && Array.isArray(event.danceStyles)) {
        event.danceStyles.forEach(style => styles.add(style))
      }
      if (event.dayOfWeek) days.add(event.dayOfWeek)
    })
    setAvailableDanceStyles(Array.from(styles).sort())

    const dayOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
    setAvailableDays(dayOrder.filter(d => days.has(d)))
  }, [filteredEvents])

  useEffect(() => {
    if (availableDanceStyles.includes('Bachata')) {
      setSelectedDanceStyle('Bachata')
    } else {
      setSelectedDanceStyle('all')
    }
  }, [availableDanceStyles, selectedState])

  const toggleComment = (eventId: string) => {
    setExpandedComments(prev => ({ ...prev, [eventId]: !prev[eventId] }))
  }

  // Load liked/going events — backend is source of truth, localStorage is cache
  useEffect(() => {
    const generateUserId = (): string => {
      try {
        return crypto.randomUUID()
      } catch {
        return Math.random().toString(36).slice(2) + Date.now().toString(36)
      }
    }

    const getOrCreateUserId = (): string => {
      try {
        let id = localStorage.getItem('bachataUserId')
        if (!id) {
          id = generateUserId()
          localStorage.setItem('bachataUserId', id)
        }
        return id
      } catch {
        return generateUserId()
      }
    }

    const userId = getOrCreateUserId()

    // Seed from localStorage immediately so UI isn't empty while fetching
    try {
      const storedLikes = localStorage.getItem('likedEvents')
      if (storedLikes) setLikedEvents(new Set(JSON.parse(storedLikes)))
      const storedGoing = localStorage.getItem('goingEvents')
      if (storedGoing) setGoingEvents(new Set(JSON.parse(storedGoing)))
    } catch {}

    // Fetch authoritative state from backend
    fetch(`/api/user/interactions?userId=${encodeURIComponent(userId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        const liked = new Set<string>(data.likedEvents)
        const going = new Set<string>(data.goingEvents)
        setLikedEvents(liked)
        setGoingEvents(going)
        try {
          localStorage.setItem('likedEvents', JSON.stringify([...liked]))
          localStorage.setItem('goingEvents', JSON.stringify([...going]))
        } catch {}
      })
      .catch(() => {})
  }, [])

  const toggleLike = async (e: React.MouseEvent, eventId: string, currentCount: number) => {
    e.stopPropagation()
    const isLiked = likedEvents.has(eventId)
    const action = isLiked ? 'unlike' : 'like'

    const newLiked = new Set(likedEvents)
    if (isLiked) newLiked.delete(eventId)
    else newLiked.add(eventId)
    setLikedEvents(newLiked)
    setLikeCounts(prev => ({ ...prev, [eventId]: (prev[eventId] ?? currentCount) + (isLiked ? -1 : 1) }))

    try { localStorage.setItem('likedEvents', JSON.stringify([...newLiked])) } catch {}

    try {
      const userId = localStorage.getItem('bachataUserId') ?? ''
      await fetch(`/api/events/${eventId}/like`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      })
    } catch {}
  }

  const performGoing = async (eventId: string, currentCount: number) => {
    const isGoing = goingEvents.has(eventId)
    const action = isGoing ? 'notgoing' : 'going'

    const newGoing = new Set(goingEvents)
    if (isGoing) newGoing.delete(eventId)
    else newGoing.add(eventId)
    setGoingEvents(newGoing)
    setGoingCounts(prev => ({ ...prev, [eventId]: (prev[eventId] ?? currentCount) + (isGoing ? -1 : 1) }))

    try { localStorage.setItem('goingEvents', JSON.stringify([...newGoing])) } catch {}

    try {
      const userId = localStorage.getItem('bachataUserId') ?? ''
      await fetch(`/api/events/${eventId}/going`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, userId }),
      })
    } catch {}
  }

  const handleGoingClick = (e: React.MouseEvent, eventId: string, currentCount: number) => {
    e.stopPropagation()
    if (goingEvents.has(eventId)) {
      performGoing(eventId, currentCount)
    } else {
      setGoingConfirmEventId(eventId)
    }
  }

  const confirmGoing = () => {
    if (!goingConfirmEventId) return
    const event = events.find(ev => ev.id === goingConfirmEventId)
    performGoing(goingConfirmEventId, event?.goingCount ?? 0)
    setGoingConfirmEventId(null)
  }

  if (isLoading || isGeoLoading) return <LoadingSpinner message="Loading events..." />
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Recurring Events
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find Bachata events near you.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">
            <StateFilter
              selectedState={selectedState}
              onChange={setSelectedState}
              isLoading={isGeoLoading}
              error={geoError}
            />
            <div className="w-full sm:w-44">
              <Select value={selectedDanceStyle} onValueChange={setSelectedDanceStyle}>
                <SelectTrigger className="w-full bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Dance Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  {availableDanceStyles.map((style) => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-44">
              <Select value={selectedDay} onValueChange={setSelectedDay}>
                <SelectTrigger className="w-full bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Day of Week" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Days</SelectItem>
                  {availableDays.map((day) => (
                    <SelectItem key={day} value={day}>{day}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 flex-1 min-w-0">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-md"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="shrink-0 border-gray-200 hover:bg-gray-50 hover:text-primary rounded-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>

        </div>

        <div className="flex flex-col gap-3">
          {searchFilteredEvents.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No events found
              {selectedState !== 'all' && ` in ${selectedState}`}
              {selectedDanceStyle !== 'all' && ` for ${selectedDanceStyle}`}
              {selectedDay !== 'all' && ` on ${selectedDay}s`}
            </div>
          ) : (
            searchFilteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 bg-white flex flex-row border border-gray-100">

                {/* Image */}
                <div
                  className="relative w-32 sm:w-44 flex-shrink-0 overflow-hidden cursor-pointer"
                  onClick={() => event.imageUrl && setSelectedImage({ url: event.imageUrl, title: event.name })}
                >
                  <img
                    src={event.imageUrl || '/images/BACHATA.AU (13).png'}
                    alt={event.name}
                    loading="lazy"
                    className={`absolute inset-0 w-full h-full ${event.imageUrl ? 'object-cover hover:scale-105 transition-transform duration-300' : 'object-contain p-3 bg-gray-50'}`}
                  />
                  {event.isWorkshop && (
                    <div className="absolute bottom-2 left-1 bg-primary text-white text-[9px] font-semibold px-1.5 py-0.5 rounded-full shadow">
                      + Workshop
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex flex-col flex-1 p-3 sm:p-4 min-w-0 gap-2">

                  {/* Date pill */}
                  {event.nextOccurrence ? (
                    <div className="inline-flex items-center gap-1.5 self-start bg-green-100 text-green-800 px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs font-bold whitespace-nowrap">{formatNextDate(event.nextOccurrence)}</span>
                      {event.startTime && (
                        <span className="text-[10px] font-medium opacity-70 border-l border-green-300 pl-1.5 whitespace-nowrap">
                          {formatTime(event.startTime)}{event.endTime ? ` – ${formatTime(event.endTime)}` : ''}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div className="inline-flex items-center gap-1.5 self-start bg-gray-100 text-gray-400 px-3 py-1 rounded-full">
                      <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                      <span className="text-xs font-medium whitespace-nowrap">Coming soon</span>
                    </div>
                  )}

                  {/* Event name */}
                  <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug">{event.name}</h3>

                  {/* Location */}
                  {event.location && (
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                      <span className="truncate">{event.location}</span>
                    </div>
                  )}

                  {/* Dance style badges */}
                  {event.danceStyles && Array.isArray(event.danceStyles) && event.danceStyles.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {event.danceStyles.map((style, i) => (
                        <span key={i} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                          {style}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Comment */}
                  {event.comment && (
                    <div>
                      <p className={`text-xs text-gray-500 leading-relaxed ${expandedComments[event.id] ? '' : 'line-clamp-2'}`}>
                        {event.comment}
                      </p>
                      {event.comment.length > 80 && (
                        <button
                          onClick={(e) => { e.stopPropagation(); toggleComment(event.id) }}
                          className="text-[10px] text-primary hover:text-primary/80 mt-0.5 flex items-center gap-0.5"
                        >
                          {expandedComments[event.id]
                            ? (<>Less <ChevronUp className="h-2.5 w-2.5" /></>)
                            : (<>More <ChevronDown className="h-2.5 w-2.5" /></>)}
                        </button>
                      )}
                    </div>
                  )}

                  <div className="flex-1" />

                  {/* Actions */}
                  <div className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap">
                    <button
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                        likedEvents.has(event.id)
                          ? 'bg-red-50 text-red-500 border-red-200'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
                      }`}
                      onClick={(e) => toggleLike(e, event.id, event.likesCount ?? 0)}
                    >
                      <Heart className={`h-3.5 w-3.5 ${likedEvents.has(event.id) ? 'fill-red-500' : ''}`} />
                      <span>{(likeCounts[event.id] ?? event.likesCount) ? `${likeCounts[event.id] ?? event.likesCount} ` : ''}I'm Going</span>
                    </button>

                    <button
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                        goingEvents.has(event.id)
                          ? 'bg-green-500 text-white border-green-500'
                          : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-600'
                      }`}
                      onClick={(e) => handleGoingClick(e, event.id, event.goingCount ?? 0)}
                    >
                      <UserCheck className="h-3.5 w-3.5" />
                      <span>{(goingCounts[event.id] ?? event.goingCount) ? `${goingCounts[event.id] ?? event.goingCount} ` : ''}I'm Here</span>
                    </button>

                    {isAtTheDoor(event) ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                        <Ticket className="h-3.5 w-3.5" />
                        At the Door
                      </span>
                    ) : extractTicketLink(event) ? (
                      <a
                        href={extractTicketLink(event)}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-3 py-1.5 rounded-full shadow-sm transition-opacity"
                      >
                        <Ticket className="h-3.5 w-3.5" />
                        Get Ticket
                      </a>
                    ) : event.eventLink ? (
                      <a
                        href={event.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={e => e.stopPropagation()}
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        More Info
                      </a>
                    ) : null}

                    <div className="flex gap-1 ml-auto">
                      <button
                        className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                        onClick={(e) => { e.stopPropagation(); window.open(buildGoogleCalendarUrl(event, event.nextOccurrence ?? null), '_blank') }}
                        title="Add to Google Calendar"
                      >
                        <CalendarPlus className="h-4 w-4" />
                      </button>
                      {event.googleMapLink && (
                        <button
                          className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                          onClick={(e) => { e.stopPropagation(); window.open(event.googleMapLink, '_blank') }}
                          title="View on Map"
                        >
                          <MapPin className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* I'm Here confirmation modal */}
        {goingConfirmEventId && (() => {
          const confirmEvent = events.find(ev => ev.id === goingConfirmEventId)
          return (
            <div
              className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4"
              onClick={() => setGoingConfirmEventId(null)}
            >
              <div
                className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center gap-4"
                onClick={e => e.stopPropagation()}
              >
                <UserCheck className="h-10 w-10 text-green-500" />
                <h2 className="text-lg font-bold text-gray-900 text-center">Are you at the venue?</h2>
                {confirmEvent && (
                  <p className="text-sm text-gray-500 text-center">Confirm you're currently at <span className="font-semibold text-gray-700">{confirmEvent.name}</span></p>
                )}
                <div className="flex gap-3 w-full mt-1">
                  <button
                    className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors"
                    onClick={() => setGoingConfirmEventId(null)}
                  >
                    Cancel
                  </button>
                  <button
                    className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors"
                    onClick={confirmGoing}
                  >
                    Yes, I'm here!
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Image Modal */}
        {selectedImage && (
          <div
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        <CalendarMenu />

        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">Submit Your Event</h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Are you organizing a Bachata event? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                {['Reach a wider audience of dance enthusiasts', 'Promote your event to the dance community', 'Connect with dancers across Australia'].map((item) => (
                  <li key={item} className="flex items-center">
                    <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                    </svg>
                    {item}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]"
              >
                Contact Us
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
              >
                Add Your Recurring Event
              </Button>
            </div>
          </div>
        </div>

        <ContactForm isOpen={isContactFormOpen} onClose={() => setIsContactFormOpen(false)} />
        <EventSubmissionForm isOpen={isFormOpen} onClose={() => setIsFormOpen(false)} />
      </div>
    </div>
  )
}
