"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "lucide-react"

interface StateCalendar {
  state: string
  calendarLink: string
}

const stateCalendars: StateCalendar[] = [
  {
    state: "NSW",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_NSW_CALENDAR_ID"
  },
  {
    state: "VIC",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_VIC_CALENDAR_ID"
  },
  {
    state: "QLD",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_QLD_CALENDAR_ID"
  },
  {
    state: "WA",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_WA_CALENDAR_ID"
  },
  {
    state: "SA",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_SA_CALENDAR_ID"
  },
  {
    state: "TAS",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_TAS_CALENDAR_ID"
  },
  {
    state: "ACT",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_ACT_CALENDAR_ID"
  },
  {
    state: "NT",
    calendarLink: "https://calendar.google.com/calendar/embed?src=YOUR_NT_CALENDAR_ID"
  }
]

export default function StateCalendarLinks() {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Subscribe to State-Specific Calendars</h3>
      <p className="text-sm text-gray-600">
        Stay updated with events in your state by subscribing to our state-specific calendars.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
        {stateCalendars.map((calendar) => (
          <Button
            key={calendar.state}
            variant="outline"
            className="w-full text-sm sm:text-base border-green-600 text-green-600 hover:bg-green-50"
            onClick={() => window.open(calendar.calendarLink, "_blank")}
          >
            <Calendar className="w-4 h-4 mr-2" />
            {calendar.state}
          </Button>
        ))}
      </div>
    </div>
  )
} 