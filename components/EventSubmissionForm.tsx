"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { toast } from "sonner"
import { X } from "lucide-react"

interface EventSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface EventFormData {
  eventName: string
  eventDate: string
  eventTime: string
  endTime: string
  location: string
  city: string
  state: string
  description: string
  organizerName: string
  organizerEmail: string
  ticketLink: string
  eventLink: string
}

export function EventSubmissionForm({ isOpen, onClose }: EventSubmissionFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
    eventName: "",
    eventDate: "",
    eventTime: "",
    endTime: "",
    location: "",
    city: "",
    state: "",
    description: "",
    organizerName: "",
    organizerEmail: "",
    ticketLink: "",
    eventLink: ""
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

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

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.details || data.error || "Failed to submit event")
      }

      toast.success("Event submitted successfully! We'll review it and add it to the calendar.")
      onClose()
      setFormData({
        eventName: '',
        eventDate: '',
        eventTime: '',
        endTime: '',
        location: '',
        city: '',
        state: '',
        description: '',
        organizerName: '',
        organizerEmail: '',
        ticketLink: '',
        eventLink: ''
      })
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to submit form. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
      console.error("Error submitting event:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl pb-2">
          <DialogTitle className="text-primary text-lg sm:text-xl">
            Submit Your Event
          </DialogTitle>
          <DialogDescription className="text-sm">
            Include an googledrive image link.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          {/* Event Details Section */}
          <div className="bg-blue-50/50 p-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="eventName" className="text-primary text-xs">Event Name *</Label>
                <Input
                  id="eventName"
                  name="eventName"
                  value={formData.eventName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Bachata Social Night"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="eventDate" className="text-primary text-xs">Date *</Label>
                <Input
                  id="eventDate"
                  name="eventDate"
                  type="date"
                  value={formData.eventDate}
                  onChange={handleInputChange}
                  required
                  min={new Date().toISOString().split('T')[0]}
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="eventTime" className="text-primary text-xs">Start Time *</Label>
                <Input
                  id="eventTime"
                  name="eventTime"
                  type="time"
                  value={formData.eventTime}
                  onChange={handleInputChange}
                  required
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="endTime" className="text-primary text-xs">End Time *</Label>
                <Input
                  id="endTime"
                  name="endTime"
                  type="time"
                  value={formData.endTime}
                  onChange={handleInputChange}
                  required
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Location Section */}
          <div className="bg-green-50/50 p-2 rounded-lg">
            <h3 className="font-medium text-green-800 mb-1 text-xs">Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="location" className="text-primary text-xs">Full Address *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  required
                  placeholder="123 Dance Street, Sydney NSW 2000"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="city" className="text-primary text-xs">City *</Label>
                <Input
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., Sydney"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="state" className="text-primary text-xs">State *</Label>
                <StateSelect
                  value={formData.state}
                  onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Organizer Section */}
          <div className="bg-purple-50/50 p-2 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="organizerName" className="text-primary text-xs">Organizer Name *</Label>
                <Input
                  id="organizerName"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleInputChange}
                  required
                  placeholder="e.g., John Smith"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="organizerEmail" className="text-primary text-xs">Organizer Email *</Label>
                <Input
                  id="organizerEmail"
                  name="organizerEmail"
                  type="email"
                  value={formData.organizerEmail}
                  onChange={handleInputChange}
                  required
                  placeholder="john@example.com"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Links Section */}
          <div className="bg-orange-50/50 p-2 rounded-lg">
            <h3 className="font-medium text-orange-800 mb-1 text-xs">Links (Optional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="ticketLink" className="text-primary text-xs">Ticket Link</Label>
                <Input
                  id="ticketLink"
                  name="ticketLink"
                  type="url"
                  value={formData.ticketLink}
                  onChange={handleInputChange}
                  placeholder="https://tickets.example.com"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="eventLink" className="text-primary text-xs">Event Link</Label>
                <Input
                  id="eventLink"
                  name="eventLink"
                  type="url"
                  value={formData.eventLink}
                  onChange={handleInputChange}
                  placeholder="https://event.example.com"
                  className="bg-white/80 backdrop-blur-sm rounded-lg h-8 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-yellow-50/50 p-2 rounded-lg">
            <h3 className="font-medium text-yellow-800 mb-1 text-xs">Event Description & Image</h3>
            <div className="space-y-1">
              <div className="bg-blue-50 p-1.5 rounded-md">
                <h4 className="font-medium text-blue-800 mb-0.5 text-xs">📸 To include an image/flyer (REQUIRED for carousel display):</h4>
                <ol className="list-decimal list-inside text-blue-700 space-y-0 text-xs">
                  <li>Upload image to Google Drive</li>
                  <li>Right-click → "Get link"</li>
                  <li>Set access to "Anyone with link can view"</li>
                  <li>Paste the link in description below</li>
                </ol>
                <p className="text-blue-700 text-xs mt-1 font-medium">💡 Only Google Drive images will appear in the main page carousel!</p>
              </div>
              <div className="space-y-0.5">
                <Label htmlFor="description" className="text-primary text-xs">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="min-h-[60px] bg-white/80 backdrop-blur-sm rounded-lg text-sm"
                  placeholder="Describe your event: music style, number of rooms, workshops, social dancing, skill levels, etc. IMPORTANT: To make sure your event image appears in the carousel on the main page, paste a Google Drive image link here!"
                />
              </div>
            </div>
          </div>

          {error && (
            <div className="text-red-500 text-sm mt-2">{error}</div>
          )}

          <div className="flex justify-end pt-2">
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 rounded-lg h-8"
            >
              {isLoading ? 'Submitting...' : 'Submit Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 