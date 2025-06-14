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

interface DJSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface DJFormData {
  name: string
  location: string
  state: string
  contact: string
  email: string
  musicStyles: string
  imageUrl: string
  comment: string
  instagramLink: string
  facebookLink: string
  emailLink: string
  musicLink: string
}

export function DJSubmissionForm({ isOpen, onClose }: DJSubmissionFormProps) {
  const [formData, setFormData] = useState<DJFormData>({
    name: '',
    location: '',
    state: '',
    contact: '',
    email: '',
    musicStyles: '',
    imageUrl: '',
    comment: '',
    instagramLink: '',
    facebookLink: '',
    emailLink: '',
    musicLink: ''
  })

  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Send email notification
      const emailResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'dj_submission',
          data: formData
        }),
      })

      if (!emailResponse.ok) {
        throw new Error('Failed to send email notification')
      }

      toast.success('DJ submitted successfully!')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        contact: '',
        email: '',
        musicStyles: '',
        imageUrl: '',
        comment: '',
        instagramLink: '',
        facebookLink: '',
        emailLink: '',
        musicLink: ''
      })
    } catch (error) {
      console.error('Error submitting DJ:', error)
      toast.error('Failed to submit DJ. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your DJ Profile
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
            Fill out the form below to submit your DJ profile for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">DJ Name *</Label>
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
              <Label htmlFor="contact" className="text-primary">Contact Information *</Label>
              <Input
                id="contact"
                name="contact"
                value={formData.contact}
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

            <div className="space-y-2">
              <Label htmlFor="musicStyles" className="text-primary">Music Styles *</Label>
              <Input
                id="musicStyles"
                name="musicStyles"
                value={formData.musicStyles}
                onChange={handleInputChange}
                placeholder="e.g., Bachata, Salsa, Kizomba"
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
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

            <div className="space-y-2">
              <Label htmlFor="instagramLink" className="text-primary">Instagram Link</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                type="url"
                value={formData.instagramLink}
                onChange={handleInputChange}
                placeholder="https://instagram.com/username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookLink" className="text-primary">Facebook Link</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                type="url"
                value={formData.facebookLink}
                onChange={handleInputChange}
                placeholder="https://facebook.com/username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailLink" className="text-primary">Email</Label>
              <Input
                id="emailLink"
                name="emailLink"
                type="email"
                value={formData.emailLink}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="musicLink" className="text-primary">Music Link</Label>
              <Input
                id="musicLink"
                name="musicLink"
                type="url"
                value={formData.musicLink}
                onChange={handleInputChange}
                placeholder="https://soundcloud.com/username or https://mixcloud.com/username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
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
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Any additional information about your DJ services..."
            />
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
              {isLoading ? 'Submitting...' : 'Submit DJ Profile'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 