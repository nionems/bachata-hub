'use client'

import Link from "next/link"
import { Calendar, Users, Music, School, ShoppingBag, Trophy, MapPin, Clock, Video } from "lucide-react"
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

  const { selectedState, setSelectedState, filteredItems: filteredEvents, isGeoLoading, error: geoError } = useStateFilter(events)

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
    dots: true,
    infinite: filteredEvents.length > 3,
    speed: 500,
    slidesToShow: Math.min(3, filteredEvents.length),
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
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

  // Add this handler function
  const handleEventClick = (event: any) => {
    console.log('Clicked event ID:', event.id)
    router.push(`/events/${event.id || event.iCalUID}`)
  }

  // Add this function to handle image clicks
  const handleImageClick = (event: Event) => {
    setSelectedImage({
      url: event.imageUrl,
      title: event.name
    })
    setIsImageModalOpen(true)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  try {
    return (
      <main className="min-h-screen">
        
        {/* Hero Section - Full height on mobile */}
        <section className="relative h-[25vh] sm:h-[35vh] md:h-[28vh]">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="container mx-auto px-0 relative z-10 h-full flex flex-col items-center justify-center">
            <div className="w-full flex flex-col items-center justify-center">
              <p className="text-xs sm:text-base md:text-lg -mb-4 text-white/90 text-center comic-neue px-4">
              Your Bachata Guide in Australia
              </p>
              <div className="flex items-center justify-center gap-2 sm:gap-4 relative w-full px-4 sm:px-8">
                <Link href="/events" className="w-24 sm:w-32 ml-12 sm:ml-24">
                  <Button size="sm" className="w-full bg-white text-primary hover:bg-gray-100 text-xs sm:text-sm whitespace-nowrap">
                    Explore Events
                  </Button>
                </Link>
                <Image
                  src="/images/BACHATA.AU (13).png"
                  alt="Bachata Australia Logo"
                  width={600}
                  height={600}
                  className="w-48 h-48 sm:w-40 sm:h-40 md:w-72 md:h-72 relative z-10"
                  priority
                  style={{ objectFit: 'contain', mixBlendMode: 'multiply' }}
                />
                <Link href="/community" className="w-24 sm:w-32 mr-12 sm:mr-24">
                  <Button size="sm" className="w-full bg-white/20 text-white hover:bg-white/30 text-xs sm:text-sm whitespace-nowrap">
                    Join Community
                  </Button>
                </Link>
              </div>
            </div>
            <div className="max-w-3xl mx-auto text-center mt-4">
              {/* Social media and support links - Hidden on mobile */}
              <div className="mt-2 sm:mt-4 hidden sm:flex flex-col items-center gap-1">
                <a
                  href="https://instagram.com/bachata.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-yellow-300 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Follow us on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events This Week - Carousel */}
        <section className="py-4 sm:py-8 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center mb-3 sm:mb-4 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Featured Events This Week
              {selectedState !== 'all' && ` in ${selectedState}`}
            </h2>
            {filteredEvents.length > 0 ? (
              <div className="relative">
                <Slider {...settings}>
                  {filteredEvents.map((event) => (
                    <div key={event.id} className="px-2">
                      <div 
                        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow relative h-72"
                        onClick={() => handleEventClick(event)}
                      >
                        <div 
                          className="absolute inset-0"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleImageClick(event)
                          }}
                        >
                          {event.imageUrl && event.imageUrl !== '/images/placeholder.svg' ? (
                            <Image
                              src={event.imageUrl}
                              alt={event.name}
                              fill
                              className="object-cover"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                              onError={(e) => {
                                console.error('Error loading image:', event.imageUrl)
                                const target = e.target as HTMLImageElement
                                target.src = '/images/placeholder.svg'
                              }}
                            />
                          ) : (
                            <Image
                              src="/images/placeholder.svg"
                              alt="No image available"
                              fill
                              className="object-contain p-8 bg-white"
                              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                            />
                          )}
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-3">
                          <h3 className="text-base font-semibold text-white mb-0.5 line-clamp-1">{event.name}</h3>
                          <p className="text-white/90 text-xs mb-0.5">{event.date}</p>
                          <p className="text-white/90 text-xs line-clamp-1">{event.location}</p>
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
          </div>
        </section>

        {/* Features Section - Grid of feature cards */}
        <section className="py-8 sm:py-12">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
              {/* Feature cards for different sections */}
              <FeatureCard
                icon={<Music className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
                title="Events"
                description="Find Bachata events"
                link="/events"
              />
              <FeatureCard
                icon={<MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />}
                title="Festivals"
                description="Find Bachata festivals"
                link="/festivals"
              />
              <FeatureCard
                icon={<School className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                title="Schools"
                description="Find your school"
                link="/schools"
              />
              <FeatureCard
                icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
                title="Instructors"
                description="Connect with instructors"
                link="/instructors"
              />
              <FeatureCard
                icon={<Trophy className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />}
                title="Competitions"
                description="Show off your skills"
                link="/competitions"
              />
              <FeatureCard
                icon={<ShoppingBag className="h-6 w-6 sm:h-8 sm:w-8 text-yellow-500" />}
                title="Shops"
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
                icon={<Music className="h-6 w-6 sm:h-8 sm:w-8 text-red-500" />}
                title="DJs"
                description="Find Bachata DJs"
                link="/djs"
              />
              <FeatureCard
                icon={<Video className="h-6 w-6 sm:h-8 sm:w-8 text-purple-500" />}
                title="Media"
                description="Watch Bachata videos"
                link="/media"
              />
              <FeatureCard
                icon={<MapPin className="h-6 w-6 sm:h-8 sm:w-8 text-indigo-500" />}
                title="Accommodations"
                description="Find places to stay"
                link="/accommodations"
              />
            </div>
          </div>
        </section>

        {/* Add the ImageModal component */}
        <ImageModal
          isOpen={isImageModalOpen}
          onClose={() => setIsImageModalOpen(false)}
          imageUrl={selectedImage?.url || ''}
          title={selectedImage?.title || ''}
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
function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link: string }) {
  return (
    <Link href={link}>
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer text-center">
        <div className="mb-4 flex justify-center">{icon}</div>
        <h3 className="text-lg sm:text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600 hidden sm:block text-sm">{description}</p>
      </div>
    </Link>
  )
}
