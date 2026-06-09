"use client"

import { useState, useEffect, useMemo } from 'react'
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp, X, Search, Clock, CalendarPlus, ExternalLink, Heart, UserCheck, Ticket } from "lucide-react"
import { ContactForm } from "@/components/ContactForm"
import { EventSubmissionForm } from "@/components/EventSubmissionForm"
import CalendarMenu from "@/components/calendar-menu"
import { LoadingSpinner } from '@/components/loading-spinner'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// ── Types ────────────────────────────────────────────────────────────────────

interface CalEvent {
  id: string
  name: string
  start: string        // ISO datetime or YYYY-MM-DD
  end?: string
  description: string
  location: string
  htmlLink?: string
  imageUrl: string
  calendarCity: string
  state: string
  danceStyles: string[]
  ticketLink?: string
  likesCount: number
  goingCount: number
  startTime: string    // HH:MM or ''
  endTime: string      // HH:MM or ''
}

// ── City / calendar picker options ───────────────────────────────────────────

const CITY_OPTIONS = [
  { value: 'all',        label: 'All Cities' },
  { value: 'sydney',     label: 'Sydney' },
  { value: 'melbourne',  label: 'Melbourne' },
  { value: 'brisbane',   label: 'Brisbane' },
  { value: 'gold-coast', label: 'Gold Coast' },
  { value: 'adelaide',   label: 'Adelaide' },
  { value: 'perth',      label: 'Perth' },
  { value: 'canberra',   label: 'Canberra' },
  { value: 'darwin',     label: 'Darwin' },
  { value: 'hobart',     label: 'Hobart' },
]

// ── Helpers ──────────────────────────────────────────────────────────────────

function extractDriveImageUrl(description?: string): string {
  if (!description) return ''
  const tagMatch = description.match(/\[image:(https?:\/\/[^\]]+)\]/)
  if (tagMatch) return tagMatch[1]
  const driveMatch = description.match(
    /https?:\/\/drive\.google\.com\/(?:file\/d\/([^/\s?#]+)|open\?[^&\s]*id=([^&\s#]+)|uc\?[^&\s]*id=([^&\s#]+))/
  )
  if (!driveMatch) return ''
  const fileId = driveMatch[1] || driveMatch[2] || driveMatch[3]
  return fileId ? `https://drive.google.com/thumbnail?id=${fileId}&sz=w400` : ''
}

function extractTicketUrl(description?: string, htmlLink?: string): string | undefined {
  if (description) {
    const urlMatch = description.match(/https?:\/\/[^\s\])"]+/)
    if (urlMatch) {
      const url = urlMatch[0]
      if (!/drive\.google\.com|docs\.google\.com|photos\.google\.com|calendar\.google/i.test(url)) {
        return url
      }
    }
  }
  return undefined
}

function detectDanceStyles(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase()
  const styles: string[] = []
  if (/bachata/.test(text)) styles.push('Bachata')
  if (/salsa/.test(text)) styles.push('Salsa')
  if (/kizomba/.test(text)) styles.push('Kizomba')
  if (/zouk/.test(text)) styles.push('Zouk')
  if (/heels/.test(text)) styles.push('Heels')
  if (/reggaeton|reaggeaton/.test(text)) styles.push('Reaggeaton')
  return styles.length > 0 ? styles : ['Bachata']
}

function formatTime(iso: string): string {
  if (!iso || !iso.includes('T')) return ''
  const d = new Date(iso)
  return d.toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit', hour12: true })
}

function formatDateHeader(dateStr: string): string {
  const d = new Date(dateStr + (dateStr.length === 10 ? 'T00:00:00' : ''))
  return d.toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
}

function formatDatePill(iso: string): string {
  const d = new Date(iso.includes('T') ? iso : iso + 'T00:00:00')
  return d.toLocaleDateString('en-AU', { weekday: 'short', day: 'numeric', month: 'short' })
}

function buildCalUrl(event: CalEvent): string {
  const fmtDt = (iso: string) => iso.replace(/[-:]/g, '').replace(/\.\d+/, '').slice(0, 15) + 'Z'
  const start = event.start.includes('T') ? event.start : event.start + 'T00:00:00Z'
  const end = event.end
    ? (event.end.includes('T') ? event.end : event.end + 'T00:00:00Z')
    : (event.start.includes('T') ? event.start.replace(/T\d{2}/, m => `T${String(parseInt(m.slice(1)) + 2).padStart(2, '0')}`) : event.start + 'T02:00:00Z')
  let url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(event.name)}`
  url += `&dates=${fmtDt(start)}/${fmtDt(end)}`
  if (event.location) url += `&location=${encodeURIComponent(event.location)}`
  return url
}

function mapRawToCalEvent(raw: any): CalEvent {
  const desc = raw.description || ''
  const imageUrl = extractDriveImageUrl(desc)
  const startTime = raw.start?.includes('T') ? formatTime(raw.start) : ''
  const endTime = raw.end?.includes('T') ? formatTime(raw.end) : ''
  return {
    id: raw.id || `cal_${raw.title?.slice(0, 20)}_${raw.start?.slice(0, 10)}`,
    name: raw.title || 'Untitled',
    start: raw.start || '',
    end: raw.end,
    description: desc.replace(/\[image:[^\]]+\]/g, '').trim(),
    location: raw.location || '',
    htmlLink: raw.htmlLink,
    imageUrl,
    calendarCity: raw.calendarCity || 'main',
    state: raw.state || '',
    danceStyles: detectDanceStyles(raw.title || '', desc),
    ticketLink: extractTicketUrl(desc),
    likesCount: 0,
    goingCount: 0,
    startTime,
    endTime,
  }
}

const AT_THE_DOOR = ['bachateame', 'salsachata']

// ── Component ────────────────────────────────────────────────────────────────

export default function EventsPage() {
  const [rawEvents, setRawEvents] = useState<CalEvent[]>([])
  const [likeCounts, setLikeCounts] = useState<Record<string, number>>({})
  const [goingCounts, setGoingCounts] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const [likedEvents, setLikedEvents] = useState<Set<string>>(new Set())
  const [goingEvents, setGoingEvents] = useState<Set<string>>(new Set())
  const [goingConfirmEventId, setGoingConfirmEventId] = useState<string | null>(null)
  const [notTodayEventId, setNotTodayEventId] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCity, setSelectedCity] = useState("all")
  const [selectedDanceStyle, setSelectedDanceStyle] = useState("all")

  // ── Fetch calendar events ─────────────────────────────────────────────────

  useEffect(() => {
    const fetchEvents = async () => {
      setError(null)

      // Show stale cache instantly for repeat visitors
      try {
        const raw = localStorage.getItem('bachata_cal_events_v2')
        if (raw) {
          const { data, ts } = JSON.parse(raw)
          if (Date.now() - ts < 10 * 60 * 1000) {
            setRawEvents(data)
            setIsLoading(false)
          }
        }
      } catch {}

      try {
        const res = await fetch('/api/calendar/upcoming')
        if (!res.ok) throw new Error('Failed to fetch')
        const data = await res.json()
        const events: CalEvent[] = data.map(mapRawToCalEvent)
        setRawEvents(events)
        setIsLoading(false)
        try {
          localStorage.setItem('bachata_cal_events_v2', JSON.stringify({ data: events, ts: Date.now() }))
        } catch {}
      } catch (err) {
        console.error('Error fetching calendar events:', err)
        if (rawEvents.length === 0) setError('Failed to load events')
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  // ── Load likes / going counts from Firestore (backend) ───────────────────

  useEffect(() => {
    const getOrCreateUserId = (): string => {
      try {
        let id = localStorage.getItem('bachataUserId')
        if (!id) {
          id = crypto.randomUUID()
          localStorage.setItem('bachataUserId', id)
        }
        return id
      } catch {
        return crypto.randomUUID()
      }
    }

    const userId = getOrCreateUserId()

    try {
      const storedLikes = localStorage.getItem('likedEvents')
      if (storedLikes) setLikedEvents(new Set(JSON.parse(storedLikes)))
      const storedGoing = localStorage.getItem('goingEvents')
      if (storedGoing) setGoingEvents(new Set(JSON.parse(storedGoing)))
    } catch {}

    fetch(`/api/user/interactions?userId=${encodeURIComponent(userId)}`)
      .then(r => r.ok ? r.json() : null)
      .then(data => {
        if (!data) return
        setLikedEvents(new Set<string>(data.likedEvents))
        setGoingEvents(new Set<string>(data.goingEvents))
        try {
          localStorage.setItem('likedEvents', JSON.stringify(data.likedEvents))
          localStorage.setItem('goingEvents', JSON.stringify(data.goingEvents))
        } catch {}
      })
      .catch(() => {})
  }, [])

  // ── Filter + group ────────────────────────────────────────────────────────

  const filteredEvents = useMemo(() => {
    return rawEvents.filter(event => {
      if (selectedCity !== 'all' && event.calendarCity !== selectedCity) return false
      if (selectedDanceStyle !== 'all' && !event.danceStyles.includes(selectedDanceStyle)) return false
      if (searchTerm) {
        const q = searchTerm.toLowerCase()
        if (
          !event.name.toLowerCase().includes(q) &&
          !event.location.toLowerCase().includes(q) &&
          !event.description.toLowerCase().includes(q)
        ) return false
      }
      return true
    })
  }, [rawEvents, selectedCity, selectedDanceStyle, searchTerm])

  // Group events by date (YYYY-MM-DD key, sorted)
  const groupedByDate = useMemo(() => {
    const groups: Record<string, CalEvent[]> = {}
    for (const ev of filteredEvents) {
      const key = ev.start.slice(0, 10)
      if (!groups[key]) groups[key] = []
      groups[key].push(ev)
    }
    return Object.entries(groups).sort(([a], [b]) => a.localeCompare(b))
  }, [filteredEvents])

  const availableDanceStyles = useMemo(() => {
    const styles = new Set<string>()
    rawEvents.forEach(e => e.danceStyles.forEach(s => styles.add(s)))
    return Array.from(styles).sort()
  }, [rawEvents])

  // Auto-select Bachata if available
  useEffect(() => {
    if (availableDanceStyles.includes('Bachata')) setSelectedDanceStyle('Bachata')
  }, [availableDanceStyles])

  // ── Interaction handlers ──────────────────────────────────────────────────

  const toggleLike = async (e: React.MouseEvent, eventId: string, currentCount: number) => {
    e.stopPropagation()
    const isLiked = likedEvents.has(eventId)
    const action = isLiked ? 'unlike' : 'like'
    const newLiked = new Set(likedEvents)
    if (isLiked) newLiked.delete(eventId)
    else newLiked.add(eventId)
    setLikedEvents(newLiked)
    setLikeCounts(prev => ({ ...prev, [eventId]: Math.max(0, (prev[eventId] ?? currentCount) + (isLiked ? -1 : 1)) }))
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
    setGoingCounts(prev => ({ ...prev, [eventId]: Math.max(0, (prev[eventId] ?? currentCount) + (isGoing ? -1 : 1)) }))
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

  const isEventToday = (start: string): boolean => {
    const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Australia/Sydney' })
    return start.slice(0, 10) === today
  }

  const handleGoingClick = (e: React.MouseEvent, event: CalEvent) => {
    e.stopPropagation()
    if (goingEvents.has(event.id)) { performGoing(event.id, event.goingCount); return }
    if (!isEventToday(event.start)) { setNotTodayEventId(event.id); return }
    setGoingConfirmEventId(event.id)
  }

  // ── Render ────────────────────────────────────────────────────────────────

  if (isLoading && rawEvents.length === 0) return <LoadingSpinner message="Loading events..." />
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">

        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Upcoming Bachata Events
          </h1>
          <p className="text-base sm:text-xl text-gray-600">Events across Australia, straight from the calendar</p>
        </div>

        {/* Filters */}
        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:gap-3">

            {/* City / Calendar picker */}
            <div className="w-full sm:w-48">
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="w-full bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="City Calendar" />
                </SelectTrigger>
                <SelectContent>
                  {CITY_OPTIONS.map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Dance style */}
            <div className="w-full sm:w-44">
              <Select value={selectedDanceStyle} onValueChange={setSelectedDanceStyle}>
                <SelectTrigger className="w-full bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Dance Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Styles</SelectItem>
                  {availableDanceStyles.map(style => (
                    <SelectItem key={style} value={style}>{style}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Search */}
            <div className="flex gap-2 flex-1 min-w-0">
              <Input
                type="text"
                placeholder="Search events..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
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

        {/* Event list grouped by date */}
        <div className="flex flex-col gap-3">
          {groupedByDate.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No events found
              {selectedCity !== 'all' && ` for ${CITY_OPTIONS.find(c => c.value === selectedCity)?.label}`}
              {selectedDanceStyle !== 'all' && ` · ${selectedDanceStyle}`}
            </div>
          ) : groupedByDate.map(([dateKey, dayEvents]) => (
            <div key={dateKey}>
              {/* Date header */}
              <div className="flex items-center gap-3 mt-4 mb-2 first:mt-0">
                <span className="text-sm font-bold text-primary uppercase tracking-widest whitespace-nowrap">
                  {formatDateHeader(dateKey)}
                </span>
                <div className="flex-1 h-px bg-primary/20" />
              </div>

              {/* Cards for this date */}
              <div className="flex flex-col gap-3">
                {dayEvents.map(event => (
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
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 p-3 sm:p-4 min-w-0 gap-2">

                      {/* Date + time pill */}
                      <div className="inline-flex items-center gap-1.5 self-start bg-green-100 text-green-800 px-3 py-1 rounded-full">
                        <Clock className="h-3.5 w-3.5 flex-shrink-0" />
                        <span className="text-xs font-bold whitespace-nowrap">{formatDatePill(event.start)}</span>
                        {event.startTime && (
                          <span className="text-[10px] font-medium opacity-70 border-l border-green-300 pl-1.5 whitespace-nowrap">
                            {event.startTime}{event.endTime ? ` – ${event.endTime}` : ''}
                          </span>
                        )}
                      </div>

                      {/* Name */}
                      <h3 className="font-extrabold text-gray-900 text-base sm:text-lg leading-snug">{event.name}</h3>

                      {/* Location */}
                      {event.location && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <MapPin className="h-3.5 w-3.5 flex-shrink-0 text-gray-400" />
                          <span className="truncate">{event.location}</span>
                        </div>
                      )}

                      {/* Dance style badges */}
                      <div className="flex flex-wrap gap-1">
                        {event.danceStyles.map((style, i) => (
                          <span key={i} className="bg-primary/10 text-primary text-[10px] font-semibold px-2 py-0.5 rounded-full">
                            {style}
                          </span>
                        ))}
                      </div>

                      {/* Description */}
                      {event.description && (
                        <div>
                          <p className={`text-xs text-gray-500 leading-relaxed ${expandedDescriptions[event.id] ? '' : 'line-clamp-2'}`}>
                            {event.description}
                          </p>
                          {event.description.length > 100 && (
                            <button
                              onClick={e => { e.stopPropagation(); setExpandedDescriptions(p => ({ ...p, [event.id]: !p[event.id] })) }}
                              className="text-[10px] text-primary hover:text-primary/80 mt-0.5 flex items-center gap-0.5"
                            >
                              {expandedDescriptions[event.id]
                                ? (<>Less <ChevronUp className="h-2.5 w-2.5" /></>)
                                : (<>More <ChevronDown className="h-2.5 w-2.5" /></>)}
                            </button>
                          )}
                        </div>
                      )}

                      <div className="flex-1" />

                      {/* Actions */}
                      <div className="flex items-center gap-2 pt-2 border-t border-gray-100 flex-wrap">
                        {/* Like */}
                        <button
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                            likedEvents.has(event.id)
                              ? 'bg-red-50 text-red-500 border-red-200'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-red-200 hover:bg-red-50 hover:text-red-500'
                          }`}
                          onClick={e => toggleLike(e, event.id, event.likesCount)}
                        >
                          <Heart className={`h-3.5 w-3.5 ${likedEvents.has(event.id) ? 'fill-red-500' : ''}`} />
                          <span>{(likeCounts[event.id] ?? event.likesCount) > 0 ? `${likeCounts[event.id] ?? event.likesCount} ` : ''}Like</span>
                        </button>

                        {/* Going */}
                        <button
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors border ${
                            goingEvents.has(event.id)
                              ? 'bg-green-500 text-white border-green-500'
                              : 'bg-white text-gray-500 border-gray-200 hover:border-green-400 hover:bg-green-50 hover:text-green-600'
                          }`}
                          onClick={e => handleGoingClick(e, event)}
                        >
                          <UserCheck className="h-3.5 w-3.5" />
                          <span>{(goingCounts[event.id] ?? event.goingCount) > 0 ? `${goingCounts[event.id] ?? event.goingCount} ` : ''}I'm Here</span>
                        </button>

                        {/* Ticket / Link */}
                        {AT_THE_DOOR.some(n => event.name.toLowerCase().includes(n)) ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-full">
                            <Ticket className="h-3.5 w-3.5" />
                            At the Door
                          </span>
                        ) : event.ticketLink ? (
                          <a
                            href={event.ticketLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-bold text-white bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-3 py-1.5 rounded-full shadow-sm transition-opacity"
                          >
                            <Ticket className="h-3.5 w-3.5" />
                            Get Ticket
                          </a>
                        ) : event.htmlLink ? (
                          <a
                            href={event.htmlLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={e => e.stopPropagation()}
                            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary bg-primary/10 hover:bg-primary/20 px-3 py-1.5 rounded-full transition-colors"
                          >
                            <ExternalLink className="h-3.5 w-3.5" />
                            More Info
                          </a>
                        ) : null}

                        {/* Add to calendar + Map */}
                        <div className="flex gap-1 ml-auto">
                          <button
                            className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                            onClick={e => { e.stopPropagation(); window.open(buildCalUrl(event), '_blank') }}
                            title="Add to Google Calendar"
                          >
                            <CalendarPlus className="h-4 w-4" />
                          </button>
                          {event.location && (
                            <button
                              className="p-1.5 text-gray-400 hover:text-primary hover:bg-primary/10 rounded-full transition-colors"
                              onClick={e => { e.stopPropagation(); window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location)}`, '_blank') }}
                              title="View on Map"
                            >
                              <MapPin className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Not-today modal */}
        {notTodayEventId && (() => {
          const ev = rawEvents.find(e => e.id === notTodayEventId)
          return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setNotTodayEventId(null)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
                  <Clock className="h-6 w-6 text-amber-500" />
                </div>
                <h2 className="text-lg font-bold text-gray-900 text-center">Not happening today</h2>
                {ev && (
                  <p className="text-sm text-gray-500 text-center">
                    <span className="font-semibold text-gray-700">{ev.name}</span>
                    {' '}is on <span className="font-semibold text-gray-700">{formatDatePill(ev.start)}</span>. Come back on the day!
                  </p>
                )}
                <button className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors" onClick={() => setNotTodayEventId(null)}>
                  Got it
                </button>
              </div>
            </div>
          )
        })()}

        {/* I'm Here confirmation modal */}
        {goingConfirmEventId && (() => {
          const ev = rawEvents.find(e => e.id === goingConfirmEventId)
          return (
            <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={() => setGoingConfirmEventId(null)}>
              <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 flex flex-col items-center gap-4" onClick={e => e.stopPropagation()}>
                <UserCheck className="h-10 w-10 text-green-500" />
                <h2 className="text-lg font-bold text-gray-900 text-center">Are you at the venue?</h2>
                {ev && <p className="text-sm text-gray-500 text-center">Confirm you're currently at <span className="font-semibold text-gray-700">{ev.name}</span></p>}
                <div className="flex gap-3 w-full mt-1">
                  <button className="flex-1 py-2.5 rounded-xl bg-gray-100 text-gray-600 font-semibold text-sm hover:bg-gray-200 transition-colors" onClick={() => setGoingConfirmEventId(null)}>Cancel</button>
                  <button className="flex-1 py-2.5 rounded-xl bg-green-500 text-white font-semibold text-sm hover:bg-green-600 transition-colors" onClick={() => { if (goingConfirmEventId) { const ev = rawEvents.find(e => e.id === goingConfirmEventId); performGoing(goingConfirmEventId, ev?.goingCount ?? 0); setGoingConfirmEventId(null) } }}>
                    Yes, I'm here!
                  </button>
                </div>
              </div>
            </div>
          )
        })()}

        {/* Image modal */}
        {selectedImage && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
            <button className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors" onClick={() => setSelectedImage(null)}>
              <X className="h-8 w-8" />
            </button>
            <img src={selectedImage.url} alt={selectedImage.title} className="max-h-[90vh] max-w-[90vw] object-contain" onClick={e => e.stopPropagation()} />
          </div>
        )}

        <CalendarMenu />

        {/* Submit event CTA */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">Submit Your Event</h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Are you organising a Bachata event? Get featured and reach dancers across Australia!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                {['Reach a wider audience of dance enthusiasts', 'Promote your event to the dance community', 'Connect with dancers across Australia'].map(item => (
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
              <Button onClick={() => setIsContactFormOpen(true)} className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]">
                Contact Us
              </Button>
              <Button onClick={() => setIsFormOpen(true)} className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center">
                Add Your Event
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
