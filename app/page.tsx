'use client'

import Link from "next/link"
import { Calendar, Users, Music, School, ShoppingBag, Trophy, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { School as SchoolType } from '@/types/school'
import Slider from 'react-slick'
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"
import Image from 'next/image'
import { useRouter } from 'next/navigation'

// Import the server actions at the top of the file
import { getWeekEvents } from "./actions/calendar-events"

// Add the imports for our components
import WeekendEventsHighlight from "@/components/weekend-events-highlight"
import EventCard from "@/components/event-card"

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
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([])
  const [userLocation, setUserLocation] = useState<{ city: string; state: string } | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true)
        const calendarId = "bachata.au@gmail.com"
        const weekEvents = await getWeekEvents(calendarId)
        const formattedEvents = formatEvents(weekEvents)
        setEvents(formattedEvents)
      } catch (err) {
        setError('Failed to fetch events')
        console.error('Error fetching events:', err)
      } finally {
        setIsLoading(false)
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
    const formattedWeekEvents = weekEvents.map(event => {
      let imageUrl = '/placeholder.svg'
      
      // if (event.description) {
      //   const imageMatch = event.description.match(/\[image:(.*?)\]/)
      //   if (imageMatch && imageMatch[1]) {
      //     // Convert the Google Drive URL to the correct format
      //     imageUrl = convertGoogleDriveUrl(imageMatch[1].trim())
      //   }
      // }
      if (event.description) {
        const imageMatch = event.description.match(/\[image:(.*?)\]/)
        if (imageMatch && imageMatch[1]) {
          imageUrl = convertGoogleDriveUrl(imageMatch[1].trim())
        }
      }
      function extractImageUrlFromGoogleRedirect(description?: string): string | null {
        if (!description) return null;
        
        // Match the Google image URL redirect format
        const googleImageRegex = /https:\/\/www\.google\.com\/url\?sa=i&url=([^&]+)&psig=[^&]+/i;
        const match = description.match(googleImageRegex);
        
        const extractedUrl = match ? decodeURIComponent(match[1]) : null;
        console.log('Extracted Image URL:', extractedUrl); // Log the URL to inspect
      
        return extractedUrl;
      }
      
      
      const formatEvents = (weekEvents: any[]) => {
        const formattedWeekEvents = weekEvents.map(event => {
          let imageUrl = '/placeholder.svg';
      
          if (event.description) {
            const imageMatch = event.description.match(/\[image:(.*?)\]/);
            if (imageMatch && imageMatch[1]) {
              // Convert the Google Drive URL to the correct format
              imageUrl = convertGoogleDriveUrl(imageMatch[1].trim());
            }
      
            // If Google redirect URL is found in the description, use that
            const extractedImageUrl = extractImageUrlFromGoogleRedirect(event.description);
            if (extractedImageUrl) {
              imageUrl = extractedImageUrl;
            }
          }
      
          return {
            id: event.id || event.iCalUID,
            name: event.summary,
            date: event.start.dateTime ? new Date(event.start.dateTime).toLocaleDateString() : event.start.date,
            time: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString() : 'All day',
            start: event.start.dateTime || event.start.date,
            end: event.end.dateTime || event.end.date,
            description: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
            location: event.location || "Location TBA",
            state: event.location?.split(',').pop()?.trim() || "TBA",
            address: event.location || "TBA",
            eventLink: event.htmlLink || "",
            price: "TBA",
            ticketLink: "",
            imageUrl: imageUrl,
            comment: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
            googleMapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`
          };
        });
      
        return formattedWeekEvents;
      };
      
      

      // Format all events to have the same structure
      return {
        id: event.id || event.iCalUID,
        name: event.summary,
        date: event.start.dateTime ? new Date(event.start.dateTime).toLocaleDateString() : event.start.date,
        time: event.start.dateTime ? new Date(event.start.dateTime).toLocaleTimeString() : 'All day',
        start: event.start.dateTime || event.start.date,
        end: event.end.dateTime || event.end.date,
        description: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
        location: event.location || "Location TBA",
        state: event.location?.split(',').pop()?.trim() || "TBA",
        address: event.location || "TBA",
        eventLink: event.htmlLink || "",
        price: "TBA",
        ticketLink: "",
        imageUrl: imageUrl,
        comment: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
        googleMapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`
      }
    })

    // Return only the formatted events from Google Calendar
    return formattedWeekEvents
  }

  // Add this carousel settings object before your Home component
  const carouselSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
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

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  try {
    return (
      <main className="min-h-screen">
        {/* Hero Section - Full height on mobile */}
        <section className="relative h-[40vh] sm:h-[50vh] md:h-[60vh]">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="container mx-auto px-4 relative z-10 h-full flex items-center">
            <div className="max-w-3xl mx-auto text-center">
              {/* Main heading and description */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 text-white">Bachata Australia</h1>
              <p className="text-base sm:text-lg md:text-xl mb-6 text-white/90">
                Your one-stop destination for Bachata events, classes, and community across Australia.
              </p>
              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/events">
                  <Button size="lg" className="w-full sm:w-auto bg-white text-primary hover:bg-gray-100 text-base sm:text-lg">
                    Explore Events
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" className="w-full sm:w-auto bg-white/20 text-white hover:bg-white/30 text-base sm:text-lg">
                    Join the Community
                  </Button>
                </Link>
              </div>
              {/* Social media link */}
              <div className="mt-4 sm:mt-6">
                <a
                  href="https://instagram.com/bachata.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-200 flex items-center justify-center gap-2 text-sm sm:text-base"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="lucide lucide-instagram"
                  >
                    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                  </svg>
                  Follow us on Instagram
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Events This Week - Carousel */}
        <section className="py-8 sm:py-12 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-6 sm:mb-8 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">Featured Events This Week</h2>
            <div className="relative">
              <Slider {...carouselSettings}>
                {events.map((event) => (
                  <div key={event.id} className="px-2">
                    <div 
                      className="bg-white rounded-xl shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow"
                      onClick={() => handleEventClick(event)}
                    >
                      <div className="relative h-40 sm:h-48">
                        <Image
                          src={event.imageUrl}
                          alt={event.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                          priority
                          unoptimized={true}
                          referrerPolicy="no-referrer"
                          onError={(e: any) => {
                            e.currentTarget.src = '/placeholder.svg'
                          }}
                        />
                      </div>
                      <div className="p-3 sm:p-4">
                        <h3 className="text-lg sm:text-xl font-semibold mb-1 sm:mb-2">{event.name}</h3>
                        <p className="text-sm sm:text-base text-gray-600 mb-1 sm:mb-2">
                          {event.date}
                        </p>
                        <p className="text-sm sm:text-base text-gray-600">{event.location}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </Slider>
            </div>
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
                title="Shop"
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
                icon={<Users className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />}
                title="Forum"
                description="Connect with dancers"
                link="/forum"
              />
            </div>
          </div>
        </section>
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
      <div className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer">
        <div className="mb-4">{icon}</div>
        <h3 className="text-xl font-semibold mb-2">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </Link>
  )
}
