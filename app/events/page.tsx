import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Users, MapPin, Clock, Star, Info } from "lucide-react"
import Link from "next/link"
import CollapsibleFilter from "@/components/collapsible-filter"
import { applyFilters } from "./actions"
import FestivalMenu from "@/components/festival-menu"

export default function EventsPage() {
  // Your calendar ID
  const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"

  // Highlighted/Featured events
  const highlightedEvents = [
    {
      id: 1,
      title: "Sydney International Bachata Festival 25",
      date: "April 18-20, 2025",
      time: "3 days",
      location: "West HQ, Rooty Hill, NSW",
      description:
        "Australia's premier Bachata festival featuring world-class workshops, performances, and a live Bachata concert with international artists.",
      image: "/placeholder.svg?height=300&width=600",
      url: "https://www.bachatafestival.com.au/",
      ticketUrl: "https://www.trybooking.com/events/1219139/sessions/4595849/sections",
      featured: true,
      isFestival: true,
    },
    
    {
      id: 2,
      title: "Adelaide Sensual Week-end 25",
      date: "23-07-2025",
      time: "3 days",
      location: "Adelaide, SA",
      description:
        "Experience the best of Bachata,kizomba, salsa and more in Adelaide with workshops, performances, and social dancing.+ secret Vineyard Party",
      image: "/images/aws25.jpeg",
      url: "https://adelaidesensualweekend.com/",
      ticketUrl: "https://www.trybooking.com/events/1255696/sessions/4754269/sections/2376399/tickets",
      featured: true,
      isFestival: true,
    },
  ]

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3 sm:mb-4">Bachata Events</h1>
          <p className="text-base sm:text-xl text-gray-600 max-w-3xl mx-auto">
            Discover Bachata events across Australia, from social dances to workshops and festivals.
          </p>
        </div>

        <FestivalMenu />

        {/* Highlighted Events Section */}
        <div className="mb-10 sm:mb-16">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 flex items-center">
            <Star className="h-5 w-5 sm:h-6 sm:w-6 text-yellow-500 mr-2 fill-yellow-500" />
            Highlighted Events
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {highlightedEvents.map((event) => (
              <Card key={event.id} className="overflow-hidden hover:shadow-lg transition-shadow border-yellow-200">
                <div className="relative h-40 sm:h-48 overflow-hidden">
                  <div className="absolute top-0 right-0 bg-yellow-500 text-black z-10 px-2 py-1 text-xs sm:text-sm font-medium">
                    Featured
                  </div>
                  {event.isFestival && (
                    <div className="absolute top-0 left-0 bg-green-500 text-white z-10 px-2 py-1 text-xs sm:text-sm font-medium">
                      Festival
                    </div>
                  )}
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <CardHeader className="p-3 sm:p-4">
                  <CardTitle className="text-base sm:text-xl text-green-700">{event.title}</CardTitle>
                  <CardDescription className="text-xs sm:text-sm flex items-center">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    {event.date}
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-3 sm:p-4 pt-0">
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-2">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                    <span>{event.time}</span>
                  </div>
                  <p className="text-gray-700 text-xs sm:text-sm line-clamp-3">{event.description}</p>
                </CardContent>
                <CardFooter className="border-t pt-3 p-3 sm:pt-4 sm:p-4">
                  <div className="w-full flex flex-col gap-2 sm:gap-3">
                    {event.isFestival && event.ticketUrl && (
                      <a href={event.ticketUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                          size="sm"
                          className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                        >
                          Buy Tickets
                        </Button>
                      </a>
                    )}
                    {event.url && (
                      <a href={event.url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button
                          size="sm"
                          className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm"
                        >
                          Visit Event Website
                        </Button>
                      </a>
                    )}
                    <Link href={`/events/${event.id}`} className="w-full">
                      <Button
                        size="sm"
                        variant="outline"
                        className="w-full border-green-600 text-green-600 hover:bg-green-50 text-xs sm:text-sm"
                      >
                        View Details
                      </Button>
                    </Link>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>

        <Tabs defaultValue="calendar" className="w-full mb-8 sm:mb-12">
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="calendar" className="text-xs sm:text-sm">
              Calendar View
            </TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs sm:text-sm">
              Agenda View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="w-full">
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Bachata Australia Events Calendar</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  View all upcoming Bachata events in Australia. Click on an event for more details.
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
                  <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 sm:p-4 flex justify-between items-center">
                    <h3 className="text-white font-bold text-sm sm:text-lg">Bachata Events Calendar</h3>
                    <div className="flex space-x-1 sm:space-x-2">
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
                    </div>
                  </div>
                  <iframe
                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                      calendarId,
                    )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1`}
                    style={{ borderWidth: 0 }}
                    width="100%"
                    height="500"
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
            <Card>
              <CardHeader className="p-3 sm:p-6">
                <CardTitle className="text-lg sm:text-xl">Bachata Australia Events Agenda</CardTitle>
                <CardDescription className="text-xs sm:text-sm">
                  View all upcoming Bachata events in a list format
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-6 pt-0">
                <div className="border rounded-lg overflow-hidden">
                  <iframe
                    src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                      calendarId,
                    )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1&mode=AGENDA`}
                    style={{ borderWidth: 0 }}
                    width="100%"
                    height="500"
                    frameBorder="0"
                    scrolling="no"
                    title="Bachata Australia Events Agenda"
                  ></iframe>
                </div>
              </CardContent>
            </Card>
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
