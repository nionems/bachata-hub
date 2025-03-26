"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { RefreshCw, Calendar, AlertCircle, CheckCircle, Bug } from "lucide-react"

export default function CalendarDebugPage() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [envVars, setEnvVars] = useState<any>(null)

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

  const checkEnvironmentVariables = async () => {
    try {
      const response = await fetch("/api/calendar-debug")
      const data = await response.json()
      setEnvVars(data)
    } catch (err: any) {
      console.error("Error checking environment variables:", err)
    }
  }

  useEffect(() => {
    checkEnvironmentVariables()
  }, [])

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Calendar API Debug</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Advanced debugging tool for Google Calendar API integration
          </p>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Bug className="mr-2 h-5 w-5" />
              Environment Variables
            </CardTitle>
            <CardDescription>Check if your environment variables are properly configured</CardDescription>
          </CardHeader>
          <CardContent>
            {envVars ? (
              <div>
                <div className="bg-gray-50 p-3 rounded text-sm font-mono">
                  <div>GOOGLE_API_KEY: {envVars.hasApiKey ? "✅ Set" : "❌ Not set"}</div>
                  {envVars.hasApiKey && <div>First few characters: {envVars.apiKeyFirstChars}</div>}
                  <div>NODE_ENV: {envVars.nodeEnv}</div>
                  <div>VERCEL_ENV: {envVars.vercelEnv || "Not set"}</div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">Loading environment variables...</div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Google Calendar API Test</CardTitle>
            <CardDescription>Test the direct API connection to Google Calendar</CardDescription>
          </CardHeader>
          <CardContent>
            {result ? (
              <div>
                {result.success ? (
                  <div className="bg-green-50 p-4 rounded-lg border border-green-200 mb-4">
                    <div className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5" />
                      <div>
                        <h3 className="font-medium text-green-800">Calendar API is working!</h3>
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
                        <h3 className="font-medium text-red-800">Calendar API failed</h3>
                        <p className="text-red-700 text-sm mt-1">{result.error?.message || "Unknown error occurred"}</p>
                      </div>
                    </div>
                  </div>
                )}

                <div className="mt-4">
                  <h3 className="font-medium mb-2">Debug Information:</h3>
                  <div className="bg-gray-50 p-3 rounded text-sm font-mono overflow-auto max-h-60">
                    <pre>{JSON.stringify(result.debug || result.error, null, 2)}</pre>
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
              </div>
            ) : error ? (
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-start">
                  <AlertCircle className="h-5 w-5 text-red-500 mr-2 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-red-800">Error testing calendar</h3>
                    <p className="text-red-700 text-sm mt-1">{error}</p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-6 text-gray-500">
                Click the button below to test your Google Calendar API connection
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
                  Testing API...
                </>
              ) : (
                <>
                  <Calendar className="h-4 w-4 mr-2" />
                  Test Calendar API
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

        <div className="mt-8 bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <div className="flex items-start">
            <AlertCircle className="h-5 w-5 text-yellow-600 mr-2 mt-0.5" />
            <div>
              <h3 className="font-medium text-yellow-800">Troubleshooting Tips</h3>
              <ul className="text-yellow-700 text-sm mt-1 list-disc pl-5 space-y-1">
                <li>Make sure your .env.local file contains the GOOGLE_API_KEY variable</li>
                <li>Verify that your API key is enabled for the Google Calendar API in Google Cloud Console</li>
                <li>Check that the calendar ID is correct and the calendar is public</li>
                <li>Restart your development server after making changes to environment variables</li>
                <li>Clear your browser cache or try in an incognito window</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
