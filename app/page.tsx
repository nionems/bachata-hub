"use client"

import Link from "next/link"
import { unstable_noStore as noStore } from 'next/cache'

// Force dynamic rendering to prevent caching
export const dynamic = 'force-dynamic'
import { Calendar, Users, Music, School, ShoppingBag, Trophy, MapPin, Clock, Video, Info, Headphones, Film, Building2, Lightbulb, ChevronRight, ChevronLeft, ExternalLink, ZoomIn } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { School as SchoolType } from '@/types/school'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { CloudinaryImage } from "@/components/cloudinary-image"
import { ImageModal } from "@/components/image-modal"
import { getWeekEvents } from "./actions/calendar-events"
import WeekendEventsHighlight from "@/components/weekend-events-highlight"
import EventCard from "@/components/event-card"
import { getEventImage } from '@/lib/event-images'
import { useStateFilter } from '@/hooks/useStateFilter'
import { LoadingSpinner } from "@/components/loading-spinner"
import { IdeaBoxForm } from '@/components/IdeaBoxForm'
import { StickyEventBar } from '@/components/StickyEventBar'
import { CommunityJoinPopup } from '@/components/CommunityJoinPopup'
import { EventSubmissionForm } from '@/components/EventSubmissionForm'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

// Add this interface at the top of your file
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

// Add these helper functions
const getUserLocation = async (): Promise<{ city: string; state: string } | null> => {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject)
    })

    const { latitude, longitude } = position.coords
    const response = await fetch(
      `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`
    )
    const data = await response.json()

    if (data.results && data.results.length > 0) {
      const components = data.results[0].components
      return {
        city: components.city || components.suburb || '',
        state: components.state || ''
      }
    }
    return null
  } catch (error) {
    console.error('Error getting location:', error)
    return null
  }
}

const filterEventsByLocation = (events: Event[], userLocation: { city: string; state: string } | null) => {
  if (!userLocation) return events

  return events.filter(event => {
    const eventLocation = event.location.toLowerCase()
    return eventLocation.includes(userLocation.city.toLowerCase()) ||
           eventLocation.includes(userLocation.state.toLowerCase())
  })
}

function convertGoogleDriveUrl(url: string): string {
  // Check if it's already in the correct format
  if (url.includes('uc?export=view&id=')) {
    return url
  }
  
  // Handle different Google Drive URL formats
  if (url.includes('drive.google.com')) {
    if (url.includes('/file/d/')) {
      // Extract file ID from URL like https://drive.google.com/file/d/FILE_ID/view
      const fileId = url.split('/file/d/')[1].split('/')[0]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    } else if (url.includes('id=')) {
      // Extract file ID from URL containing id= parameter
      const fileId = url.split('id=')[1].split('&')[0]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }
  return url // Return original URL if it's not a Google Drive URL
}

/**
 * Home Page Component
 * This is the main landing page that displays:
 * - Hero section with call-to-action buttons
 * - Feature cards for different sections
 * - Featured events from Google Calendar
 */
export default function Home() {
  const [schools, setSchools] = useState<SchoolType[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [isIdeaBoxOpen, setIsIdeaBoxOpen] = useState(false)
  const [isCommunityPopupOpen, setIsCommunityPopupOpen] = useState(false)
  const [isEventSubmissionOpen, setIsEventSubmissionOpen] = useState(false)

  // Show community popup only on first visit (per browser/device)
  useEffect(() => {
    const hasDismissed = localStorage.getItem('communityPopupDismissed');
    console.log('Checking popup trigger - hasDismissed:', hasDismissed);
    if (!hasDismissed) {
      console.log('Setting popup timer - will show in 3 seconds');
      const timer = setTimeout(() => {
        console.log('Popup timer triggered - setting isCommunityPopupOpen to true');
        setIsCommunityPopupOpen(true);
      }, 3000);
      return () => clearTimeout(timer);
    } else {
      console.log('Popup already dismissed - not showing');
    }
  }, []);

  // Handler to close the popup and set the dismissed flag
  const handleCommunityPopupClose = () => {
    console.log('Closing popup and setting dismissed flag');
    localStorage.setItem('communityPopupDismissed', 'true');
    setIsCommunityPopupOpen(false);
  };

  const { selectedState, setSelectedState, filteredItems: filteredEvents, isGeoLoading, error: geoError } = useStateFilter(events, { useGeolocation: true })

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true)
        const weekEvents = await getWeekEvents()
        console.log('Fetched events:', weekEvents)
        const formattedEvents = formatEvents(weekEvents)
        console.log('Formatted events:', formattedEvents)
        setEvents(formattedEvents)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
      } finally {
        setLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const formatEventDateTime = (event: any) => {
    if (!event) return { date: "No upcoming events", time: "" }

    const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date)

    if (!event.start.dateTime) {
      return {
        date: start.toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        time: "All day",
      }
    }

    return {
      date: start.toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
      time: start.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
    }
  }

  const formatEvents = (weekEvents: any[]) => {
    console.log('Raw events:', weekEvents)
    const formattedWeekEvents = weekEvents.map(event => {
      // Get the image URL from the event
      let imageUrl = event.image || ''
      console.log('Original image URL:', imageUrl)

      // Check description for Google Drive URL if no image URL exists
      if (!imageUrl && event.description) {
        // Look for Google Drive URLs
        const driveMatch = event.description.match(/https:\/\/drive\.google\.com\/[^\s"']+/)
        if (driveMatch) {
          const driveUrl = driveMatch[0].trim()
          // Convert Google Drive URL to direct image URL
          const fileId = driveUrl.match(/\/d\/([^\/]+)/)?.[1] || driveUrl.match(/id=([^&]+)/)?.[1]
          if (fileId) {
            // Use the correct Google Drive image URL format
            imageUrl = `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
            console.log('Found and converted Google Drive URL:', imageUrl)
          }
        }
      }

      // Clean the image URL if it exists
      if (imageUrl) {
        // Remove any HTML tags
        imageUrl = imageUrl.replace(/<[^>]*>/g, '')
        // Remove any URL-encoded characters
        imageUrl = imageUrl.replace(/%3E/g, '')
        // Remove any quotes
        imageUrl = imageUrl.replace(/["']/g, '')
        // Trim whitespace
        imageUrl = imageUrl.trim()
        // Take only the first part if there are multiple URLs
        imageUrl = imageUrl.split(' ')[0]
        console.log('Cleaned image URL:', imageUrl)
      }

      // Format all events to have the same structure
      const formattedEvent = {
        id: event.id || event.iCalUID,
        name: event.summary || 'Untitled Event',
        date: event.start.dateTime ? new Date(event.start.dateTime).toLocaleDateString('en-AU', { 
          weekday: 'long', 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        }) : event.start.date,
        time: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString('en-AU', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }) : 'All day',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
        location: event.location || "Location TBA",
        state: (() => {
          const location = event.location || '';
          // Try to extract state from location
          const stateMatch = location.match(/\b(NSW|VIC|QLD|WA|SA|TAS|ACT|NT|New South Wales|Victoria|Queensland|Western Australia|South Australia|Tasmania|Australian Capital Territory|Northern Territory)\b/i);
          if (stateMatch) {
            const state = stateMatch[0].toUpperCase();
            // Map full state names to abbreviations
            const stateMap: { [key: string]: string } = {
              'NEW SOUTH WALES': 'NSW',
              'VICTORIA': 'VIC',
              'QUEENSLAND': 'QLD',
              'WESTERN AUSTRALIA': 'WA',
              'SOUTH AUSTRALIA': 'SA',
              'TASMANIA': 'TAS',
              'AUSTRALIAN CAPITAL TERRITORY': 'ACT',
              'NORTHERN TERRITORY': 'NT'
            };
            return stateMap[state] || state;
          }
          return "TBA";
        })(),
        address: event.location || "TBA",
        eventLink: event.htmlLink || "",
        price: "TBA",
        ticketLink: "",
        imageUrl: imageUrl || '/images/placeholder.svg',
        comment: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
        googleMapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`
      }
      console.log('Formatted event:', formattedEvent)
      return formattedEvent
    })

    console.log('All formatted events:', formattedWeekEvents)
    return formattedWeekEvents
  }

  // Add this carousel settings object before your Home component
  const settings = {
    dots: false,
    infinite: filteredEvents.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, filteredEvents.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, filteredEvents.length),
          slidesToScroll: 1,
        }
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  }

  // Custom arrow components
  function CustomNextArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
        onClick={onClick}
      >
        <ChevronRight className="h-6 w-6 text-primary" />
      </div>
    );
  }

  function CustomPrevArrow(props: any) {
    const { onClick } = props;
    return (
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 cursor-pointer bg-white/80 hover:bg-white rounded-full p-2 shadow-lg"
        onClick={onClick}
      >
        <ChevronLeft className="h-6 w-6 text-primary" />
      </div>
    );
  }

  // Add this function to get the best event link (excluding Google Drive links)
  const getEventLink = (event: Event) => {
    // First check if there are any links in the description
    if (event.description) {
      // Look for various event platform links in the description
      const linkPatterns = [
        /https:\/\/[^\s"']*(facebook\.com|fb\.com)[^\s"']*/i,
        /https:\/\/[^\s"']*(trybooking\.com|humanitix\.com|eventbrite\.com|ticketek\.com|ticketmaster\.com)[^\s"']*/i,
        /https:\/\/[^\s"']*(instagram\.com|ig\.com)[^\s"']*/i,
        /https:\/\/[^\s"']*(meetup\.com)[^\s"']*/i,
        /https:\/\/[^\s"']*(eventbrite\.com)[^\s"']*/i
      ]
      
      for (const pattern of linkPatterns) {
        const match = event.description.match(pattern)
        if (match && !match[0].includes('drive.google.com')) {
          return match[0].trim()
        }
      }
    }
    
    // Fallback to ticketLink or eventLink if no description links found
    if (event.ticketLink && !event.ticketLink.includes('drive.google.com')) {
      return event.ticketLink
    }
    if (event.eventLink && !event.eventLink.includes('drive.google.com') && !event.eventLink.includes('calendar.google.com')) {
      return event.eventLink
    }
    return null
  }

  // Add this function to handle event link clicks
  const handleEventLinkClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    const link = getEventLink(event)
    if (link) {
      window.open(link, '_blank')
    }
  }

  // Add this function to handle event clicks
  const handleEventClick = (event: Event) => {
    if (event.eventLink) {
      window.open(event.eventLink, '_blank')
    }
  }

  // Add this function to handle image clicks
  const handleImageClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedImage({
      url: event.imageUrl,
      title: event.name
    })
    setIsImageModalOpen(true)
  }

  if (loading) return <LoadingSpinner message="Loading events..." />
  if (error) return <LoadingSpinner message={`Error: ${error}`} color="red" />

  try {
    return (
      <main className="min-h-screen">
        
        {/* Hero Section - Full height on mobile */}
        <section className="relative h-[25vh] sm:h-[35vh] md:h-[28vh] lg:h-[35vh]">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="container mx-auto px-0 relative z-10 h-full flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center">
              <p className="text-xs sm:text-base md:text-lg lg:text-xl text-white/90 text-center comic-neue px-4 mt-8 sm:mt-12 md:mt-16 lg:mt-20">
                Your Bachata Guide in Australia & more...
              </p>
              <div className="flex items-center justify-center gap-1 sm:gap-2 md:gap-4 relative w-full px-2 sm:px-4 md:px-8">
                <Link href="/events" className="w-24 sm:w-28 md:w-36 ml-4 sm:ml-12 md:ml-24">
                  <Button size="sm" className="w-full bg-white text-primary hover:bg-gray-100 text-xs sm:text-sm whitespace-nowrap">
                    Explore Events
                  </Button>
                </Link>
                <Image
                  src="/images/BACHATA.AU (13).png"
                  alt="Bachata Australia Logo"
                  width={400}
                  height={400}
                  quality={90}
                  priority
                  className="w-40 h-40 sm:w-48 sm:h-48 md:w-80 md:h-80 relative z-10 -mt-2 sm:-mt-4 md:-mt-6"
                  style={{ 
                    objectFit: 'contain', 
                    mixBlendMode: 'multiply',
                    maxWidth: '100%',
                    height: 'auto'
                  }}
                />
                <Link href="/community" className="w-24 sm:w-28 md:w-36 mr-4 sm:mr-12 md:mr-24">
                  <Button size="sm" className="w-full bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white text-xs sm:text-sm whitespace-nowrap shadow-lg hover:shadow-xl transition-all duration-200">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="max-w-3xl mx-auto text-center mt-2 sm:mt-4">
              {/* Social media and support links - Hidden on mobile */}
              <div className="mt-2 sm:mt-4 hidden sm:flex flex-col items-center gap-1">
              </div>
            </div>
            {/* Sticky Event Bar - Last element in gradient header */}
            <StickyEventBar />
          </div>
        </section>

        {/* Featured Events This Week - Carousel */}
        <section className="py-4 sm:py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Featured Events This Week
              {selectedState !== 'all' && ` in ${selectedState}`}
            </h2>
            {loading ? (
              <div className="flex justify-center items-center py-8">
                <div className="text-center">
                  <LoadingSpinner size="lg" />
                  <p className="mt-4 text-gray-600">Loading events from across Australia...</p>
                </div>
              </div>
            ) : filteredEvents.length > 0 ? (
              <div className="relative">
                <Slider {...settings}>
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="px-1 md:px-2">
                      <div 
                        className="bg-gradient-to-r from-emerald-400 to-violet-500 p-1 rounded-lg shadow-lg overflow-hidden relative h-72"
                      >
                        <div className="relative w-full h-full bg-white">
                          {event.imageUrl && event.imageUrl !== '/images/placeholder.svg' ? (
                            <div 
                              className="relative w-full h-full bg-gradient-to-r from-emerald-400 to-violet-500 overflow-hidden flex items-start justify-center cursor-pointer"
                              onClick={(e) => handleImageClick(event, e)}
                            >
                              <div className="relative w-full h-full">
                                <Image
                                  src={event.imageUrl}
                                  alt={event.name}
                                  fill
                                  loading="lazy"
                                  className="object-contain object-top rounded-lg"
                                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                  onError={(e) => {
                                    console.error('Error loading image:', event.imageUrl)
                                    const target = e.target as HTMLImageElement
                                    target.src = '/images/placeholder.svg'
                                  }}
                                />
                                {/* Day overlay on top of image */}
                                <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold">
                                  {(() => {
                                    try {
                                      const eventDate = new Date(event.date);
                                      return eventDate.toLocaleDateString('en-US', { weekday: 'long' });
                                    } catch {
                                      return 'TBD';
                                    }
                                  })()}
                                </div>
                              </div>
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                                <h3 className="text-base font-semibold text-white mb-0.5 line-clamp-1">{event.name}</h3>
                                <div className="flex items-center gap-2 text-white/90 text-xs mb-0.5">
                                  <span>{event.date}</span>
                                  {event.time && event.time !== 'All day' && (
                                    <>
                                      <span>•</span>
                                      <span>{event.time}</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-white/90 text-xs line-clamp-1">{event.location}</p>
                              </div>
                              {/* Event Link Button */}
                              {getEventLink(event) && (
                                <div className="absolute top-3 right-3">
                                  <Button
                                    size="sm"
                                    className="bg-gradient-to-r from-emerald-400 to-violet-500 hover:from-emerald-500 hover:to-violet-600 text-white text-xs h-8 px-3 flex items-center gap-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold border-0"
                                    onClick={(e) => handleEventLinkClick(event, e)}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>Event</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="w-full h-full bg-white flex flex-col justify-between relative">
                              {/* Day overlay on top of no-image cards */}
                              <div className="absolute top-3 left-3 bg-black/70 text-white px-3 py-1 rounded-md text-sm font-semibold z-10">
                                {(() => {
                                  try {
                                    const eventDate = new Date(event.date);
                                    return eventDate.toLocaleDateString('en-US', { weekday: 'long' });
                                  } catch {
                                    return 'TBD';
                                  }
                                })()}
                              </div>
                              <div>
                                <h3 className="text-base font-semibold text-gray-900 mb-2 line-clamp-2">{event.name}</h3>
                                <div className="flex items-center gap-2 text-gray-600 text-sm mb-1">
                                  <span>{event.date}</span>
                                  {event.time && event.time !== 'All day' && (
                                    <>
                                      <span>•</span>
                                      <span>{event.time}</span>
                                    </>
                                  )}
                                </div>
                                <p className="text-gray-600 text-sm line-clamp-2">{event.location}</p>
                              </div>
                              {event.description && (
                                <p className="text-gray-500 text-xs line-clamp-3 mt-2">{event.description}</p>
                              )}
                              {/* Event Link Button for no-image cards */}
                              {getEventLink(event) && (
                                <div className="mt-2">
                                  <Button
                                    size="sm"
                                    className="w-full bg-gradient-to-r from-emerald-400 to-violet-500 hover:from-emerald-500 hover:to-violet-600 text-white text-xs h-8 flex items-center justify-center gap-1.5 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold border-0"
                                    onClick={(e) => handleEventLinkClick(event, e)}
                                  >
                                    <ExternalLink className="w-3.5 h-3.5" />
                                    <span>View Event Details</span>
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </Slider>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500 text-sm sm:text-base">
                  {isGeoLoading ? 'Loading events...' : 
                   geoError ? 'Error loading events' :
                   selectedState === 'all' ? 'No events found' : 
                   `No events found in ${selectedState}`}
                </p>
              </div>
            )}
            
            {/* Add Your Event Button */}
            <div className="text-center mt-6 sm:mt-8">
              <Button
                onClick={() => setIsEventSubmissionOpen(true)}
                className="bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 font-semibold text-sm sm:text-base"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Add Your Event
              </Button>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">
                Have an event to share? Submit it here and we'll add it to our calendar!
              </p>
            </div>
          </div>
        </section>

        {/* Features Section - Grid of feature cards */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Feature cards for different sections */}
              <FeatureCard
                icon={<Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />}
                title="Competitions"
                description="Show off your skills"
                link="/competitions"
              />
              <FeatureCard
                icon={<MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />}
                title="Festivals"
                description="Find Bachata festivals"
                link="/festivals"
              />
              <FeatureCard
                icon={<Film className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />}
                title="Media"
                description="Watch Bachata videos"
                link="/media"
              />
              <FeatureCard
                icon={<Headphones className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />}
                title="DJs"
                description="Find Bachata DJs"
                link="/djs"
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
                title="Instructors"
                description="Connect with instructors"
                link="/instructors"
              />
              <FeatureCard
                icon={<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
                title="Events"
                description="Find Bachata events"
                link="/events"
              />
              <FeatureCard
                icon={<School className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                title="Schools"
                description="Find your school"
                link="/schools"
              />
              <FeatureCard
                icon={<ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                title="Marketplace"
                description="Find dance shoes,clothing..."
                link="/shop"
              />
              <FeatureCard
                icon={<Calendar className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                title="Calendar"
                description="Find all events"
                link="/calendar"
              />
              <FeatureCard
                icon={<Building2 className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />}
                title="Accoms"
                description="Find places to stay"
                link="/accommodations"
              />
              <FeatureCard
                icon={<Info className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />}
                title="About"
                description="Learn more about us"
                link="/about"
              />
              <FeatureCard
                icon={<Lightbulb className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                title="Idea Box"
                description="Share your ideas"
                onClick={() => setIsIdeaBoxOpen(true)}
                isButton
              />
            </div>
          </div>
        </section>

        {/* Add the IdeaBoxForm component */}
        <IdeaBoxForm
          isOpen={isIdeaBoxOpen}
          onClose={() => setIsIdeaBoxOpen(false)}
        />

        {/* Add the ImageModal component */}
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={selectedImage?.url || ''}
          title={selectedImage?.title || ''}
        />

        {/* Add the CommunityJoinPopup component */}
        <CommunityJoinPopup
          isOpen={isCommunityPopupOpen}
          onClose={handleCommunityPopupClose}
        />

        {/* Add the EventSubmissionForm component */}
        <EventSubmissionForm
          isOpen={isEventSubmissionOpen}
          onClose={() => setIsEventSubmissionOpen(false)}
        />
      </main>
    )
  } catch (error) {
    // Error handling - Display error message if something goes wrong
    console.error("Error in Home component:", error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
          <p className="text-gray-600">Please try again later</p>
        </div>
      </div>
    )
  }
}

/**
 * FeatureCard Component
 * Displays a feature card with an icon, title, description, and link
 */
function FeatureCard({ icon, title, description, link, onClick, isButton }: { icon: React.ReactNode; title: string; description: string; link?: string; onClick?: () => void; isButton?: boolean }) {
  if (isButton) {
    return (
      <button
        type="button"
        onClick={onClick}
        className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center w-full h-full"
      >
        <div className="mb-2 sm:mb-4 flex justify-center">{icon}</div>
        <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{title}</h3>
        <p className="text-gray-600 hidden sm:block text-xs sm:text-sm">{description}</p>
      </button>
    )
  }
  return (
    <Link href={link || '#'} className="w-full h-full">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center w-full h-full">
        <div className="mb-2 sm:mb-4 flex justify-center">{icon}</div>
        <h3 className="text-sm sm:text-lg font-semibold mb-1 sm:mb-2">{title}</h3>
        <p className="text-gray-600 hidden sm:block text-xs sm:text-sm">{description}</p>
      </div>
    </Link>
  )
}
