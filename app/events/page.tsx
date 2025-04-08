"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info } from "lucide-react"
import { Calendar as UiCalendar } from '@/components/ui/calendar'
import Link from 'next/link'

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
  const [selectedState, setSelectedState] = useState('All')
  const [selectedCalendar, setSelectedCalendar] = useState('all')

  const filteredEvents = selectedState === 'All'
    ? eventsData
    : eventsData.filter(event => event.state === selectedState)

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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-4">Bachata Events</h1>
        <p className="text-lg text-gray-600">
          Discover Bachata events and socials across Australia
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

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredEvents.map((event) => (
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
                  <Badge variant="secondary">Price: {event.price}</Badge>
                </div>
                <div className="flex gap-2 mt-4">
                  <Button
                    className="flex-1 bg-green-600 hover:bg-green-700"
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
        ))}
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
      <div className="bg-green-50 p-4 sm:p-6 rounded-lg text-center mt-8 sm:mt-12">
        <h2 className="text-xl sm:text-2xl font-bold text-green-800 mb-2 sm:mb-4">Want to add your event?</h2>
        <p className="text-xs sm:text-sm text-green-700 mb-4 sm:mb-6 max-w-2xl mx-auto">
          If you're organizing a Bachata event in Australia, we'd love to feature it on our calendar.
        </p>
        <Link href="/calendar/add-events">
          <Button
            size="sm"
            className="bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm sm:text-base sm:h-10"
          >
            Submit Your Event
          </Button>
        </Link>
      </div>

    </div>
  )
}
