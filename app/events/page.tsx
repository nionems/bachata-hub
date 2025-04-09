"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info } from "lucide-react"
import { Calendar as UiCalendar } from '@/components/ui/calendar'
import Link from 'next/link'
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

// Static events data
export const eventsData = [
  {
    id: "1",
    name: "Sydney Bachata Festival 2025",
    date: "April 18-20, 2025",
    time: "All day",
    location: "West HQ, Rooty Hill",
    state: "NSW",
    address: "55 Sherbrooke St, Rooty Hill NSW 2766",
    eventLink: "https://example.com",
    price: "$85",
    ticketLink: "https://example.com",
    imageUrl: "/placeholder.svg",
    comment: "Australia's premier Bachata festival featuring world-class workshops, performances, and a live Bachata concert with international artists.",
    googleMapLink: "https://goo.gl/maps/example"
  },
  {
    id: "2",
    name: "Melbourne Bachata Congress",
    date: "May 15-17, 2025",
    time: "All day",
    location: "Melbourne Convention Centre",
    state: "VIC",
    address: "1 Convention Centre Pl, South Wharf VIC 3006",
    eventLink: "https://example.com",
    price: "$75",
    ticketLink: "https://example.com",
    imageUrl: "/placeholder.svg",
    comment: "Three days of workshops, social dancing, and performances with international Bachata artists.",
    googleMapLink: "https://goo.gl/maps/example"
  },
  // Add more static events as needed
]

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCalendar, setSelectedCalendar] = useState('all')
  
  const { selectedState, setSelectedState, filteredItems: filteredEvents } = useStateFilter(events)

  const calendarOptions = [
    { value: "4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com", label: "Sydney Bachata" },
    { value: "641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com", label: "Melbourne Bachata" },
    { value: "f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com", label: "Brisbane Bachata" },
    { value: "6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com", label: "Adelaide Bachata" },
    { value: "c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com", label: "Gold Coast Bachata" },
    { value: "e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com", label: "Perth Bachata" },
    { value: "3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com", label: "Canberra Bachata" }
  ];

  const selectedCalendarLabel = calendarOptions.find(option => option.value === selectedCalendar)?.label || "Bachata Hub Calendar";

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const eventsCollection = collection(db, 'events')
        const eventsSnapshot = await getDocs(eventsCollection)
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[]
        
        setEvents(eventsList)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  if (isLoading) return <div className="text-center py-8">Loading events...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Bachata Events
          </h1>
          <p className="text-xl text-gray-600">
            Find Bachata events across Australia
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No events found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="h-48 overflow-hidden">
                  <img
                    src={event.imageUrl}
                    alt={event.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{event.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    {event.location}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-green-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-green-600" />
                      <span>{event.time}</span>
                    </div>
                    <p className="text-gray-600">{event.comment}</p>
                    <div className="flex gap-2">
                      <Badge variant="price">Price: {event.price}</Badge>
                    </div>
                    <div className="flex gap-2 mt-4">
                      <Button
                        className="flex-1 bg-primary hover:bg-primary/90"
                        onClick={() => window.open(event.ticketLink, "_blank")}
                      >
                        Get Tickets
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => window.open(event.googleMapLink, "_blank")}
                      >
                        View Map
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>

        {/* Calendar Section */}
        <Card className="border-0 shadow-none mt-16">
          <CardHeader className="p-3 sm:p-6 pb-0">
            <CardTitle className="text-lg sm:text-xl text-green-700">Bachata Australia Events Calendar</CardTitle>
            <CardDescription className="text-xs sm:text-sm">
              View all upcoming Bachata events in Australia. Click on an event for more details.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-3 sm:p-6">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <h3 className="text-white font-bold text-sm sm:text-lg">{selectedCalendarLabel}</h3>
                </div>
                <div className="flex flex-wrap gap-2 items-center">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9"
                  >
                    Today
                  </Button>
                  <div className="bg-white/20 rounded-md flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-left"
                      >
                        <path d="m15 18-6-6 6-6" />
                      </svg>
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="lucide lucide-chevron-right"
                      >
                        <path d="m9 18 6-6-6-6" />
                      </svg>
                    </Button>
                  </div>
                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9 rounded-md border-0 focus:ring-0"
                  >
                    {calendarOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  selectedCalendar,
                )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1`}
                style={{ borderWidth: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="Bachata Australia Events Calendar"
                className="border-t border-gray-200"
              ></iframe>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200 flex items-start">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-green-800 mb-1 text-sm sm:text-base">Add to Your Calendar</h3>
                  <p className="text-xs sm:text-sm text-green-700">
                    Click the "+ Google Calendar" button at the bottom right to add this calendar to your own Google
                    Calendar.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200 flex items-start">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Community Events</h3>
                  <p className="text-xs sm:text-sm text-blue-700">
                    This calendar includes events from dance schools, promoters, and the Bachata community across
                    Australia.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200 flex items-start">
                <Info className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1 text-sm sm:text-base">Submit Your Event</h3>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    Have a Bachata event to share? Submit it to be included in our community calendar.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Submit Your Event Card */}
        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Submit Your Event
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you organizing a Bachata event? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance enthusiasts
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your event to the dance community
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with dancers across Australia
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <a
                href="mailto:contact@bachata.au"
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]"
              >
                Contact Us
              </a>
              <a
                href="/calendar/add-events"
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
              >
                Submit via Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
