"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { X } from "lucide-react"

interface SchoolSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface SchoolFormData {
  name: string
  location: string
  state: string
  address: string
  website: string
  instagramUrl: string
  facebookUrl: string
  contactInfo: string
  email: string
  danceStyles: string
  description: string
  imageUrl: string
}

export function SchoolSubmissionForm({ isOpen, onClose }: SchoolSubmissionFormProps) {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    website: '',
    instagramUrl: '',
    facebookUrl: '',
    contactInfo: '',
    email: '',
    danceStyles: '',
    description: '',
    imageUrl: ''
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

    try {
      // Send email notification
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'school_submission',
          data: {
            name: formData.name,
            location: formData.location,
            state: formData.state,
            address: formData.address,
            website: formData.website,
            instagramUrl: formData.instagramUrl,
            facebookUrl: formData.facebookUrl,
            contactInfo: formData.contactInfo,
            email: formData.email,
            danceStyles: formData.danceStyles,
            description: formData.description,
            imageUrl: formData.imageUrl
          }
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email notification')
      }

      setSuccess(true)
      setTimeout(() => {
        onClose()
        setFormData({
          name: '',
          location: '',
          state: '',
          address: '',
          website: '',
          instagramUrl: '',
          facebookUrl: '',
          contactInfo: '',
          email: '',
          danceStyles: '',
          description: '',
          imageUrl: ''
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
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your School
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
            Fill out the form below to submit your dance school for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-primary text-sm sm:text-base">School Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="location" className="text-primary text-sm sm:text-base">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="state" className="text-primary text-sm sm:text-base">State *</Label>
              <StateSelect
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="address" className="text-primary text-sm sm:text-base">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="website" className="text-primary text-sm sm:text-base">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="instagramUrl" className="text-primary text-sm sm:text-base">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/..."
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="facebookUrl" className="text-primary text-sm sm:text-base">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={handleInputChange}
                placeholder="https://facebook.com/..."
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
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
              <Label htmlFor="email" className="text-primary">Email Address *</Label>
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

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="danceStyles" className="text-primary text-sm sm:text-base">Dance Styles *</Label>
              <Input
                id="danceStyles"
                name="danceStyles"
                value={formData.danceStyles}
                onChange={handleInputChange}
                placeholder="e.g., Bachata, Salsa, Kizomba"
                required
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="description" className="text-primary text-sm sm:text-base">Description *</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
              className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="imageUrl" className="text-primary text-sm sm:text-base">School Image *</Label>
            <Input
              id="imageUrl"
              name="imageUrl"
              type="url"
              value={formData.imageUrl}
              onChange={handleInputChange}
              required
              placeholder="https://drive.google.com/..."
              className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
            />
            <p className="text-xs text-gray-500 mt-1">
              To add an image:
              1. Upload your image to Google Drive
              2. Right-click the image and select "Share"
              3. Set access to "Anyone with the link"
              4. Copy the link and paste it here
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-xs sm:text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-xs sm:text-sm">School submitted successfully!</div>
          )}

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 text-sm sm:text-base rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              {isLoading ? 'Submitting...' : 'Submit School'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 