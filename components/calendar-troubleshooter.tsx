"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { AlertCircle, CheckCircle, RefreshCw, ExternalLink } from "lucide-react"

export default function CalendarTroubleshooter() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState<string | null>(null)

  const checkCalendar = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/calendar-debug")
      const data = await response.json()
      setResult(data)
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred while checking the calendar"
      setError(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Google Calendar Troubleshooter</CardTitle>
        <CardDescription>Check if your Google Calendar is properly connected and accessible</CardDescription>
      </CardHeader>
      <CardContent>
        {result ? (
          <div>
            {result.success ? (
              <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                <div className="flex items-start">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-green-800">Calendar is accessible!</h3>
                    <p className="text-green-700 text-sm mt-1">
                      Found {result.count} upcoming events in your calendar.
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200 mb-4">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Calendar access failed</h3>
                    <p className="text-red-700 text-sm mt-1">{result.error?.message || "Unknown error occurred"}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="font-medium mb-2">Environment Information:</h3>
              <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                <div>API Key Set: {result.environment?.hasApiKey ? "Yes" : "No"}</div>
                <div>Environment: {result.environment?.nodeEnv || "unknown"}</div>
              </div>
            </div>

            {result.success && result.count > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">First Event:</h3>
                <div className="bg-gray-50 p-3 rounded">
                  <div className="font-medium">{result.events[0]?.summary || "Untitled Event"}</div>
                  <div className="text-sm text-gray-600">
                    {new Date(result.events[0]?.start?.dateTime || result.events[0]?.start?.date).toLocaleString()}
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : error ? (
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
              <div>
                <h3 className="font-medium text-red-800">Error checking calendar</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-6 text-gray-500">
            Click the button below to check your Google Calendar connection
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button onClick={checkCalendar} disabled={loading} className="bg-green-600 hover:bg-green-700 text-white">
          {loading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Checking...
            </>
          ) : (
            "Check Calendar Connection"
          )}
        </Button>

        <a
          href="https://calendar.google.com/calendar/u/0/r/settings"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center text-green-600 hover:text-green-700"
        >
          <ExternalLink className="h-4 w-4 mr-1" />
          Open Google Calendar Settings
        </a>
      </CardFooter>
    </Card>
  )
}
