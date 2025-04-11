"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar, Send, Image as ImageIcon } from "lucide-react"
import { toast } from "sonner"
import Image from "next/image"

export default function AddEventPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    eventName: "",
    eventDate: "",
    eventTime: "",
    endTime: "",
    location: "",
    city: "",
    description: "",
    organizerName: "",
    organizerEmail: "",
    ticketLink: "",
    eventLink: "",
    image: null as File | null,
  })

  const states = [
    { value: "NSW", label: "New South Wales" },
    { value: "VIC", label: "Victoria" },
    { value: "QLD", label: "Queensland" },
    { value: "WA", label: "Western Australia" },
    { value: "SA", label: "South Australia" },
    { value: "TAS", label: "Tasmania" },
    { value: "ACT", label: "Australian Capital Territory" },
    { value: "NT", label: "Northern Territory" }
  ];

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error("Image size should be less than 5MB")
        return
      }
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload an image file")
        return
      }
      setFormData((prev) => ({ ...prev, image: file }))
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== null) {
          formDataToSend.append(key, value)
        }
      })

      const response = await fetch("/api/submit-event", {
        method: "POST",
        body: formDataToSend,
      })

      if (!response.ok) {
        throw new Error("Failed to submit event")
      }

      toast.success("Event submitted successfully! We'll review it and add it to the calendar.")
      setFormData({
        eventName: "",
        eventDate: "",
        eventTime: "",
        endTime: "",
        location: "",
        city: "",
        description: "",
        organizerName: "",
        organizerEmail: "",
        ticketLink: "",
        eventLink: "",
        image: null,
      })
      setImagePreview(null)
    } catch (error) {
      toast.error("Failed to submit event. Please try again.")
      console.error("Error submitting event:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-primary mb-4">Submit Your Event</h1>
          <p className="text-lg text-gray-600">
            Fill out the form below to submit your Bachata event. We'll review it and add it to our calendar.
          </p>
        </div>

        <Card className="bg-gradient-to-br from-primary/10 to-secondary/10">
          <CardHeader>
            <CardTitle className="text-primary text-xl">Event Details</CardTitle>
            <CardDescription>Please provide all the necessary information about your event.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventName" className="text-primary">Event Name</Label>
                  <Input
                    id="eventName"
                    name="eventName"
                    value={formData.eventName}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Bachata Social Night"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city" className="text-primary">City</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    placeholder="e.g., Sydney"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="eventDate" className="text-primary">Event Date</Label>
                  <Input
                    id="eventDate"
                    name="eventDate"
                    type="date"
                    value={formData.eventDate}
                    onChange={handleChange}
                    required
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="eventTime" className="text-primary">Start Time</Label>
                    <Input
                      id="eventTime"
                      name="eventTime"
                      type="time"
                      value={formData.eventTime}
                      onChange={handleChange}
                      required
                      className="bg-white/80 backdrop-blur-sm"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="endTime" className="text-primary">End Time</Label>
                    <Input
                      id="endTime"
                      name="endTime"
                      type="time"
                      value={formData.endTime}
                      onChange={handleChange}
                      required
                      className="bg-white/80 backdrop-blur-sm"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="location" className="text-primary">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Full address or venue name"
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="mb-4">
                <Label htmlFor="eventLink" className="text-primary">Event Link</Label>
                <Input
                  type="url"
                  id="eventLink"
                  name="eventLink"
                  placeholder="https://..."
                  className="w-full bg-white/80 backdrop-blur-sm"
                />
                <p className="mt-1 text-sm text-gray-500">
                  Link to your event page or social media post (optional)
                </p>
              </div>

              <div className="mb-4">
                <Label htmlFor="state" className="text-primary">State</Label>
                <select
                  id="state"
                  name="state"
                  required
                  className="w-full bg-white/80 backdrop-blur-sm"
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-primary">Event Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Provide details about your event, including any special features, requirements, or additional information."
                  className="min-h-[100px] bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="organizerName" className="text-primary">Organizer Name</Label>
                  <Input
                    id="organizerName"
                    name="organizerName"
                    value={formData.organizerName}
                    onChange={handleChange}
                    required
                    placeholder="Your name"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="organizerEmail" className="text-primary">Organizer Email</Label>
                  <Input
                    id="organizerEmail"
                    name="organizerEmail"
                    type="email"
                    value={formData.organizerEmail}
                    onChange={handleChange}
                    required
                    placeholder="your@email.com"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="ticketLink" className="text-primary">Ticket Link (Optional)</Label>
                <Input
                  id="ticketLink"
                  name="ticketLink"
                  type="url"
                  value={formData.ticketLink}
                  onChange={handleChange}
                  placeholder="https://..."
                  className="bg-white/80 backdrop-blur-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="image" className="text-primary">Event Image</Label>
                <Input
                  id="image"
                  name="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="bg-white/80 backdrop-blur-sm"
                />
                {imagePreview && (
                  <div className="mt-2">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="h-32 w-32 object-cover rounded-md"
                    />
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => window.history.back()}
                  className="border-primary text-primary hover:bg-primary/10"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-primary hover:bg-primary/90"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Event'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
