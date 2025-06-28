"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { X } from "lucide-react"
import { toast } from "react-hot-toast"

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
  image: File | null
  comment: string
  googleMapLink: string
  featured: 'yes' | 'no'
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
    image: null,
    comment: '',
    googleMapLink: '',
    featured: 'no'
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    setFormData(prev => ({ ...prev, image: file }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // If there's a file, upload it first
      let imageUrl = formData.imageUrl
      if (formData.image) {
        const formDataFile = new FormData()
        formDataFile.append('file', formData.image)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      // Send email notification
      const emailResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'festival_submission',
          data: {
            ...formData,
            imageUrl,
          }
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email notification')
      }

      toast.success('Festival submitted successfully!')
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
        image: null,
        comment: '',
        googleMapLink: '',
        featured: 'no'
      })
    } catch (error) {
      console.error('Error submitting festival:', error)
      toast.error('Failed to submit festival. Please try again.')
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
              <Label htmlFor="featured" className="text-primary">Featured Festival</Label>
              <select
                id="featured"
                name="featured"
                value={formData.featured}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
              <p className="text-xs text-muted-foreground mt-1">
                Featured festivals will be highlighted on the website
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image" className="text-primary">Festival Image *</Label>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="imageUpload" className="text-sm text-muted-foreground">Upload Image</Label>
                  <Input
                    id="imageUpload"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="bg-white/80 backdrop-blur-sm"
                  />
                </div>
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">Or</span>
                  </div>
                </div>
                <div>
                  <Label htmlFor="imageUrl" className="text-sm text-muted-foreground">Use Google Drive Link</Label>
                  <Input
                    id="imageUrl"
                    name="imageUrl"
                    type="url"
                    value={formData.imageUrl}
                    onChange={handleInputChange}
                    placeholder="Enter Google Drive image URL"
                    className="bg-white/80 backdrop-blur-sm"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    To add an image from Google Drive:
                    <br />1. Upload your image to Google Drive
                    <br />2. Right-click the image and select "Share"
                    <br />3. Set access to "Anyone with the link"
                    <br />4. Copy the link and paste it here
                  </p>
                </div>
              </div>
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