'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { toast } from "sonner"
import { X } from "lucide-react"

interface CompetitionSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface CompetitionFormData {
  name: string
  organizer: string
  contactInfo: string
  email: string
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
  categories: string[]
  level: string[]
  socialLink: string
}

const COMPETITION_CATEGORIES = [
  'Jack&Jill',
  'Bachatanama',
  'Team Choregraphy',
  'Solo Choregraphy'
]

const COMPETITION_LEVELS = [
  'Beginner',
  'Novice',
  'Intermediate',
  'Amateur',
  'Advance',
  'Rising Stars',
  'Experienced',
  'Professional',
  'Role Rotation'
]

export function CompetitionSubmissionForm({ isOpen, onClose }: CompetitionSubmissionFormProps) {
  const [formData, setFormData] = useState<CompetitionFormData>({
    name: '',
    organizer: '',
    contactInfo: '',
    email: '',
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
    googleMapLink: '',
    categories: [],
    level: [],
    socialLink: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'select-multiple') {
      const select = e.target as HTMLSelectElement
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value)
      setFormData(prev => ({ ...prev, [name]: selectedOptions }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Submit competition
      const response = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to submit competition')
      }

      // Send email notification
      try {
        const emailResponse = await fetch('/api/send-email', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'competition_submission',
            data: formData
          }),
        })

        if (!emailResponse.ok) {
          const emailError = await emailResponse.json()
          console.error('Failed to send email notification:', emailError)
          // Don't throw error here, just log it
        }
      } catch (emailError) {
        console.error('Error sending email notification:', emailError)
        // Don't throw error here, just log it
      }

      toast.success('Competition submitted successfully!')
      onClose()
      setFormData({
        name: '',
        organizer: '',
        contactInfo: '',
        email: '',
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
        googleMapLink: '',
        categories: [],
        level: [],
        socialLink: ''
      })
    } catch (error) {
      console.error('Error submitting competition:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to submit competition. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your Competition
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
            Fill out the form below to submit your competition for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">Competition Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-primary">Organizer *</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactInfo" className="text-primary">Contact Information *</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
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
                className="bg-white/80 backdrop-blur-sm rounded-lg"
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
                className="bg-white/80 backdrop-blur-sm rounded-lg"
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
              <Label htmlFor="address" className="text-primary">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-primary">Price</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., $50 per category"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="danceStyles" className="text-primary">Dance Styles</Label>
              <Input
                id="danceStyles"
                name="danceStyles"
                value={formData.danceStyles}
                onChange={handleInputChange}
                placeholder="e.g., Bachata, Salsa"
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
              <Label htmlFor="socialLink" className="text-primary">Social Link</Label>
              <Input
                id="socialLink"
                name="socialLink"
                type="url"
                value={formData.socialLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
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
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories" className="text-primary">Categories *</Label>
            <select
              id="categories"
              name="categories"
              multiple
              value={formData.categories}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {COMPETITION_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-primary">Level *</Label>
            <select
              id="level"
              name="level"
              multiple
              value={formData.level}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {COMPETITION_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple levels</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-primary">Description</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Additional information about the competition..."
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
              className="bg-white/80 backdrop-blur-sm rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              To add an image:
              <br />1. Upload your image to Google Drive
              <br />2. Right-click the image and select "Share"
              <br />3. Set access to "Anyone with the link"
              <br />4. Copy the link and paste it here
            </p>
          </div>

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              {isLoading ? 'Submitting...' : 'Submit Competition'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 