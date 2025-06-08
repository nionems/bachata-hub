"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { X } from "lucide-react"

interface FestivalSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface FestivalFormData {
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string
  imageUrl: string
  comment: string
  googleMapLink: string
}

export function FestivalSubmissionForm({ isOpen, onClose }: FestivalSubmissionFormProps) {
  const [formData, setFormData] = useState<FestivalFormData>({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    state: '',
    address: '',
    eventLink: '',
    price: '',
    ticketLink: '',
    danceStyles: '',
    imageUrl: '',
    comment: '',
    googleMapLink: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      // Here you would typically send the form data to your API
      // For now, we'll just simulate a successful submission
      await new Promise(resolve => setTimeout(resolve, 1000))
      setSuccess(true)
      setTimeout(() => {
        onClose()
        setFormData({
          name: '',
          startDate: '',
          endDate: '',
          location: '',
          state: '',
          address: '',
          eventLink: '',
          price: '',
          ticketLink: '',
          danceStyles: '',
          imageUrl: '',
          comment: '',
          googleMapLink: ''
        })
        setSuccess(false)
      }, 2000)
    } catch (err) {
      setError('Failed to submit form. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your Festival
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
            Fill out the form below to submit your festival for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">Festival Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-primary">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-primary">End Date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-primary">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state" className="text-primary">State *</Label>
              <StateSelect
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address" className="text-primary">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm"
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
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-primary">Price</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., $50"
                className="bg-white/80 backdrop-blur-sm"
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
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="danceStyles" className="text-primary">Dance Styles *</Label>
              <Input
                id="danceStyles"
                name="danceStyles"
                value={formData.danceStyles}
                onChange={handleInputChange}
                placeholder="e.g., Bachata, Salsa, Kizomba"
                required
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="imageUrl" className="text-primary">Image URL *</Label>
              <Input
                id="imageUrl"
                name="imageUrl"
                type="url"
                value={formData.imageUrl}
                onChange={handleInputChange}
                required
                placeholder="Enter Google Drive image URL"
                className="bg-white/80 backdrop-blur-sm"
              />
              <p className="text-xs text-muted-foreground">
                To add an image:
                <br />1. Upload your image to Google Drive
                <br />2. Right-click the image and select "Share"
                <br />3. Set access to "Anyone with the link"
                <br />4. Copy the link and paste it here
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapLink" className="text-primary">Google Map Link</Label>
              <Input
                id="googleMapLink"
                name="googleMapLink"
                type="url"
                value={formData.googleMapLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-primary">Comment</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm"
              placeholder="Any additional information about the festival..."
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm">Festival submitted successfully!</div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-primary hover:bg-primary/90"
            >
              {isLoading ? 'Submitting...' : 'Submit Festival'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 