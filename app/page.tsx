import Link from "next/link"
import { Calendar, Users, Music, School, ShoppingBag, Trophy, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"

// Import the server actions at the top of the file
import { getWeekendEvents } from "./actions/calendar-events"

// Add the imports for our components
import WeekendEventsHighlight from "@/components/weekend-events-highlight"
import EventCard from "@/components/event-card"

// Update the Home component to be async so we can fetch the events
export default async function Home() {
  // Your calendar ID
  const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"

  // Fetch the weekend events
  const weekendEvents = await getWeekendEvents(calendarId)

  // Format the event date and time for display
  const formatEventDateTime = (event) => {
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

  // Format weekend events for display
  const formattedWeekendEvents = weekendEvents.map((event) => {
    const eventDateTime = formatEventDateTime(event)
    return {
      id: event.id,
      title: event.summary || "Bachata Event",
      date: eventDateTime.date,
      time: eventDateTime.time,
      location: event.location || "Location TBA",
      image: event.image || "/placeholder.svg?height=300&width=600",
      url: event.htmlLink || "#",
      website: event.website || null,
    }
  })

  // Create featured events array that includes weekend events
  const featuredEvents = [
    // Include weekend events at the top of the featured events
    ...formattedWeekendEvents,

    // Include your existing featured events
    {
      id: "static-1",
      title: "Sydney Bachata Festival",
      date: "June 15-18, 2025",
      location: "Sydney Opera House",
      image: "/placeholder.svg?height=200&width=400",
    },
    {
      id: "static-2",
      title: "Melbourne Social Dance Night",
      date: "April 10, 2025",
      location: "Dance Studio Melbourne",
      image: "/placeholder.svg?height=200&width=400",
    },
  ].slice(0, 6) // Limit to 6 events total to avoid overcrowding

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section with Australia Map Shadow */}
      <section className="relative h-[60vh] sm:h-[70vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-yellow-500 opacity-90"></div>

        {/* Australia Map Shadow */}
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <svg viewBox="0 0 800 800" width="90%" height="90%" fill="#FFFFFF">
            <path
              d="M550,150 C530,160 520,180 510,200 C500,220 490,240 480,260 
             C470,280 460,300 450,320 C440,340 430,360 420,380 
             C410,400 400,420 390,440 C380,460 370,480 360,500 
             C350,520 340,540 330,560 C320,580 310,600 300,620 
             C290,640 280,660 270,680 C260,700 250,720 240,740 
             C230,760 220,780 210,800 C200,820 190,840 180,860 
             C170,880 160,900 150,920 C140,940 130,960 120,980 
             C110,1000 100,1020 90,1040 C80,1060 70,1080 60,1100 
             C50,1120 40,1140 30,1160 C20,1180 10,1200 0,1220 
             C-10,1240 -20,1260 -30,1280 C-40,1300 -50,320 -60,340 
             C-70,360 -80,380 -90,400 C-100,420 -110,440 -120,460 
             C-130,480 -140,500 -150,520 C-160,540 -170,560 -180,580 
             C-190,600 -200,620 -210,640 C-220,660 -230,680 -240,700 
             C-250,720 -260,740 -270,760 C-280,780 -290,800 -300,820 
             C-310,840 -320,860 -330,880 C-340,900 -350,920 -360,940 
             C-370,960 -380,980 -390,1000 C-400,1020 -410,1040 -420,1060 
             C-430,1080 -440,1100 -450,1120 C-460,1140 -470,1160 -480,1180 
             C-490,1200 -500,1220 -510,1240 C-520,1260 -530,1280 -540,1300 
             C-550,1320 -560,1340 -570,1360 C-580,1380 -590,1400 -600,1420 
             C-610,1440 -620,1460 -630,1480 C-640,1500 -650,1520 -660,1540 
             C-670,1560 -680,1580 -690,1600 C-700,1620 -710,1640 -720,1660 
             C-730,1680 -740,1700 -750,1720 C-760,1740 -770,1760 -780,1780 
             C-790,1800 -800,1820 -810,1840 C-820,1860 -830,1880 -840,1900 
             C-850,1920 -860,1940 -870,1960 C-880,1980 -890,2000 -900,2020"
            />
            <path
              d="M200,200 C220,180 240,160 260,140 C280,120 300,100 320,80 
             C340,60 360,40 380,20 C400,0 420,-20 440,-40 
             C460,-60 480,-80 500,-100 C520,-120 540,-140 560,-160 
             C580,-180 600,-200 620,-220 C640,-240 660,-260 680,-280 
             C700,-300 720,-320 740,-340 C760,-360 780,-380 800,-400 
             C820,-420 840,-440 860,-460 C880,-480 900,-500 920,-520 
             C940,-540 960,-560 980,-580 C1000,-600 1020,-620 1040,-640 
             C1060,-660 1080,-680 1100,-700 C1120,-720 1140,-740 1160,-760 
             C1180,-780 1200,-800 1220,-820 C1240,-840 1260,-860 1280,-880 
             C1300,-900 1320,-920 1340,-940 C1360,-960 1380,-980 1400,-1000 
             C1420,-1020 1440,-1040 1460,-1060 C1480,-1080 1500,-1100 1520,-1120 
             C1540,-1140 1560,-1160 1580,-1180 C1600,-1200 1620,-1220 1640,-1240 
             C1660,-1260 1680,-1280 1700,-1300 C1720,-1320 1740,-1340 1760,-1360 
             C1780,-1380 1800,-1400 1820,-1420 C1840,-1440 1860,-1460 1880,-1480 
             C1900,-1500 1920,-1520 1940,-1540 C1960,-1560 1980,-1580 2000,-1600"
            />
            <path
              d="M300,200 
             C320,220 340,240 360,260 
             C380,280 400,300 420,320 
             C440,340 460,360 480,380 
             C500,400 520,420 540,440 
             C560,460 580,480 600,500 
             C620,520 640,540 660,560 
             C680,580 700,600 720,620 
             C740,640 760,660 780,680 
             C800,700 820,720 840,740 
             C860,760 880,780 900,800"
            />
            <path
              d="M400,300 
             C380,320 360,340 340,360 
             C320,380 300,400 280,420 
             C260,440 240,460 220,480 
             C200,500 180,520 160,540 
             C140,560 120,580 100,600"
            />
            <path
              d="M500,100 
             C520,120 540,140 560,160 
             C580,180 600,200 620,220 
             C640,240 660,260 680,280 
             C700,300 720,320 740,340 
             C760,360 780,380 800,400"
            />
            <path
              d="M600,200 
             C580,220 560,240 540,260 
             C520,280 500,300 480,320 
             C460,340 440,360 420,380 
             C400,400 380,420 360,440 
             C340,460 320,480 300,500"
            />
          </svg>
        </div>

        <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-4 sm:mb-6">
            Bachata Australia
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white mb-6 sm:mb-8 max-w-3xl mx-auto">
            Your ultimate hub for Bachata dancing in Australia
          </p>
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4">
            <Link href="/events">
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black sm:text-base sm:h-10">
                Explore Events
              </Button>
            </Link>
            <Link href="/community">
              <Button size="sm" className="bg-yellow-500 hover:bg-yellow-600 text-black sm:text-base sm:h-10">
                Join Community
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-bold text-center mb-8 sm:mb-12 text-gray-900">
            Everything Bachata in Australia
          </h2>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6 lg:gap-8">
            <FeatureCard
              icon={<Calendar className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
              title="Events & Socials"
              description="Find social dancing events happening near you"
              link="/events"
            />
            <FeatureCard
              icon={<Music className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
              title="Festivals"
              description="Discover upcoming Bachata festivals across Australia"
              link="/festivals"
            />
            <FeatureCard
              icon={<School className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
              title="Schools & Instructors"
              description="Learn from the best Bachata teachers in Australia"
              link="/schools"
            />
            <FeatureCard
              icon={<Trophy className="h-8 w-8 sm:h-10 sm:w-10 text-yellow-500" />}
              title="Jack & Jill Leaderboard"
              description="Track competition rankings and results"
              link="/leaderboard"
            />
            <FeatureCard
              icon={<MapPin className="h-8 w-8 sm:h-10 sm:w-10 text-green-600" />}
              title="Festival Accommodation"
              description="Find places to stay during major festivals"
              link="/accommodation"
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
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-8 sm:mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-0">Featured Events</h2>
            <Link href="/events">
              <Button
                variant="outline"
                className="border-green-600 text-green-600 hover:bg-green-50 text-sm sm:text-base"
              >
                View All Events
              </Button>
            </Link>
          </div>

          {/* Weekend Events Highlight */}
          {formattedWeekendEvents.length > 0 && (
            <div className="mb-8">
              <WeekendEventsHighlight events={formattedWeekendEvents} title="This Weekend's Events" />
            </div>
          )}

          {/* Featured Events Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {featuredEvents.map((event) => (
              <EventCard
                key={event.id}
                id={event.id}
                title={event.title}
                date={event.date}
                time={event.time}
                location={event.location}
                image={event.image}
                website={event.website}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-10 sm:py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-green-600 to-yellow-500">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4 sm:mb-6">Stay Updated</h2>
          <p className="text-white text-base sm:text-lg mb-6 sm:mb-8">
            Subscribe to our newsletter to get the latest Bachata news, events, and special offers.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <input
              type="email"
              placeholder="Your email address"
              className="px-3 sm:px-4 py-2 sm:py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-300 w-full sm:w-auto text-sm sm:text-base"
            />
            <Button className="bg-black hover:bg-gray-800 text-white text-sm sm:text-base">Subscribe</Button>
          </div>
        </div>
      </section>
    </div>
  )
}

function FeatureCard({ icon, title, description, link }) {
  return (
    <Link href={link}>
      <div className="bg-white rounded-lg p-3 sm:p-6 shadow-md hover:shadow-lg transition-shadow border border-gray-100 h-full flex flex-col">
        <div className="mb-2 sm:mb-4">{icon}</div>
        <h3 className="text-base sm:text-xl font-semibold mb-1 sm:mb-2 text-gray-900">{title}</h3>
        <p className="text-gray-600 flex-grow text-xs sm:text-sm">{description}</p>
        <div className="mt-2 sm:mt-4 text-green-600 font-medium flex items-center text-xs sm:text-sm">
          Learn more
          <svg
            className="w-4 h-4 sm:w-5 sm:h-5 ml-1"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
