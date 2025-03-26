import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info } from "lucide-react"

export default function FestivalsPage() {
  // Helper function to check if a date is in the future
  const isFutureDate = (dateString) => {
    // Handle "To Be Announced" dates
    if (dateString.includes("To Be Announced")) {
      return true // Always show TBA dates
    }

    // Extract the year from the date string
    const year = Number.parseInt(dateString.match(/\d{4}/)[0])
    const currentYear = new Date().getFullYear()

    // If the year is in the future, the event is upcoming
    return year >= currentYear
  }

  // Helper function to convert date string to a comparable value for sorting
  const getDateSortValue = (dateString) => {
    // Handle "To Be Announced" dates - put them at the end
    if (dateString.includes("To Be Announced")) {
      return Number.POSITIVE_INFINITY // This will place TBA dates at the end
    }

    // Extract month and year
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    }

    // Extract month name and year
    const monthMatch = dateString.match(
      /(January|February|March|April|May|June|July|August|September|October|November|December)/,
    )
    const yearMatch = dateString.match(/\d{4}/)

    if (monthMatch && yearMatch) {
      const month = months[monthMatch[0]]
      const year = Number.parseInt(yearMatch[0])
      return year * 100 + month // This creates a sortable value (e.g., 202501 for January 2025)
    }

    return Number.POSITIVE_INFINITY // Fallback for unparseable dates
  }

  // Find the Sydney International Bachata Festival in the festivals array
  // and update its image property
  const festivals = [
    {
      id: 1,
      title: "Bachata Corazon Anniversary Weekend 2025",
      date: "January 16-19, 2025",
      location: "Melbourne, VIC",
      description:
        "One of Australia's most anticipated 100% Bachata social dancing events, this weekend includes a pre-party on January 16, followed by workshops and social dances from January 17 to 19. The event offers full passes, party passes, styling workshops, and private classes.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["International Artists", "Local Instructors"],
      price: "From $120",
      hasAccommodation: true,
      website: "https://bachatacorazon.com.au",
      inCalendar: true, // This event is in the user's Google Calendar
    },
    {
      id: 2,
      title: "Sydney International Bachata Festival 2025",
      date: "April 18-20, 2025",
      location: "West HQ, Rooty Hill, NSW",
      description:
        "As Australia's premier Bachata festival, this event features world-class workshops, sensational performances, and a live Bachata concert. The 2025 lineup includes international artists such as Johnny Sky, Harold & Regan, Simone & Danila, Samuel, and Melonito. Full passes and party passes are available for attendees.",
      image: "/images/sydney-bachata-festival.png", // Updated to use the new image
      instructors: ["Johnny Sky", "Harold & Regan", "Simone & Danila", "Samuel", "Melonito"],
      price: "From $150",
      hasAccommodation: true,
      website: "https://sydneybachatafestival.com",
      inCalendar: true, // This event is in the user's Google Calendar
    },
    {
      id: 3,
      title: "Kornel & Catharine – Melbourne Bachata Weekender",
      date: "April 25-27, 2025",
      location: "Melbourne, VIC",
      description:
        "Internationally acclaimed instructors Kornel and Catharine from Poland will lead workshops and social events over this weekend. The program includes multiple workshops, a masterclass, two nights of socials, and a Bachatanama competition.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["Kornel", "Catharine"],
      price: "From $95",
      hasAccommodation: true,
      website: "https://latindancecalendar.com",
    },
    {
      id: 4,
      title: "World Bachata Festival Melbourne 2025",
      date: "June 27-29, 2025",
      location: "Box Hill Town Hall, Melbourne, VIC",
      description:
        "This festival brings together world-renowned artists, DJs, and singers for a weekend filled with Bachata and Salsa workshops, performances, and social dancing. The event also features other Latin dances such as Merengue and Zouk.",
      image: "/images/world_bachata.png",
      instructors: ["World-renowned Artists", "International DJs", "Latin Singers"],
      price: "From $110",
      hasAccommodation: true,
      website: "https://melbourne.worldbachatafestival.com",
      inCalendar: true, // This event is in the user's Google Calendar
    },
    {
      id: 5,
      title: "Bachata Flavour Melbourne Festival",
      date: "August 15-17, 2025",
      location: "Melbourne, VIC",
      description:
        "Dedicated to both Sensual and Dominican Bachata, this festival features international artists Miguel & Susire from Spain and Roby & Aury from Italy. Attendees can enjoy a weekend full of workshops, social dances, and performances.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["Miguel & Susire (Spain)", "Roby & Aury (Italy)"],
      price: "From $85",
      hasAccommodation: true,
      website: "https://latindancecalendar.com",
    },
    {
      id: 6,
      title: "Melbourne Bachata Festival 2025",
      date: "October 3-5, 2025",
      location: "Transit Dance, Brunswick, VIC",
      description:
        "This festival promises an exciting weekend with three renowned international Bachata artists. The event includes workshops, performances, and social dancing opportunities.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["Three International Artists"],
      price: "From $90",
      hasAccommodation: true,
      website: "https://trybooking.com",
    },
    {
      id: 7,
      title: "Sydney Bachata Festival",
      date: "To Be Announced, 2025",
      location: "Sydney, NSW",
      description: "A weekend of workshops, performances, and social dancing with international artists.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["International Artists", "Local Instructors"],
      price: "TBA",
      hasAccommodation: true,
      website: "https://bachataaustralia.com",
    },
    {
      id: 8,
      title: "Melbourne Latin Festival",
      date: "To Be Announced, 2025",
      location: "Melbourne, VIC",
      description: "A mix of Salsa, Zouk, and Bachata, bringing top instructors and DJs.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["Top Instructors", "Professional DJs"],
      price: "TBA",
      hasAccommodation: true,
      website: "https://bachataaustralia.com",
    },
    {
      id: 9,
      title: "Bachata Sensual Weekender Brisbane",
      date: "To Be Announced, 2025",
      location: "Brisbane, QLD",
      description: "Perfect for those who love the sensual side of Bachata.",
      image: "/placeholder.svg?height=300&width=600",
      instructors: ["Sensual Bachata Specialists"],
      price: "TBA",
      hasAccommodation: true,
      website: "https://bachataaustralia.com",
    },
  ]

  // Filter out past events and sort by date
  const upcomingFestivals = festivals
    .filter((festival) => isFutureDate(festival.date))
    .sort((a, b) => getDateSortValue(a.date) - getDateSortValue(b.date))

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Bachata Festivals in Australia</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover the biggest and best Bachata festivals across Australia, featuring world-class instructors,
            performances, and social dancing.
          </p>
        </div>

        {/* Legend for calendar events - responsive version */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4 mb-6 sm:mb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex items-center mb-3 sm:mb-0 sm:mr-4">
              <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-sm sm:text-base text-gray-700">
                Events with{" "}
                <span className="inline-flex items-center text-green-600 font-medium">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  green highlighting
                </span>{" "}
                are in your Google Calendar
              </span>
            </div>
            <div className="sm:ml-auto mt-2 sm:mt-0">
              <Link href="/calendar">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm"
                >
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  View Calendar
                </Button>
              </Link>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 mb-12">
          {upcomingFestivals.map((festival) => (
            <Card
              key={festival.id}
              className={`overflow-hidden border-0 shadow-lg ${festival.inCalendar ? "ring-2 ring-green-500" : ""}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="md:col-span-1 relative">
                  {festival.inCalendar && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center z-10">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden xs:inline">In Your Calendar</span>
                      <span className="xs:hidden">Saved</span>
                    </div>
                  )}
                  <div className="h-48 sm:h-full">
                    <img
                      src={festival.image || "/placeholder.svg"}
                      alt={festival.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">{festival.title}</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{festival.date}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{festival.location}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{festival.price}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                    {festival.description}
                  </p>

                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-yellow-500" />
                      Featured Instructors
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {festival.instructors.map((instructor, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                        >
                          {instructor}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                    <a href={festival.website} target="_blank" rel="noopener noreferrer">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-10"
                      >
                        <Ticket className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        Visit Website
                      </Button>
                    </a>

                    {festival.hasAccommodation && (
                      <Link href={`/accommodation?festival=${festival.id}`}>
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50 text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <Hotel className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          <span className="hidden xs:inline">View Accommodation</span>
                          <span className="xs:hidden">Accommodation</span>
                        </Button>
                      </Link>
                    )}

                    <Link href={`/festivals/${festival.id}`}>
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-300 text-gray-700 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-10"
                      >
                        View Details
                      </Button>
                    </Link>

                    {!festival.inCalendar && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-600 hover:bg-green-50 text-xs sm:text-sm h-8 sm:h-10"
                      >
                        <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                        <span className="hidden xs:inline">Add to Calendar</span>
                        <span className="xs:hidden">Add</span>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg p-4 sm:p-8 text-white text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Organizing a Bachata Festival?</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
            List your festival on Bachata Australia to reach thousands of dancers across the country.
          </p>
          <Button size="sm" className="bg-white text-green-700 hover:bg-gray-100 sm:text-base">
            Submit Your Festival
          </Button>
        </div>
      </div>
    </div>
  )
}
