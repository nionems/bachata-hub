"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Check, RefreshCw, AlertCircle } from "lucide-react"

export default function GoogleCalendarEmbed() {
  const [isConnected, setIsConnected] = useState(true) // Set to true to show the calendar by default
  const [isLoading, setIsLoading] = useState(false)

  // Your calendar ID from the iframe code
  const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"

  // Function to handle disconnecting the calendar
  const disconnectCalendar = () => {
    setIsConnected(false)
  }

  // Function to handle reconnecting the calendar
  const reconnectCalendar = () => {
    setIsLoading(true)
    // Simulate API call
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
    }, 1000)
  }

  if (!isConnected) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-green-100 p-4 rounded-full mb-6">
          <Calendar className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">Connect to Google Calendar</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Connect your Google Calendar to display Bachata events on this website.
        </p>
        <Button onClick={reconnectCalendar} className="bg-green-600 hover:bg-green-700 text-white" disabled={isLoading}>
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Connect Google Calendar
            </>
          )}
        </Button>
      </Card>
    )
  }

  return (
    <div className="h-full w-full">
      <div className="bg-green-100 p-3 mb-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <Check className="h-5 w-5 text-green-600 mr-2" />
          <span className="text-green-800 font-medium">Google Calendar Connected</span>
        </div>
        <div className="flex space-x-2">
          <Button
            size="sm"
            variant="outline"
            className="border-red-600 text-red-600 hover:bg-red-50"
            onClick={disconnectCalendar}
          >
            Disconnect
          </Button>
        </div>
      </div>

      <div className="border rounded-lg overflow-hidden">
        <iframe
          src={`https://calendar.google.com/calendar/embed?src=${encodeURIComponent(
            calendarId,
          )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1&color=%23006B3F`}
          style={{ borderWidth: 0 }}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
          title="Bachata Australia Events Calendar"
        ></iframe>
      </div>

      <div className="mt-4 text-sm text-gray-600 flex items-center justify-between">
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 text-amber-500 mr-2 mt-0.5 flex-shrink-0" />
          <p>
            If the calendar doesn't load, make sure it's set to public in your Google Calendar settings.
            <a
              href="https://support.google.com/calendar/answer/37082"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:underline ml-1"
            >
              Learn how
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
