import Link from "next/link"
import { Calendar, Users, Music, School, ShoppingBag, Trophy, MapPin, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import the server actions at the top of the file
import { getWeekEvents } from "./actions/calendar-events"

// Add the imports for our components
import WeekendEventsHighlight from "@/components/weekend-events-highlight"
import EventCard from "@/components/event-card"

// Update the Home component to be async so we can fetch the events
export default async function Home() {
  try {
    // Your calendar ID
    const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"

    // Fetch the week's events
    const weekEvents = await getWeekEvents(calendarId)

    // Format the event date and time for display
    const formatEventDateTime = (event: any) => {
      if (!event) return { date: "No upcoming events", time: "" }

      const start = event.start.dateTime ? new Date(event.start.dateTime) : new Date(event.start.date)

      // For all-day events (no time specified)
      if (!event.start.dateTime) {
        return {
          date: start.toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
          time: "All day",
        }
      }

      // For events with specific times
      return {
        date: start.toLocaleDateString("en-AU", { weekday: "long", year: "numeric", month: "long", day: "numeric" }),
        time: start.toLocaleTimeString("en-AU", { hour: "2-digit", minute: "2-digit" }),
      }
    }

    // Format the events for display
    const formattedWeekEvents = weekEvents.map((event: any) => ({
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

    // Combine with static featured events
    const featuredEvents = [
      ...formattedWeekEvents,
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

    return (
      <div className="min-h-screen bg-gray-50">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-green-600 to-yellow-500 text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome to Bachata Australia</h1>
              <p className="text-xl mb-8">
                Your one-stop destination for Bachata events, classes, and community across Australia.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/events">
                  <Button size="lg" className="bg-white text-green-700 hover:bg-gray-100">
                    Explore Events
                  </Button>
                </Link>
                <Link href="/community">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Join the Community
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <FeatureCard
                icon={<Music className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
                title="Events"
                description="Find Bachata events near you"
                link="/events"
              />
              <FeatureCard
                icon={<School className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
                title="Schools"
                description="Learn from the best instructors"
                link="/schools"
              />
              <FeatureCard
                icon={<Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-blue-500" />}
                title="Competitions"
                description="Show off your skills"
                link="/competitions"
              />
              <FeatureCard
                icon={<MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-purple-500" />}
                title="Locations"
                description="Find dance venues near you"
                link="/locations"
              />
              <FeatureCard
                icon={<ShoppingBag className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
                title="Shop"
                description="Get dance shoes, clothing, and accessories"
                link="/shop"
              />
              <FeatureCard
                icon={<Users className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
                title="Community"
                description="Connect with fellow Bachata dancers"
                link="/community"
              />
              <FeatureCard
                icon={<Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
                title="Calendar"
                description="View all upcoming events in one place"
                link="/calendar"
              />
            </div>
          </div>
        </section>

        {/* Featured Events */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-12">Featured Events This Week</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          </div>
        </section>
      </div>
    )
  } catch (error) {
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
