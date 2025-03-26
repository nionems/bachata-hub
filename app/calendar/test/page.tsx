"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Calendar, AlertCircle, CheckCircle } from "lucide-react"

export default function TestCalendarPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testCalendarConnection = async () => {
    setLoading(true)
    setError(null)

    try {
      const response = await fetch("/api/test-calendar")
      const data = await response.json()
      setResult(data)
    } catch (err: any) {
      setError(err.message || "An error occurred while testing the calendar connection")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Calendar Connection Test</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Use this tool to test your Google Calendar connection and see if events are being fetched correctly.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Google Calendar Test</CardTitle>
            <CardDescription>
              Click the button below to test your Google Calendar connection and see if events are being fetched.
            </CardDescription>
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
                        <p className="text-red-700 text-sm mt-1">{result.error || "Unknown error occurred"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Debug Information:</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                    <div>Calendar ID: {result.debug?.calendarId || "Not provided"}</div>
                    <div>API Key Set: {result.debug?.hasApiKey ? "Yes" : "No"}</div>
                    {result.debug?.apiKeyFirstChars && (
                      <div>API Key (first chars): {result.debug.apiKeyFirstChars}</div>
                    )}
                    <div>Time Min: {result.debug?.timeMin || "Not provided"}</div>
                    <div>Environment: {result.debug?.environment || "Not provided"}</div>
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
                      <div className="text-sm text-gray-600 mt-1">
                        Location: {result.events[0]?.location || "No location specified"}
                      </div>
                    </div>
                  </div>
                )}

                {result.success && result.count === 0 && (
                  <div className="mt-4 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <div className="flex items-start">
                      <AlertCircle className="h-5 w-5 text-yellow-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-yellow-800">No events found</h3>
                        <p className="text-yellow-700 text-sm mt-1">
                          Your calendar is accessible, but no upcoming events were found. Try adding some events to your
                          calendar.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : error || (result && !result.success) ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Error testing calendar</h3>
                    <p className="text-red-700 text-sm mt-1">
                      {error || result?.error?.message || "Unknown error occurred"}
                    </p>
                    {result?.error?.apiKeyFirstChars && (
                      <p className="text-red-700 text-sm mt-1">
                        API Key (first chars): {result.error.apiKeyFirstChars}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Click the button below to test your Google Calendar connection
              </div>
            )}
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button
              onClick={testCalendarConnection}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {loading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Testing...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Test Calendar Connection
                </>
              )}
            </Button>

            {result && result.success && (
              <a href="/calendar" className="flex items-center text-green-600 hover:text-green-700">
                View Calendar Page
              </a>
            )}
          </CardFooter>
        </Card>

        <div className="mt-12 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">How to Add Events to Your Calendar</h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">1. Make Sure Your Calendar is Public</h3>
              <p className="text-gray-700 mt-1">
                Go to your Google Calendar settings, find this calendar, and under "Access permissions" select "Make
                available to public".
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">2. Add Events to Your Calendar</h3>
              <p className="text-gray-700 mt-1">
                Add events directly to your Google Calendar. Make sure they're in the future (past events won't show up
                in "upcoming events").
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">3. Include Complete Event Details</h3>
              <p className="text-gray-700 mt-1">
                For best results, include a title, location, description, and make sure the date and time are correct.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold">4. Wait for Events to Propagate</h3>
              <p className="text-gray-700 mt-1">
                It may take a few minutes for newly added events to become available through the Google Calendar API.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
