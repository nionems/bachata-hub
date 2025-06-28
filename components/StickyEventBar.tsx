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
  const [featuredItems, setFeaturedItems] = useState<(Festival | Event)[]>([])
  const [currentItemIndex, setCurrentItemIndex] = useState(0)
  const [loading, setLoading] = useState(true)
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)

  // Minimum swipe distance (in px)
  const minSwipeDistance = 50

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > minSwipeDistance
    const isRightSwipe = distance < -minSwipeDistance

    if (isLeftSwipe && currentItemIndex < featuredItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1)
    }
    if (isRightSwipe && currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1)
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const items: (Festival | Event)[] = []
        
        // Fetch featured festivals only
        const festivalsCollection = collection(db, 'festivals')
        const festivalsSnapshot = await getDocs(festivalsCollection)
        const festivalsList = festivalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Festival[]

        console.log('All festivals fetched:', festivalsList.map(f => ({ name: f.name, featured: f.featured, startDate: f.startDate })))

        // Find featured festivals only
        const now = new Date()
        console.log('Current date:', now)
        
        const featuredFestivals = festivalsList.filter(festival => festival.featured === 'yes')
        console.log('Featured festivals found:', featuredFestivals)
        
        if (featuredFestivals.length > 0) {
          // Sort by date and take up to 3
          featuredFestivals.sort((a, b) => {
            const dateA = new Date(a.startDate)
            const dateB = new Date(b.startDate)
            return dateA.getTime() - dateB.getTime()
          })
          
          // Add up to 3 featured festivals
          const festivalsToAdd = featuredFestivals.slice(0, 3)
          items.push(...festivalsToAdd)
          console.log('Adding featured festivals:', festivalsToAdd.map(f => f.name))
        }

        console.log('Final items to display:', items.map(item => ({ name: item.name, type: 'startDate' in item ? 'festival' : 'event' })))
        setFeaturedItems(items)
        setLoading(false)
      } catch (error) {
        console.error('Error fetching data:', error)
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading || featuredItems.length === 0) {
    return null
  }

  const getEventLink = (event: Event) => {
    return event.eventLink || event.ticketLink || null
  }

  const getFestivalLink = (festival: Festival) => {
    return festival.eventLink || festival.ticketLink || festival.websiteUrl || null
  }

  const handleEventClick = (item: Festival | Event) => {
    if ('startDate' in item) {
      // It's a festival
      const link = getFestivalLink(item)
      if (link) {
        window.open(link, '_blank', 'noopener,noreferrer')
      }
    } else {
      // It's an event
      const link = getEventLink(item)
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
          className="px-2 py-1 cursor-pointer hover:bg-white/10 transition-colors sm:hover:bg-white/10"
          onClick={() => setIsExpanded(true)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 sm:animate-none animate-pulse">
              {/* Image - Show on mobile in collapsed state, always on desktop */}
              <div className="block sm:hidden w-8 h-6 rounded overflow-hidden flex-shrink-0">
                <img
                  src={featuredItems.length > 0 && 'imageUrl' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].imageUrl ? featuredItems[currentItemIndex].imageUrl : '/images/placeholder.svg'}
                  alt={featuredItems.length > 0 ? featuredItems[currentItemIndex].name : 'Event'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder.svg'
                  }}
                />
              </div>
              {/* Image - Only show on desktop */}
              <div className="hidden sm:block sm:w-16 sm:h-12 rounded overflow-hidden flex-shrink-0">
                <img
                  src={featuredItems.length > 0 && 'imageUrl' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].imageUrl ? featuredItems[currentItemIndex].imageUrl : '/images/placeholder.svg'}
                  alt={featuredItems.length > 0 ? featuredItems[currentItemIndex].name : 'Event'}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement
                    target.src = '/images/placeholder.svg'
                  }}
                />
              </div>
              
              {featuredItems.length > 0 ? (
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm font-medium">
                {featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] ? (
                  `${featuredItems[currentItemIndex].name} - ${formatFestivalDate(featuredItems[currentItemIndex].startDate)}`
                ) : (
                  'No Featured Festivals'
                )}
              </span>
            </div>
            <div className="flex items-center gap-1">
              {featuredItems.length > 1 && (
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  {featuredItems.map((_, index) => (
                    <div
                      key={index}
                      className={`w-1.5 h-1.5 rounded-full ${index === currentItemIndex ? 'bg-white' : 'bg-white/40'}`}
                    />
                  ))}
                </div>
              )}
              <ChevronUp className="h-3 w-3" />
            </div>
          </div>
        </div>
      )}

      {/* Expanded State */}
      {isExpanded && (
        <div 
          className="px-2 py-2"
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={onTouchEnd}
        >
          <div className="flex items-center justify-between mb-1 sm:mb-2">
            <div className="flex items-center gap-2 sm:gap-3">
              {featuredItems.length > 0 ? (
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              ) : (
                <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
              )}
              <span className="text-xs sm:text-sm font-semibold">
                Upcoming Event
              </span>
            </div>
            <div className="flex items-center gap-1 sm:gap-2">
              {/* Swipe indicator for mobile when expanded */}
              {featuredItems.length > 1 && (
                <div className="flex sm:hidden items-center gap-1 mr-2">
                  <div className="text-xs text-white/60">Swipe</div>
                  <div className="flex items-center gap-0.5">
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse"></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.2s'}}></div>
                    <div className="w-1 h-1 bg-white/60 rounded-full animate-pulse" style={{animationDelay: '0.4s'}}></div>
                  </div>
                </div>
              )}
              {featuredItems.length > 1 && (
                <div className="hidden sm:flex items-center gap-1 mr-2">
                  {featuredItems.map((_, index) => (
                    <button
                      key={index}
                      onClick={(e) => {
                        e.stopPropagation()
                        setCurrentItemIndex(index)
                      }}
                      className={`w-1.5 h-1.5 rounded-full transition-colors ${index === currentItemIndex ? 'bg-white' : 'bg-white/40 hover:bg-white/60'}`}
                    />
                  ))}
                </div>
              )}
              {featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] && getFestivalLink(featuredItems[currentItemIndex]) ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-5 sm:h-6 px-1.5 sm:px-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30"
                  onClick={() => handleEventClick(featuredItems[currentItemIndex])}
                >
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
                  View
                </Button>
              ) : featuredItems.length > 0 && !('startDate' in featuredItems[currentItemIndex]) && getEventLink(featuredItems[currentItemIndex]) ? (
                <Button
                  size="sm"
                  variant="secondary"
                  className="h-5 sm:h-6 px-1.5 sm:px-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30"
                  onClick={() => handleEventClick(featuredItems[currentItemIndex])}
                >
                  <ExternalLink className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5" />
                  View
                </Button>
              ) : null}
              <Button
                size="sm"
                variant="ghost"
                className="h-5 w-5 sm:h-6 sm:w-6 p-0 text-white hover:bg-white/20"
                onClick={() => setIsExpanded(false)}
              >
                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
              </Button>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            {/* Image - Show on mobile when expanded, always on desktop */}
            <div className="block sm:hidden w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={featuredItems.length > 0 && 'imageUrl' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].imageUrl ? featuredItems[currentItemIndex].imageUrl : '/images/placeholder.svg'}
                alt={featuredItems.length > 0 ? featuredItems[currentItemIndex].name : 'Event'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder.svg'
                }}
              />
            </div>
            {/* Image - Only show on desktop */}
            <div className="hidden sm:block sm:w-32 sm:h-20 rounded-lg overflow-hidden flex-shrink-0">
              <img
                src={featuredItems.length > 0 && 'imageUrl' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].imageUrl ? featuredItems[currentItemIndex].imageUrl : '/images/placeholder.svg'}
                alt={featuredItems.length > 0 ? featuredItems[currentItemIndex].name : 'Event'}
                className="w-full h-full object-cover"
                onError={(e) => {
                  const target = e.target as HTMLImageElement
                  target.src = '/images/placeholder.svg'
                }}
              />
            </div>
            
            {/* Content */}
            <div className="space-y-0.5 sm:space-y-1 flex-1">
              <h3 className="text-xs sm:text-base font-semibold">
                {featuredItems.length > 0 ? featuredItems[currentItemIndex].name : 'Event'}
              </h3>
              <div className="flex items-center gap-3 text-xs sm:text-sm text-white/90">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  <span>
                    {featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] ? (
                      `${formatFestivalDate(featuredItems[currentItemIndex].startDate)}${featuredItems[currentItemIndex].endDate && featuredItems[currentItemIndex].endDate !== featuredItems[currentItemIndex].startDate ? ` - ${formatFestivalDate(featuredItems[currentItemIndex].endDate)}` : ''}`
                    ) : featuredItems.length > 0 && 'date' in featuredItems[currentItemIndex] ? (
                      `${featuredItems[currentItemIndex].date} at ${featuredItems[currentItemIndex].time}`
                    ) : (
                      'Date TBD'
                    )}
                  </span>
                </div>
                {(featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].location) || (featuredItems.length > 0 && !('startDate' in featuredItems[currentItemIndex]) && featuredItems[currentItemIndex].location) ? (
                  <div className="flex items-center gap-1 sm:gap-2">
                    <MapPin className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                    <span>{featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].location ? featuredItems[currentItemIndex].location : (featuredItems.length > 0 && !('startDate' in featuredItems[currentItemIndex]) && featuredItems[currentItemIndex].location ? featuredItems[currentItemIndex].location : '')}</span>
                  </div>
                ) : null}
              </div>
              {(featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].comment) || (featuredItems.length > 0 && !('startDate' in featuredItems[currentItemIndex]) && featuredItems[currentItemIndex].description) ? (
                <p className="text-xs sm:text-sm text-white/80 line-clamp-1 mt-0.5 sm:mt-1">
                  {featuredItems.length > 0 && 'startDate' in featuredItems[currentItemIndex] && featuredItems[currentItemIndex].comment ? featuredItems[currentItemIndex].comment : (featuredItems.length > 0 && !('startDate' in featuredItems[currentItemIndex]) && featuredItems[currentItemIndex].description ? featuredItems[currentItemIndex].description.replace(/<[^>]*>/g, '') : '')}
                </p>
              ) : null}
            </div>
          </div>
        </div>
      )}
    </div>
  )
} 