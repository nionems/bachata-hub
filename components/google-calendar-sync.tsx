"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, Check, RefreshCw, Clock } from "lucide-react"
import { Switch } from "@/components/ui/switch"

export default function GoogleCalendarSync() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [autoSync, setAutoSync] = useState(true)
  const [lastSynced, setLastSynced] = useState<Date | null>(null)
  const [calendarId, setCalendarId] = useState(
    "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com",
  )

  // This would be replaced with actual Google OAuth and Calendar API integration
  const connectToGoogleCalendar = () => {
    setIsLoading(true)
    // Simulate API call and OAuth flow
    setTimeout(() => {
      setIsConnected(true)
      setLastSynced(new Date())
      setIsLoading(false)
    }, 1500)
  }

  const syncCalendar = () => {
    setIsLoading(true)
    // Simulate API call to sync calendar
    setTimeout(() => {
      setLastSynced(new Date())
      setIsLoading(false)
    }, 1500)
  }

  // Auto-sync effect
  useEffect(() => {
    if (isConnected && autoSync) {
      const interval = setInterval(() => {
        syncCalendar()
      }, 3600000) // Sync every hour

      return () => clearInterval(interval)
    }
  }, [isConnected, autoSync])

  if (!isConnected) {
    return (
      <Card className="flex flex-col items-center justify-center p-8">
        <div className="bg-green-100 p-4 rounded-full mb-6">
          <Calendar className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-4 text-center">Connect Your Google Calendar</h3>
        <p className="text-gray-600 mb-6 text-center max-w-md">
          Connect your Google Calendar to automatically display all your events on the Bachata Australia website.
        </p>
        <Button
          onClick={connectToGoogleCalendar}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading}
        >
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
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <div className="bg-green-100 p-2 rounded-full mr-3">
            <Check className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <h3 className="font-semibold">Google Calendar Connected</h3>
            <p className="text-sm text-gray-600">
              Your events are automatically synced to the Bachata Australia website
            </p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-red-600 text-red-600 hover:bg-red-50"
          onClick={() => setIsConnected(false)}
        >
          Disconnect
        </Button>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center">
            <Clock className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Last synced:</span>
          </div>
          <span className="text-sm font-medium">
            {lastSynced
              ? new Intl.DateTimeFormat("en-AU", {
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(lastSynced)
              : "Never"}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <RefreshCw className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-700">Auto-sync:</span>
          </div>
          <Switch checked={autoSync} onCheckedChange={setAutoSync} />
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div className="text-sm text-gray-600">
          {autoSync ? "Events sync automatically every hour" : "Auto-sync is disabled"}
        </div>
        <Button
          size="sm"
          onClick={syncCalendar}
          disabled={isLoading}
          className="bg-green-600 hover:bg-green-700 text-white"
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Syncing...
            </>
          ) : (
            <>
              <RefreshCw className="h-4 w-4 mr-2" />
              Sync Now
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
