"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"

interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string
  imageUrl: string
  comment: string
  googleMapLink: string
}

export default function FestivalsPage() {
  const [selectedState, setSelectedState] = useState("all")
  const states = [
    { value: "all", label: "All States" },
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
    { value: "sa", label: "South Australia" },
  ]

  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFestivals()
  }, [])

  const fetchFestivals = async () => {
    try {
      const response = await fetch('/api/festivals')
      if (!response.ok) throw new Error('Failed to fetch festivals')
      const data = await response.json()
      setFestivals(data)
    } catch (err) {
      setError('Failed to load festivals')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Helper function to check if a date is in the future
  const isFutureDate = (dateString: string) => {
    // Handle "To Be Announced" dates
    if (dateString.includes("To Be Announced")) {
      return true // Always show TBA dates
    }

    // Extract the year from the date string
    const yearMatch = dateString.match(/\d{4}/)
    if (!yearMatch) return true // If no year found, treat as future date
    const year = Number.parseInt(yearMatch[0])
    const currentYear = new Date().getFullYear()

    // If the year is in the future, the event is upcoming
    return year >= currentYear
  }

  // Helper function to convert date string to a comparable value for sorting
  const getDateSortValue = (dateString: string) => {
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
      const month = months[monthMatch[0] as keyof typeof months]
      const year = Number.parseInt(yearMatch[0])
      return year * 100 + month // This creates a sortable value (e.g., 202501 for January 2025)
    }

    return Number.POSITIVE_INFINITY // Fallback for unparseable dates
  }

  // Filter out past events and sort by date
  const upcomingFestivals = festivals
    .filter((festival) => isFutureDate(festival.startDate))
    .filter((festival) => selectedState === "all" || festival.state === selectedState)
    .sort((a, b) => getDateSortValue(a.startDate) - getDateSortValue(b.startDate))

  if (isLoading) {
    return <div className="text-center py-8">Loading festivals...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Bachata Festivals</h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover Bachata festivals and events across Australia. Join the community for unforgettable dance experiences.
          </p>
        </div>

        {/* State Filter */}
        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedState === state
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {state}
            </button>
          ))}
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
              className={`overflow-hidden border-0 shadow-lg ${festival.eventLink ? "ring-2 ring-green-500" : ""}`}
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="md:col-span-1 relative">
                  {festival.eventLink && (
                    <div className="absolute top-2 left-2 bg-green-500 text-white px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium flex items-center z-10">
                      <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                      <span className="hidden xs:inline">In Your Calendar</span>
                      <span className="xs:hidden">Saved</span>
                    </div>
                  )}
                  <div className="h-48 sm:h-full">
                    <img
                      src={festival.imageUrl || "/placeholder.svg"}
                      alt={festival.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">{festival.name}</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{festival.location}, {festival.state}</span>
                    </div>
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <DollarSign className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{festival.price}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4 line-clamp-3 sm:line-clamp-none">
                    {festival.comment}
                  </p>

                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2 flex items-center">
                      <Users className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 text-yellow-500" />
                      Featured Instructors
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {festival.danceStyles.split(',').map((style, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                        >
                          {style.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {festival.eventLink && (
                      <a
                        href={festival.eventLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Button
                          size="sm"
                          className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <Ticket className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Visit Website
                        </Button>
                      </a>
                    )}

                    {festival.ticketLink && (
                      <a
                        href={festival.ticketLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="bg-blue-500 text-white px-4 py-2 rounded text-center hover:bg-blue-600"
                      >
                        Buy Tickets
                      </a>
                    )}

                    {festival.googleMapLink && (
                      <a
                        href={festival.googleMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:text-blue-700"
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-blue-500 text-blue-600 hover:bg-blue-50 text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          View on Map
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {upcomingFestivals.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No festivals currently scheduled.
          </div>
        )}

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
