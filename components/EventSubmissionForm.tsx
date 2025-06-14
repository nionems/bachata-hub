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
import { Select, SelectItem, SelectTrigger, SelectValue, SelectContent } from "@/components/ui/select"

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
  colorId: string
}

export function EventSubmissionForm({ isOpen, onClose }: EventSubmissionFormProps) {
  const [formData, setFormData] = useState<EventFormData>({
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
    eventLink: '',
    colorId: '1'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const colorOptions = [
    { id: "1", name: "Lavender", value: "#7986cb" },
    { id: "2", name: "Sage", value: "#33b679" },
    { id: "3", name: "Grape", value: "#8e24aa" },
    { id: "4", name: "Flamingo", value: "#e67c73" },
    { id: "5", name: "Banana", value: "#f6c026" },
    { id: "6", name: "Tangerine", value: "#f5511d" },
    { id: "7", name: "Peacock", value: "#039be5" },
    { id: "8", name: "Graphite", value: "#616161" },
    { id: "9", name: "Blueberry", value: "#3f51b5" },
    { id: "10", name: "Basil", value: "#0b8043" },
    { id: "11", name: "Tomato", value: "#d60000" },
  ];

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'event_submission',
          data: formData
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit event')
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
        eventLink: '',
        colorId: '1'
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
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your Event
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
          <DialogDescription className="text-sm sm:text-base">
            Fill out the form below to submit your event for review. You can include an image link in the description.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="eventName" className="text-primary">Event Name *</Label>
              <Input
                id="eventName"
                name="eventName"
                value={formData.eventName}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventDate" className="text-primary">Date *</Label>
              <Input
                id="eventDate"
                name="eventDate"
                type="date"
                value={formData.eventDate}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventTime" className="text-primary">Start Time *</Label>
              <Input
                id="eventTime"
                name="eventTime"
                type="time"
                value={formData.eventTime}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endTime" className="text-primary">End Time *</Label>
              <Input
                id="endTime"
                name="endTime"
                type="time"
                value={formData.endTime}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-primary">Full Address *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Enter full address including postcode (e.g., 123 Dance Street, Sydney NSW 2000)"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city" className="text-primary">City *</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-primary">State *</Label>
              <StateSelect
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizerName" className="text-primary">Organizer Name *</Label>
              <Input
                id="organizerName"
                name="organizerName"
                value={formData.organizerName}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizerEmail" className="text-primary">Organizer Email *</Label>
              <Input
                id="organizerEmail"
                name="organizerEmail"
                type="email"
                value={formData.organizerEmail}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketLink" className="text-primary">Ticket Link</Label>
              <Input
                id="ticketLink"
                name="ticketLink"
                type="url"
                value={formData.ticketLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLink" className="text-primary">Event Link</Label>
              <Input
                id="eventLink"
                name="eventLink"
                type="url"
                value={formData.eventLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="colorId" className="text-primary">Event Color</Label>
              <Select
                value={formData.colorId}
                onValueChange={(value) => setFormData(prev => ({ ...prev, colorId: value }))}
              >
                <SelectTrigger className="bg-white/80 backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent>
                  {colorOptions.map((color) => (
                    <SelectItem key={color.id} value={color.id}>
                      <div className="flex items-center">
                        <div
                          className="w-4 h-4 rounded-full mr-2"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="bg-blue-50 p-4 rounded-md mb-4">
              <h4 className="font-medium text-blue-800 mb-2">To include an image or flyer with your event:</h4>
              <ol className="list-decimal list-inside text-blue-700 space-y-1">
                <li>Upload the image to your own Google Drive.</li>
                <li>Right-click the file and select "Get link".</li>
                <li>Set the access to "Anyone with the link can view".</li>
                <li>Copy the public share link and paste it below.</li>
              </ol>
            </div>
            <Label htmlFor="description" className="text-primary">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Tell us more about your event... You can include an image link here."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-primary text-primary hover:bg-primary/10 rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90 rounded-lg"
            >
              {isLoading ? 'Submitting...' : 'Submit Event'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 