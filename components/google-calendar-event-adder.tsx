"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Check, RefreshCw, Plus, Search, X, ArrowRight } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

export default function GoogleCalendarEventAdder() {
  const [isConnected, setIsConnected] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [step, setStep] = useState(1)
  const [personalEvents, setPersonalEvents] = useState([])
  const [selectedEvents, setSelectedEvents] = useState([])
  const [searchTerm, setSearchTerm] = useState("")
  const [successMessage, setSuccessMessage] = useState("")

  // This would be replaced with actual Google OAuth and Calendar API integration
  const connectToGoogleCalendar = () => {
    setIsLoading(true)
    // Simulate API call and OAuth flow
    setTimeout(() => {
      setIsConnected(true)
      setIsLoading(false)
      // Simulate fetching events from user's calendar
      setPersonalEvents([
        {
          id: 1,
          title: "Sydney Bachata Social",
          date: "2025-04-15",
          time: "19:00-23:00",
          location: "Sydney Dance Studio",
        },
        {
          id: 2,
          title: "Melbourne Bachata Workshop",
          date: "2025-04-22",
          time: "14:00-16:00",
          location: "Melbourne Latin Dance",
        },
        {
          id: 3,
          title: "Brisbane Bachata Festival",
          date: "2025-05-10",
          time: "All day",
          location: "Brisbane Convention Center",
        },
        {
          id: 4,
          title: "Perth Bachata Night",
          date: "2025-05-17",
          time: "20:00-00:00",
          location: "Perth Dance Academy",
        },
        {
          id: 5,
          title: "Adelaide Bachata Social",
          date: "2025-05-24",
          time: "19:30-23:30",
          location: "Adelaide Latin Club",
        },
      ])
    }, 1500)
  }

  const toggleEventSelection = (eventId) => {
    if (selectedEvents.includes(eventId)) {
      setSelectedEvents(selectedEvents.filter((id) => id !== eventId))
    } else {
      setSelectedEvents([...selectedEvents, eventId])
    }
  }

  const addSelectedEvents = () => {
    setIsLoading(true)
    // Simulate API call to add events to Bachata Australia calendar
    setTimeout(() => {
      setSuccessMessage(
        `Successfully added ${selectedEvents.length} event${selectedEvents.length !== 1 ? "s" : ""} to Bachata Australia calendar`,
      )
      setIsLoading(false)
      setStep(3)
    }, 1500)
  }

  const resetForm = () => {
    setSelectedEvents([])
    setSuccessMessage("")
    setStep(1)
  }

  const filteredEvents = personalEvents.filter(
    (event) =>
      event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  if (!isConnected) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Add Events from Your Google Calendar</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center justify-center p-6">
          <div className="bg-green-100 p-4 rounded-full mb-6">
            <Calendar className="h-12 w-12 text-green-600" />
          </div>
          <h3 className="text-xl font-semibold mb-4 text-center">Connect to Your Google Calendar</h3>
          <p className="text-gray-600 mb-6 text-center max-w-md">
            Connect your personal Google Calendar to select and add your Bachata events to the Bachata Australia
            calendar.
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
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Add Events from Your Google Calendar</CardTitle>
      </CardHeader>
      <CardContent>
        {step === 1 && (
          <>
            <div className="bg-green-100 p-3 mb-4 rounded-lg flex items-center">
              <Check className="h-5 w-5 text-green-600 mr-2" />
              <span className="text-green-800 font-medium">Your Google Calendar is connected</span>
            </div>

            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search your events..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4 text-gray-400" />
                </button>
              )}
            </div>

            <div className="mb-4 text-sm text-gray-600">
              Select the events you want to add to the Bachata Australia calendar:
            </div>

            <div className="space-y-3 max-h-[400px] overflow-y-auto mb-6">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className={`p-4 border rounded-lg flex items-start transition-colors ${
                      selectedEvents.includes(event.id) ? "border-green-500 bg-green-50" : "border-gray-200"
                    }`}
                  >
                    <Checkbox
                      id={`event-${event.id}`}
                      checked={selectedEvents.includes(event.id)}
                      onCheckedChange={() => toggleEventSelection(event.id)}
                      className="mr-3 mt-1"
                    />
                    <div className="flex-grow">
                      <label htmlFor={`event-${event.id}`} className="font-medium cursor-pointer">
                        {event.title}
                      </label>
                      <div className="text-sm text-gray-600 mt-1">
                        <div>
                          {event.date} • {event.time}
                        </div>
                        <div>{event.location}</div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500">
                  {searchTerm ? "No events match your search" : "No events found in your calendar"}
                </div>
              )}
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                className="border-gray-300"
                onClick={() => {
                  setIsConnected(false)
                  setSelectedEvents([])
                }}
              >
                Disconnect
              </Button>
              <Button
                onClick={() => setStep(2)}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={selectedEvents.length === 0}
              >
                Continue
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </>
        )}

        {step === 2 && (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Confirm Selected Events</h3>
              <p className="text-gray-600 mb-4">
                You're about to add the following {selectedEvents.length} event{selectedEvents.length !== 1 ? "s" : ""}{" "}
                to the Bachata Australia calendar:
              </p>

              <div className="space-y-3 max-h-[300px] overflow-y-auto mb-6 border rounded-lg p-4 bg-gray-50">
                {personalEvents
                  .filter((event) => selectedEvents.includes(event.id))
                  .map((event) => (
                    <div key={event.id} className="pb-3 border-b border-gray-200 last:border-0 last:pb-0">
                      <div className="font-medium">{event.title}</div>
                      <div className="text-sm text-gray-600">
                        <div>
                          {event.date} • {event.time}
                        </div>
                        <div>{event.location}</div>
                      </div>
                    </div>
                  ))}
              </div>

              <div className="bg-blue-50 p-4 rounded-lg mb-6 text-sm text-blue-700">
                <p>
                  <strong>Note:</strong> By adding these events, they will be visible to all users of Bachata Australia.
                  Make sure the event details are accurate and complete.
                </p>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" className="border-gray-300" onClick={() => setStep(1)}>
                Back
              </Button>
              <Button
                onClick={addSelectedEvents}
                className="bg-green-600 hover:bg-green-700 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                    Adding Events...
                  </>
                ) : (
                  <>
                    <Plus className="h-4 w-4 mr-2" />
                    Add to Bachata Australia Calendar
                  </>
                )}
              </Button>
            </div>
          </>
        )}

        {step === 3 && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="bg-green-100 p-4 rounded-full mb-6">
              <Check className="h-12 w-12 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold mb-4 text-center">Events Added Successfully!</h3>
            <p className="text-gray-600 mb-6 text-center">{successMessage}</p>
            <div className="flex space-x-4">
              <Button variant="outline" className="border-gray-300" onClick={resetForm}>
                Add More Events
              </Button>
              <Button
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={() => (window.location.href = "/calendar")}
              >
                View Calendar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
