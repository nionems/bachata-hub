'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

interface MediaSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface MediaFormData {
  name: string
  location: string
  state: string
  contact: string
  comment: string
  instagramLink: string
  facebookLink: string
  emailLink: string
  mediaLink: string
  mediaLink2: string
  imageUrl: string
}

const AUSTRALIAN_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' }
]

export function MediaSubmissionForm({ isOpen, onClose }: MediaSubmissionFormProps) {
  const [formData, setFormData] = useState<MediaFormData>({
    name: '',
    location: '',
    state: '',
    contact: '',
    comment: '',
    instagramLink: '',
    facebookLink: '',
    emailLink: '',
    mediaLink: '',
    mediaLink2: '',
    imageUrl: ''
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
      const response = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error('Failed to submit media')
      }

      // Send email notification
      const emailResponse = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'media_submission',
          data: formData
        }),
      })

      if (!emailResponse.ok) {
        console.error('Failed to send email notification')
      }

      toast.success('Media submitted successfully!')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        contact: '',
        comment: '',
        instagramLink: '',
        facebookLink: '',
        emailLink: '',
        mediaLink: '',
        mediaLink2: '',
        imageUrl: ''
      })
    } catch (error) {
      console.error('Error submitting media:', error)
      toast.error('Failed to submit media. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl">Submit Your Media</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">Name *</Label>
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
              <Select
                value={formData.state}
                onValueChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                required
              >
                <SelectTrigger className="bg-white/80 backdrop-blur-sm rounded-lg">
                  <SelectValue placeholder="Select a state" />
                </SelectTrigger>
                <SelectContent className="rounded-lg">
                  {AUSTRALIAN_STATES.map((state) => (
                    <SelectItem key={state.code} value={state.code}>
                      {state.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="contact" className="text-primary">Contact *</Label>
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
              <Label htmlFor="mediaLink" className="text-primary">Media Link *</Label>
              <Input
                id="mediaLink"
                name="mediaLink"
                type="url"
                value={formData.mediaLink}
                onChange={handleInputChange}
                required
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaLink2" className="text-primary">Media Link 2</Label>
              <Input
                id="mediaLink2"
                name="mediaLink2"
                type="url"
                value={formData.mediaLink2}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-primary">Description</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Any additional information about your media content..."
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
              {isLoading ? 'Submitting...' : 'Submit Media'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 
 
 
 