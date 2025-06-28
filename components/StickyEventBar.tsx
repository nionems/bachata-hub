'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp, Calendar, MapPin, ExternalLink, X, Star } from "lucide-react"
import { getWeekEvents } from "../app/actions/calendar-events"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../firebase/config'

interface Event {
  id: string
  name: string
  date: string
  time: string
  start: string
  end: string
  description: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  imageUrl: string
  comment: string
  googleMapLink: string
}

interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  price?: string
  description?: string
  imageUrl?: string
  websiteUrl?: string
  ticketLink?: string
  googleMapLink?: string
  eventLink?: string
  comment?: string
  featured?: 'yes' | 'no'
}

export function StickyEventBar() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [nextEvent, setNextEvent] = useState<Event | null>(null)
  const [featuredFestival, setFeaturedFestival] = useState<Festival | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // First, try to fetch featured festivals
        const festivalsCollection = collection(db, 'festivals')
        const festivalsSnapshot = await getDocs(festivalsCollection)
        const festivalsList = festivalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Festival[]

        console.log('All festivals fetched:', festivalsList.map(f => ({ name: f.name, featured: f.featured, startDate: f.startDate })))

        // Find the next upcoming featured festival
        const now = new Date()
        console.log('Current date:', now)
        
        // First, let's see all featured festivals regardless of date
        const allFeaturedFestivals = festivalsList.filter(festival => festival.featured === 'yes')
        console.log('All featured festivals (regardless of date):', allFeaturedFestivals)
        
        const upcomingFeaturedFestivals = festivalsList.filter(festival => {
          if (festival.featured !== 'yes') {
            console.log(`Festival ${festival.name} is not featured (${festival.featured})`)
            return false
          }
          const festivalDate = new Date(festival.startDate)
          console.log(`Festival ${festival.name} date:`, festivalDate, 'is future:', festivalDate > now)
          return festivalDate > now
        })

        console.log('Upcoming featured festivals found:', upcomingFeaturedFestivals)

        // For testing: if no upcoming featured festivals, show any featured festival
        const festivalsToShow = upcomingFeaturedFestivals.length > 0 ? upcomingFeaturedFestivals : allFeaturedFestivals
        console.log('Festivals to show:', festivalsToShow)

        if (festivalsToShow.length > 0) {
          // Sort by date and take the first one
          festivalsToShow.sort((a, b) => {
            const dateA = new Date(a.startDate)
            const dateB = new Date(b.startDate)
            return dateA.getTime() - dateB.getTime()
          })
          
          console.log('Setting featured festival:', festivalsToShow[0])
          setFeaturedFestival(festivalsToShow[0])
          setLoading(false)
          return
        }

        console.log('No upcoming featured festivals found, falling back to events')

        // If no featured festivals, fall back to regular events
        const weekEvents = await getWeekEvents()
        if (weekEvents && weekEvents.length > 0) {
          // Find the next upcoming event
          const upcomingEvents = weekEvents.filter((event: any) => {
            const eventDate = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date)
            return eventDate > now
          })
          
          if (upcomingEvents.length > 0) {
            // Sort by date and take the first one
            upcomingEvents.sort((a: any, b: any) => {
              const dateA = a.start.dateTime ? new Date(a.start.dateTime) : new Date(a.start.date)
              const dateB = b.start.dateTime ? new Date(b.start.dateTime) : new Date(b.start.date)
              return dateA.getTime() - dateB.getTime()
            })
            
            const nextEventData = upcomingEvents[0]
            const formattedEvent: Event = {
              id: nextEventData.id || nextEventData.iCalUID,
              name: nextEventData.summary || 'Untitled Event',
              date: nextEventData.start.dateTime ? 
                new Date(nextEventData.start.dateTime).toLocaleDateString('en-AU', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                }) :
                new Date(nextEventData.start.date).toLocaleDateString('en-AU', { 
                  weekday: 'short', 
                  month: 'short', 
                  day: 'numeric' 
                }),
              time: nextEventData.start.dateTime ? 
                new Date(nextEventData.start.dateTime).toLocaleTimeString('en-AU', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                }) : 'All day',
              start: nextEventData.start.dateTime || nextEventData.start.date,
              end: nextEventData.end.dateTime || nextEventData.end.date,
              description: nextEventData.description || '',
              location: nextEventData.location || '',
              state: '',
              address: '',
              eventLink: nextEventData.htmlLink || '',
              price: '',
              ticketLink: '',
              imageUrl: nextEventData.image || '',
              comment: '',
              googleMapLink: ''
            }
            setNextEvent(formattedEvent)
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || (!nextEvent && !featuredFestival)) {
    return null
  }

  const getEventLink = (event: Event) => {
    return event.eventLink || event.ticketLink || null
  }

  const getFestivalLink = (festival: Festival) => {
    return festival.eventLink || festival.ticketLink || festival.websiteUrl || null
  }

  const handleEventClick = () => {
    if (featuredFestival) {
      const link = getFestivalLink(featuredFestival)
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
      }
    } else if (nextEvent) {
      const link = getEventLink(nextEvent)
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
      }
    }
  }

  const formatFestivalDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-AU', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      })
    } catch (error) {
      return dateString
    }
  }

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-r from-primary/90 to-secondary/90 text-white shadow-lg backdrop-blur-sm">
      {/* Collapsed State */}
      {!isExpanded && (
        <div 
          className="px-2 py-1 cursor-pointer hover:bg-white/10 transition-colors"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {featuredFestival ? (
                <Star className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span className="text-xs font-medium">
                {featuredFestival ? (
                  `Featured Festival: ${featuredFestival.name} - ${formatFestivalDate(featuredFestival.startDate)}`
                ) : (
                  `Next Major Event: ${nextEvent!.name} - ${nextEvent!.date}`
                )}
              </span>
            </div>
            <ChevronUp className="h-3 w-3" />
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div className="px-2 py-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              {featuredFestival ? (
                <Star className="h-3 w-3" />
              ) : (
                <Calendar className="h-3 w-3" />
              )}
              <span className="text-xs font-semibold">
                {featuredFestival ? 'Featured Festival' : 'Next Major Event'}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {(featuredFestival && getFestivalLink(featuredFestival)) || (nextEvent && getEventLink(nextEvent)) ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-5 px-1.5 text-xs bg-white/20 hover:bg-white/30"
                  onClick={handleEventClick}
                >
                  <ExternalLink className="h-2.5 w-2.5 mr-0.5" />
                  View
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 p-0 text-white hover:bg-white/20"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-2.5 w-2.5" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-0.5">
            <h3 className="text-xs font-semibold">
              {featuredFestival ? featuredFestival.name : nextEvent!.name}
            </h3>
            <div className="flex items-center gap-3 text-xs text-white/90">
              <div className="flex items-center gap-1">
                <Calendar className="h-2.5 w-2.5" />
                <span>
                  {featuredFestival ? (
                    `${formatFestivalDate(featuredFestival.startDate)}${featuredFestival.endDate && featuredFestival.endDate !== featuredFestival.startDate ? ` - ${formatFestivalDate(featuredFestival.endDate)}` : ''}`
                  ) : (
                    `${nextEvent!.date} at ${nextEvent!.time}`
                  )}
                </span>
              </div>
              {(featuredFestival?.location || nextEvent?.location) && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-2.5 w-2.5" />
                  <span>{featuredFestival ? featuredFestival.location : nextEvent!.location}</span>
                </div>
              )}
            </div>
            {(featuredFestival?.comment || nextEvent?.description) && (
              <p className="text-xs text-white/80 line-clamp-1 mt-0.5">
                {featuredFestival ? featuredFestival.comment : nextEvent!.description.replace(/<[^>]*>/g, '')}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
} 