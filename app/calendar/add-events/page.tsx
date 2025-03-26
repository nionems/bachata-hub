"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, Clock, MapPin, Info, CheckCircle, RefreshCw } from "lucide-react"

export default function AddEventPage() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    location: "",
    date: "",
    startTime: "",
    endTime: "",
    organizer: "",
    email: "",
    website: "",
  })

  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState("")

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1500))
      setSuccess(true)
      setFormData({
        title: "",
        description: "",
        location: "",
        date: "",
        startTime: "",
        endTime: "",
        organizer: "",
        email: "",
        website: "",
      })
    } catch (err) {
      setError("An error occurred while submitting your event")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="container mx-auto py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-200">
            <CardHeader className="bg-green-50 border-b border-green-100">
              <CardTitle className="text-green-800 flex items-center">
                <CheckCircle className="h-6 w-6 mr-2 text-green-600" />
                Event Submitted Successfully
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <p className="text-gray-700 mb-4">
                Thank you for submitting your Bachata event! Our team will review your submission and add it to the
                calendar.
              </p>
              <p className="text-gray-700 mb-4">
                You should receive a confirmation email shortly. If you have any questions, please contact us.
              </p>
              <div className="flex justify-center mt-6">
                <Button onClick={() => setSuccess(false)} className="bg-green-600 hover:bg-green-700 text-white mr-4">
                  Submit Another Event
                </Button>
                <Button
                  onClick={() => (window.location.href = "/calendar")}
                  variant="outline"
                  className="border-green-600 text-green-600 hover:bg-green-50"
                >
                  View Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Submit Your Bachata Event</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Fill out the form below to add your Bachata event to our community calendar.
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Event Details</CardTitle>
            <CardDescription>
              Please provide all the details about your event. All fields are required unless marked as optional.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title" className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-gray-500" />
                    Event Title
                  </Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Sydney Bachata Social Night"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description" className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-gray-500" />
                    Event Description
                  </Label>
                  <Textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Provide details about your event..."
                    rows={4}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="date" className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                      Event Date
                    </Label>
                    <Input id="date" name="date" type="date" value={formData.date} onChange={handleChange} required />
                  </div>

                  <div>
                    <Label htmlFor="location" className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                      Location
                    </Label>
                    <Input
                      id="location"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Venue name and address"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="startTime" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      Start Time
                    </Label>
                    <Input
                      id="startTime"
                      name="startTime"
                      type="time"
                      value={formData.startTime}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="endTime" className="flex items-center">
                      <Clock className="h-4 w-4 mr-2 text-gray-500" />
                      End Time
                    </Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="organizer" className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      Organizer Name
                    </Label>
                    <Input
                      id="organizer"
                      name="organizer"
                      value={formData.organizer}
                      onChange={handleChange}
                      placeholder="Your name or organization"
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="email" className="flex items-center">
                      <Info className="h-4 w-4 mr-2 text-gray-500" />
                      Contact Email
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="your@email.com"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="website" className="flex items-center">
                    <Info className="h-4 w-4 mr-2 text-gray-500" />
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourevent.com"
                  />
                </div>
              </div>

              {error && <div className="bg-red-50 p-4 rounded-lg border border-red-200 text-red-700">{error}</div>}

              <div className="pt-4">
                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700 text-white" disabled={loading}>
                  {loading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit Event"
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
          <CardFooter className="bg-gray-50 border-t text-sm text-gray-600">
            All events are subject to review before being added to the calendar. We typically process submissions within
            24-48 hours.
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
