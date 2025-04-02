"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function CalendarMenu() {
  // Your calendar IDs
  const calendarIds = {
    sydneyBachata: "4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com",
    melbourneBachata: "641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com",
    brisbaneBachata: "f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com",
    adelaideBachata: "6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com",
    goldCoastBachata: "c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com",
    perthBachata: "e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com",
    canberraBachata: "3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com"
  }

  const [selectedCalendar, setSelectedCalendar] = useState(calendarIds.sydneyBachata)

  // Get the selected city name
  const getSelectedCityName = () => {
    const cityMap = {
      [calendarIds.sydneyBachata]: "Sydney",
      [calendarIds.melbourneBachata]: "Melbourne",
      [calendarIds.brisbaneBachata]: "Brisbane",
      [calendarIds.adelaideBachata]: "Adelaide",
      [calendarIds.goldCoastBachata]: "Gold Coast",
      [calendarIds.perthBachata]: "Perth",
      [calendarIds.canberraBachata]: "Canberra"
    }
    return cityMap[selectedCalendar] || "Bachata"
  }

  return (
    <Card className="mb-8 sm:mb-12">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-xl text-green-700">Bachata Australia Events Calendar</CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          View all upcoming Bachata events in Australia. Click on an event for more details.
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 sm:p-6 pt-0">
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
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <h3 className="text-white font-bold text-sm sm:text-lg">{getSelectedCityName()} Bachata Events Calendar</h3>
                </div>
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
                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    className="bg-white text-green-700 hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9 rounded-md border-0 focus:ring-0"
                  >
                    <option value={calendarIds.sydneyBachata}>Sydney Bachata</option>
                    <option value={calendarIds.melbourneBachata}>Melbourne Bachata</option>
                    <option value={calendarIds.brisbaneBachata}>Brisbane Bachata</option>
                    <option value={calendarIds.adelaideBachata}>Adelaide Bachata</option>
                    <option value={calendarIds.goldCoastBachata}>Gold Coast Bachata</option>
                    <option value={calendarIds.perthBachata}>Perth Bachata</option>
                    <option value={calendarIds.canberraBachata}>Canberra Bachata</option>
                  </select>
                </div>
              </div>
              <iframe
                src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
                  selectedCalendar,
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
                    Click the "+ Google Calendar" button at the bottom right to add this calendar to your own Google Calendar.
                  </p>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200 flex items-start">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-blue-800 mb-1 text-sm sm:text-base">Community Events</h3>
                  <p className="text-xs sm:text-sm text-blue-700">
                    This calendar includes events from dance schools, promoters, and the Bachata community across Australia.
                  </p>
                </div>
              </div>

              <div className="bg-yellow-50 rounded-lg p-3 sm:p-4 border border-yellow-200 flex items-start">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 mr-2 sm:mr-3 mt-0.5 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-yellow-800 mb-1 text-sm sm:text-base">Submit Your Event</h3>
                  <p className="text-xs sm:text-sm text-yellow-700">
                    Have a Bachata event to share? Submit it to be included in our community calendar.
                  </p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 