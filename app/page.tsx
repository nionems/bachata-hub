'use client'

import Link from "next/link"
import { Calendar, Users, Music, School, ShoppingBag, Trophy, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from 'react'
import { School as SchoolType } from '@/types/school'

// Import the server actions at the top of the file
import { getWeekEvents } from "./actions/calendar-events"

// Add the imports for our components
import WeekendEventsHighlight from "@/components/weekend-events-highlight"
import EventCard from "@/components/event-card"

/**
 * Home Page Component
 * This is the main landing page that displays:
 * - Hero section with call-to-action buttons
 * - Feature cards for different sections
 * - Featured events from Google Calendar
 */
export default function Home() {
  const [schools, setSchools] = useState<SchoolType[]>([])
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      // Fetch schools
      const schoolsResponse = await fetch('/api/schools')
      if (!schoolsResponse.ok) throw new Error('Failed to fetch schools')
      const schoolsData = await schoolsResponse.json()
      setSchools(schoolsData)

      // Fetch calendar events
      const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"
      const weekEvents = await getWeekEvents(calendarId)
      
      // Format events
      const formattedEvents = formatEvents(weekEvents)
      setEvents(formattedEvents)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

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
    const formattedWeekEvents = weekEvents.map(event => ({
      id: event.id,
      title: event.summary,
      date: formatEventDateTime(event).date,
      time: formatEventDateTime(event).time,
      location: event.location || "Location TBA",
      description: event.description || "No description available",
      image: "/placeholder.svg?height=300&width=600",
      url: event.htmlLink,
      featured: true,
    }))

    // Add static events
    return [
      ...formattedWeekEvents,
      // Static featured events for major festivals
      {
        id: 1,
        title: "Sydney Bachata Festival 2025",
        date: "April 18-20, 2025",
        time: "All day",
        location: "West HQ, Rooty Hill, NSW",
        description:
          "Australia's premier Bachata festival featuring world-class workshops, performances, and a live Bachata concert with international artists.",
        image: "/placeholder.svg?height=300&width=600",
        url: "https://www.bachatafestival.com.au/",
        featured: true,
      },
      {
        id: 2,
        title: "Melbourne Bachata Congress",
        date: "June 15-17, 2025",
        time: "All day",
        location: "Melbourne Convention Centre",
        description:
          "Join us for three days of workshops, performances, and social dancing with international Bachata artists.",
        image: "/placeholder.svg?height=300&width=600",
        url: "https://www.melbournebachata.com/",
        featured: true,
      },
      {
        id: 3,
        title: "Brisbane Bachata Festival",
        date: "August 10-12, 2025",
        time: "All day",
        location: "Brisbane Convention Centre",
        description:
          "Experience the best of Bachata in Brisbane with workshops, performances, and social dancing.",
        image: "/placeholder.svg?height=300&width=600",
        url: "https://www.brisbanebachata.com/",
        featured: true,
      },
    ].slice(0, 6) // Limit to 6 events to avoid overcrowding
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  try {
    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section - Main banner with call-to-action buttons */}
        <section className="relative bg-gradient-to-r from-green-600 to-yellow-500 text-white py-8 min-h-[40vh] flex items-center">
          {/* Background gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-yellow-500"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              {/* Main heading and description */}
              <h1 className="text-2xl md:text-3xl font-bold mb-3">Bachata Australia</h1>
              <p className="text-base mb-4">
                Your one-stop destination for Bachata events, classes, and community across Australia.
              </p>
              {/* Call-to-action buttons */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link href="/events">
                  <Button size="default" className="bg-white text-green-700 hover:bg-gray-100">
                    Explore Events
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="default" className="bg-white/20 text-white hover:bg-white/30">
                    Join the Community
                  </Button>
                </Link>
              </div>
              {/* Social media link */}
              <div className="mt-3">
                <a
                  href="https://instagram.com/bachata.au"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-white hover:text-gray-200 flex items-center justify-center gap-2 text-sm"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
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

        {/* Features Section - Grid of feature cards */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {/* Feature cards for different sections */}
              <FeatureCard
                icon={<Music className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
                title="Events"
                description="Find Bachata events"
                link="/events"
              />
              <FeatureCard
                icon={<MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500" />}
                title="Festivals"
                description="Find Bachata festivals"
                link="/festivals"
              />
              <FeatureCard
                icon={<School className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
                title="Schools"
                description="Find your school"
                link="/schools"
              />
                <FeatureCard
                icon={<Users className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
                title="Instructors"
                description="Connect with instructors"
                link="/instructors"
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />}
                title="Competitions"
                description="Show off your skills"
                link="/competitions"
              />
              
              <FeatureCard
                icon={<ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
                title="Shop"
                description="Find dance shoes,clothing..."
                link="/shop"
              />

              <FeatureCard
                icon={<Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
                title="Calendar"
                description="Find all events"
                link="/calendar"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
                title="Forum"
                description="Connect with dancers"
                link="/forum"
              />
            </div>
          </div>
        </section>

        {/* Featured Events Section - Display of upcoming events */}
        <section className="pt-8 pb-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Events This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {events.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </div>
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
