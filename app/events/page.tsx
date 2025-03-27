"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, MapPin, Clock, Star, Info, CheckCircle } from "lucide-react"
import Link from "next/link"
import CollapsibleFilter from "@/components/collapsible-filter"
import { applyFilters } from "./actions"
import FestivalMenu from "@/components/festival-menu"
import { useState } from "react"
import { EventsMap } from "@/components/events-map"

export default function EventsPage() {
  const [selectedState, setSelectedState] = useState("all")
  const states = [
    { value: "all", label: "All States" },
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
    { value: "sa", label: "South Australia" },
  ]

  // Your calendar IDs
  const calendarIds = {
    bachataSocial: "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com",
    melbourneBachata: "ZDg5ODU5MzdkZTBhYmU5YjYwZDg4Zjg2NWJhMjA4YzAwNzc0ZDJlMTNjNDFjOWQ4NmMwMDgzODNkNGRhMzJhOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    adelaideBachata: "MTZiOGZlOTYwMDc5NGQ1OTAzMDkwMWE2NzlhODRhNmE3YTgxNmY0YjI5MjM3NzNiYWFmODg2ODcxYjE0YTJkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    brisbaneBachata: "YWFhMjIyZjZlZjBhNDNiZTUwOGUyYjVhN2EyYmNhYjIzMmZmMTlmYTlkY2UwZDE2YWViNTQ3MzczZDhkNTI0NUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
    perthBachata: "NDY5ZmIzYmVkMDMwOGIxYThjY2M4ZTlkOTFmYjAyMDBlNmYzYWRlYWZkODE0YzE3NDdiYzk0MDkxZGMxMWFhNUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
  }

  const [selectedCalendar, setSelectedCalendar] = useState(calendarIds.bachataSocial)
  const [showMap, setShowMap] = useState(false)

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-4">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">Bachata Events</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Discover Bachata events across Australia. From social dances to workshops and festivals.
          </p>
        </div>

        {/* Calendar Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center">
            <div className="flex items-center mb-3 sm:mb-0 sm:mr-4">
              <Info className="h-4 w-4 text-blue-600 mr-2 flex-shrink-0" />
              <span className="text-sm text-gray-700">
                Events with{" "}
                <span className="inline-flex items-center text-green-600 font-medium">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  green highlighting
                </span>{" "}
                are in your Google Calendar
              </span>
            </div>
          </div>
        </div>

        {/* State Filter */}
        <div className="mb-8">
          <CollapsibleFilter title="Filter by State" showApplyButton={false}>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
              {states.map((state) => (
                <Button
                  key={state.value}
                  variant={selectedState === state.value ? "default" : "outline"}
                  className={`w-full text-sm sm:text-base ${
                    selectedState === state.value
                      ? "bg-green-600 text-white hover:bg-green-700"
                      : "border-green-600 text-green-600 hover:bg-green-50"
                  }`}
                  onClick={() => setSelectedState(state.value)}
                >
                  {state.label}
                </Button>
              ))}
            </div>
          </CollapsibleFilter>
        </div>

        <FestivalMenu />

        <Tabs defaultValue="calendar" className="w-full mb-8 sm:mb-12">
          <TabsList className="grid w-full grid-cols-3 mb-6 sm:mb-8">
            <TabsTrigger value="calendar" className="text-xs sm:text-sm">
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs sm:text-sm">
              Agenda View
            </TabsTrigger>
            <TabsTrigger value="map" className="text-xs sm:text-sm">
              Map View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="w-full">
            <Card className="border-0 shadow-none">
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
                      <h3 className="text-white font-bold text-sm sm:text-lg">Bachata Events Calendar</h3>
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
                        <option value={calendarIds.bachataSocial}>Sydney Bachata</option>
                        <option value={calendarIds.melbourneBachata}>Melbourne Bachata</option>
                        <option value={calendarIds.adelaideBachata}>Adelaide Bachata</option>
                        <option value={calendarIds.brisbaneBachata}>Brisbane Bachata</option>
                        <option value={calendarIds.perthBachata}>Perth Bachata</option>
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
                      className="text-yellow-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0"
                    >
                      <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z" />
                      <polyline points="14 2 14 8 20 8" />
                      <path d="M12 18v-6" />
                      <path d="M8 18v-1" />
                      <path d="M16 18v-3" />
                    </svg>
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
          </TabsContent>

          <TabsContent value="agenda" className="w-full">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <h3 className="text-white font-bold text-sm sm:text-lg">Bachata Events Calendar</h3>
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
                    <option value={calendarIds.bachataSocial}>Sydney Bachata</option>
                    <option value={calendarIds.melbourneBachata}>Melbourne Bachata</option>
                    <option value={calendarIds.adelaideBachata}>Adelaide Bachata</option>
                    <option value={calendarIds.brisbaneBachata}>Brisbane Bachata</option>
                    <option value={calendarIds.perthBachata}>Perth Bachata</option>
                  </select>
                </div>
              </div>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  selectedCalendar,
                )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1&mode=AGENDA`}
                style={{ borderWidth: 0 }}
                width="100%"
                height="600"
                frameBorder="0"
                scrolling="no"
                title="Bachata Australia Events Calendar"
                className="border-t border-gray-200"
              ></iframe>
            </div>
          </TabsContent>

          <TabsContent value="map" className="w-full">
            <EventsMap />
          </TabsContent>
        </Tabs>

        <div className="flex flex-col lg:flex-row gap-6 sm:gap-8 mb-8 sm:mb-12">
          <div className="lg:w-1/4">
            <CollapsibleFilter title="Event Categories" applyFilters={applyFilters}>
              <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                Our calendar includes various types of Bachata events across Australia:
              </p>
              <ul className="space-y-1 sm:space-y-2 text-xs sm:text-sm text-gray-700">
                <li className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-green-500 mr-2"></div>
                  Social Dances
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-blue-500 mr-2"></div>
                  Workshops
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-yellow-500 mr-2"></div>
                  Festivals
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-purple-500 mr-2"></div>
                  Competitions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-red-500 mr-2"></div>
                  Special Events
                </li>
              </ul>

              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t">
                <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">
                  Want to add your Bachata event to our calendar?
                </p>
                <Link href="/calendar/add-events">
                  <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm">
                    Submit Your Event
                  </Button>
                </Link>
              </div>
            </CollapsibleFilter>

            {/* Calendar Note */}
            <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mb-6">
              <div className="flex items-start">
                <Info className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1 text-sm">About Calendar Dates</h3>
                  <p className="text-xs text-yellow-700">
                    Dates with events are highlighted in the Google Calendar. Look for dates with colored indicators or
                    event titles.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="lg:w-3/4">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">About Our Events Calendar</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  Your comprehensive resource for Bachata events across Australia
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="prose max-w-none text-xs sm:text-sm">
                  <p>
                    Our Bachata Australia events calendar is the central hub for all Bachata events happening across the
                    country. From regular social dances to major festivals, workshops, and competitions, you'll find
                    everything here.
                  </p>

                  <h3 className="text-sm sm:text-base font-medium mt-3 sm:mt-4 mb-1 sm:mb-2">
                    How to Use the Calendar
                  </h3>
                  <ul className="list-disc pl-4 sm:pl-5 space-y-1">
                    <li>Click on any event in the calendar to see full details</li>
                    <li>Use the tabs at the top to switch between calendar and agenda views</li>
                    <li>Click the "+ Google Calendar" button to add our calendar to your own Google Calendar</li>
                    <li>Use the navigation controls to move between months or weeks</li>
                  </ul>

                  <h3 className="text-sm sm:text-base font-medium mt-3 sm:mt-4 mb-1 sm:mb-2">Submit Your Event</h3>
                  <p>
                    Are you organizing a Bachata event in Australia? We'd love to feature it on our calendar! Click the
                    "Submit Your Event" button to fill out our event submission form.
                  </p>

                  <h3 className="text-sm sm:text-base font-medium mt-3 sm:mt-4 mb-1 sm:mb-2">Stay Connected</h3>
                  <p>
                    Subscribe to our calendar to stay up-to-date with all the latest Bachata events. Never miss a dance
                    opportunity again!
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <div className="bg-green-50 p-4 sm:p-6 rounded-lg text-center">
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
    </div>
  )
}
