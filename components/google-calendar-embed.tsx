"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Check, RefreshCw, AlertCircle } from "lucide-react"

export default function GoogleCalendarEmbed() {
  const [isConnected, setIsConnected] = useState(true)
  const [isLoading, setIsLoading] = useState(false)

  const calendarId = "4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com"

  const disconnectCalendar = () => {
    setIsConnected(false)
  }

  const reconnectCalendar = () => {
    setIsLoading(true)
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
    }, 1000)
  }

  if (!isConnected) {
    return (
      <Card className="flex flex-col items-center justify-center p-8 h-full">
        <div className="bg-primary/10 p-4 rounded-full mb-6">
          <Calendar className="h-12 w-12 text-primary" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">Connect to Google Calendar</h3>
        <p className="text-muted-foreground mb-6 text-center max-w-md">
          Connect your Google Calendar to display Bachata events on this website.
        </p>
        <Button onClick={reconnectCalendar} className="bg-primary hover:bg-primary/90 text-white" disabled={isLoading}>
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
      <div className="bg-primary/10 p-3 mb-4 rounded-lg flex items-center justify-between">
        <div className="flex items-center">
          <Check className="h-5 w-5 text-primary mr-2" />
          <span className="text-primary font-medium">Google Calendar Connected</span>
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
          )}&ctz=Australia%2FSydney&wkst=1&bgcolor=%23ffffff&showTitle=0&showNav=1&showDate=1&showPrint=0&showTabs=1&showCalendars=1&showTz=1&color=%2314b8a6`}
          style={{ borderWidth: 0 }}
          width="100%"
          height="600"
          frameBorder="0"
          scrolling="no"
          title="Bachata Australia Events Calendar"
        ></iframe>
      </div>

      <div className="mt-4 text-sm text-muted-foreground flex items-center justify-between">
        <div className="flex items-start">
          <AlertCircle className="h-4 w-4 text-yellow-600 mr-2 mt-0.5 flex-shrink-0" />
          <p>
            If the calendar doesn't load, make sure it's set to public in your Google Calendar settings.
            <a
              href="https://support.google.com/calendar/answer/37082"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline ml-1"
            >
              Learn how
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
