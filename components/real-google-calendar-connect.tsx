"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, RefreshCw } from "lucide-react"

export default function RealGoogleCalendarConnect() {
  const [isLoading, setIsLoading] = useState(false)
  const [authUrl, setAuthUrl] = useState("")

  useEffect(() => {
    // Get the auth URL when component mounts
    const getAuthUrl = async () => {
      try {
        const response = await fetch("/api/google-calendar")
        const data = await response.json()
        setAuthUrl(data.authUrl)
      } catch (error) {
        console.error("Error getting auth URL:", error)
      }
    }

    getAuthUrl()
  }, [])

  const handleConnect = useCallback(() => {
    setIsLoading(true)

    // Open the Google authorization page in a new window
    const authWindow = window.open(authUrl, "googleAuth", "width=600,height=600")

    // Create a message handler function
    const handleMessage = async (event: MessageEvent) => {
      if (event.data.type === "GOOGLE_AUTH_CALLBACK") {
        const { code } = event.data

        try {
          // Exchange code for tokens and get events
          const response = await fetch("/api/google-calendar", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ code }),
          })

          const data = await response.json()

          // Do something with the events
          console.log("Calendar events:", data.events)

          // Close the auth window
          if (authWindow) {
            authWindow.close()
          }

          setIsLoading(false)
          
          // Remove the event listener after successful handling
          window.removeEventListener("message", handleMessage)
        } catch (error) {
          console.error("Error exchanging code for tokens:", error)
          setIsLoading(false)
          
          // Remove the event listener on error too
          window.removeEventListener("message", handleMessage)
        }
      }
    }

    // Add the event listener
    window.addEventListener("message", handleMessage)
    
    // Set a timeout to remove the listener if no response is received
    const timeout = setTimeout(() => {
      window.removeEventListener("message", handleMessage)
      setIsLoading(false)
    }, 300000) // 5 minutes timeout

    // Clean up timeout if component unmounts
    return () => {
      clearTimeout(timeout)
      window.removeEventListener("message", handleMessage)
    }
  }, [authUrl])

  return (
    <Card className="p-6">
      <div className="flex flex-col items-center text-center">
        <div className="bg-green-100 p-4 rounded-full mb-6">
          <Calendar className="h-12 w-12 text-green-600" />
        </div>
        <h3 className="text-xl font-semibold mb-4">Connect to Google Calendar</h3>
        <p className="text-gray-600 mb-6 max-w-md">
          Connect your Google Calendar to display your events on the Bachata Australia website. This requires Google API
          credentials to be properly set up.
        </p>
        <Button
          onClick={handleConnect}
          className="bg-green-600 hover:bg-green-700 text-white"
          disabled={isLoading || !authUrl}
        >
          {isLoading ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Connecting...
            </>
          ) : (
            <>
              <Calendar className="h-4 w-4 mr-2" />
              Connect with Google
            </>
          )}
        </Button>
      </div>
    </Card>
  )
}
