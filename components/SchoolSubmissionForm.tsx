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
  socialUrl: string
  contactInfo: string
  danceStyles: string
  description: string
  image: File | null
}

export function SchoolSubmissionForm({ isOpen, onClose }: SchoolSubmissionFormProps) {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    website: '',
    socialUrl: '',
    contactInfo: '',
    danceStyles: '',
    description: '',
    image: null
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, image: e.target.files![0] }))
    }
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
          location: '',
          state: '',
          address: '',
          website: '',
          socialUrl: '',
          contactInfo: '',
          danceStyles: '',
          description: '',
          image: null
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
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
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
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="state" className="text-primary text-sm sm:text-base">State *</Label>
              <StateSelect
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
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
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
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
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="socialUrl" className="text-primary text-sm sm:text-base">Social Media URL</Label>
              <Input
                id="socialUrl"
                name="socialUrl"
                type="url"
                value={formData.socialUrl}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="contactInfo" className="text-primary text-sm sm:text-base">Contact Information *</Label>
              <Input
                id="contactInfo"
                name="contactInfo"
                value={formData.contactInfo}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
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
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
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
              className="min-h-[100px] bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="image" className="text-primary text-sm sm:text-base">School Image</Label>
            <Input
              id="image"
              name="image"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="bg-white/80 backdrop-blur-sm text-sm sm:text-base"
            />
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
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 text-sm sm:text-base"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-sm sm:text-base"
            >
              {isLoading ? 'Submitting...' : 'Submit School'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 