"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar } from "lucide-react"
import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function CalendarMenu() {
  const calendarIds = {
    allCities: "all", // Special identifier for all cities
    sydneyBachata: "4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com",
    melbourneBachata: "641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com",
    brisbaneBachata: "f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com",
    adelaideBachata: "6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com",
    goldCoastBachata: "c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com",
    perthBachata: "e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com",
    canberraBachata: "3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com",
    darwinBachata: "27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com",
    hobartBachata: "2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com",
    festivals: "9b41c4eac569d26ccfeff3a9222cd9fb144d4d201bd04cbb2962944e7a9f5153@group.calendar.google.com",
    eventsCalendar2: "6fd4c3996e34fed5839ec7fb4eb6d792c4c9fb788fca5aba169e05d8d385a205@group.calendar.google.com"
  }

  const [selectedCalendar, setSelectedCalendar] = useState(calendarIds.sydneyBachata)
  const [selectedView, setSelectedView] = useState("agenda")

  const getSelectedCityName = () => {
    const cityMap = {
      [calendarIds.allCities]: "All Cities",
      [calendarIds.sydneyBachata]: "Sydney",
      [calendarIds.melbourneBachata]: "Melbourne",
      [calendarIds.brisbaneBachata]: "Brisbane",
      [calendarIds.adelaideBachata]: "Adelaide",
      [calendarIds.goldCoastBachata]: "Gold Coast",
      [calendarIds.perthBachata]: "Perth",
      [calendarIds.canberraBachata]: "Canberra",
      [calendarIds.darwinBachata]: "Darwin",
      [calendarIds.hobartBachata]: "Hobart",
      [calendarIds.festivals]: "Festivals",
      [calendarIds.eventsCalendar2]: "Events Calendar 2"
    }
    return cityMap[selectedCalendar] || "Bachata"
  }

  const getCalendarUrl = () => {
    const baseParams = `ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1&showAdd=0&color=%23${encodeURIComponent(process.env.NEXT_PUBLIC_PRIMARY_COLOR?.replace('#', '') || '006B3F')}&showAdd=0&showNav=1&showPrint=0&showTabs=0&showCalendars=0&showTz=1&showAdd=0`
    const viewParam = selectedView === "agenda" ? "&mode=AGENDA" : "&mode=MONTH"

    if (selectedCalendar === calendarIds.allCities) {
      // Create a combined URL with all calendar IDs (excluding eventsCalendar2)
      const allCalendarIds = Object.entries(calendarIds)
        .filter(([key]) => key !== 'allCities' && key !== 'eventsCalendar2')
        .map(([_, value]) => encodeURIComponent(value))
        .join('&src=');
      
      return `https://calendar.google.com/calendar/embed?src=${allCalendarIds}&${baseParams}${viewParam}`;
    }
    
    return `https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
      selectedCalendar,
    )}&${baseParams}${viewParam}`;
  }

  return (
    <Card className="mb-8 sm:mb-12">
      <CardHeader className="p-3 sm:p-6">
        <CardTitle className="text-lg sm:text-xl text-[#14b8a6]">
          Bachata Australia Events Calendar
        </CardTitle>
        <CardDescription className="text-xs sm:text-sm">
          View all upcoming Bachata events in Australia. Click on an event for more details.
        </CardDescription>
      </CardHeader>

      <CardContent className="p-3 sm:p-6 pt-0">
        <Tabs defaultValue="agenda" className="w-full mb-8 sm:mb-12" onValueChange={setSelectedView}>
          <TabsList className="grid w-full grid-cols-2 mb-6 sm:mb-8">
            <TabsTrigger value="calendar" className="text-xs sm:text-sm">Calendar View</TabsTrigger>
            <TabsTrigger value="agenda" className="text-xs sm:text-sm">Agenda View</TabsTrigger>
          </TabsList>

          <TabsContent value="calendar" className="w-full">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-gradient-to-r from-[#14b8a6] to-[#a855f7] p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <h3 className="text-white font-bold text-sm sm:text-lg">
                    {getSelectedCityName() === "Festivals" ? "Festivals Calendar" : `${getSelectedCityName()} Bachata Events Calendar`}
                  </h3>
                </div>

                <div className="flex space-x-1 sm:space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#14b8a6] hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9"
                  >
                    Today
                  </Button>

                  <div className="bg-white/20 rounded-md flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <ChevronRightIcon />
                    </Button>
                  </div>

                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    className="bg-white text-[#14b8a6] hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9 rounded-md border-0 focus:ring-0"
                  >
                    <option value={calendarIds.allCities}>All Cities</option>
                    {Object.entries(calendarIds)
                      .filter(([key]) => key !== 'allCities')
                      .map(([key, value]) => (
                        <option key={key} value={value}>
                          {key === 'festivals' ? 'Festivals' : key.replace("Bachata", "").replace(/([A-Z])/g, ' $1').trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Bachata
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <iframe
                src={getCalendarUrl()}
                style={{ borderWidth: 0 }}
                width="100%"
                height="500"
                frameBorder="0"
                scrolling="no"
                title="Bachata Australia Events Calendar"
                className="border-t border-gray-200"
              ></iframe>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoCard
                iconColor="#a855f7"
                bgColor="bg-[#f3e8ff]"
                borderColor="border-[#d8b4fe]"
                title="Community Events"
                text="This calendar includes events from dance schools, promoters, and the Bachata community across Australia."
              />
              <InfoCard
                iconColor="#facc15"
                bgColor="bg-[#fefce8]"
                borderColor="border-[#fde68a]"
                title="Submit Your Event"
                text="Have a Bachata event to share? Submit it to be included in our community calendar."
              />
            </div>
          </TabsContent>

          <TabsContent value="agenda" className="w-full">
            <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
              <div className="bg-gradient-to-r from-[#14b8a6] to-[#a855f7] p-3 sm:p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
                  <h3 className="text-white font-bold text-sm sm:text-lg">
                    {getSelectedCityName() === "Festivals" ? "Festivals Calendar" : `${getSelectedCityName()} Bachata Events Calendar`}
                  </h3>
                </div>

                <div className="flex space-x-1 sm:space-x-2">
                  <Button
                    size="sm"
                    variant="secondary"
                    className="bg-white text-[#14b8a6] hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9"
                  >
                    Today
                  </Button>

                  <div className="bg-white/20 rounded-md flex items-center">
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <ChevronLeftIcon />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="text-white hover:bg-white/20 h-7 sm:h-9 px-1 sm:px-3"
                    >
                      <ChevronRightIcon />
                    </Button>
                  </div>

                  <select
                    value={selectedCalendar}
                    onChange={(e) => setSelectedCalendar(e.target.value)}
                    className="bg-white text-[#14b8a6] hover:bg-gray-100 text-xs sm:text-sm h-7 sm:h-9 rounded-md border-0 focus:ring-0"
                  >
                    <option value={calendarIds.allCities}>All Cities</option>
                    {Object.entries(calendarIds)
                      .filter(([key]) => key !== 'allCities')
                      .map(([key, value]) => (
                        <option key={key} value={value}>
                          {key === 'festivals' ? 'Festivals' : key.replace("Bachata", "").replace(/([A-Z])/g, ' $1').trim().split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} Bachata
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <iframe
                src={getCalendarUrl()}
                style={{ borderWidth: 0 }}
                width="100%"
                height="500"
                frameBorder="0"
                scrolling="no"
                title="Bachata Australia Events Calendar"
                className="border-t border-gray-200"
              ></iframe>
            </div>

            <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <InfoCard
                iconColor="#a855f7"
                bgColor="bg-[#f3e8ff]"
                borderColor="border-[#d8b4fe]"
                title="Community Events"
                text="This calendar includes events from dance schools, promoters, and the Bachata community across Australia."
              />
              <InfoCard
                iconColor="#facc15"
                bgColor="bg-[#fefce8]"
                borderColor="border-[#fde68a]"
                title="Submit Your Event"
                text="Have a Bachata event to share? Submit it to be included in our community calendar."
              />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

// Reusable Icon + Text card
function InfoCard({ iconColor, bgColor, borderColor, title, text }: {
  iconColor: string,
  bgColor: string,
  borderColor: string,
  title: string,
  text: string
}) {
  return (
    <div className={`${bgColor} rounded-lg p-3 sm:p-4 ${borderColor} border flex items-start`}>
      <Calendar className={`h-4 w-4 sm:h-5 sm:w-5 mr-2 sm:mr-3 mt-0.5 flex-shrink-0`} style={{ color: iconColor }} />
      <div>
        <h3 className="font-medium mb-1 text-sm sm:text-base" style={{ color: iconColor }}>{title}</h3>
        <p className="text-xs sm:text-sm" style={{ color: iconColor }}>{text}</p>
      </div>
    </div>
  )
}

function ChevronLeftIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-left">
      <path d="m15 18-6-6 6-6" />
    </svg>
  )
}

function ChevronRightIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none"
      stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-chevron-right">
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}
