"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import { X } from "lucide-react"

interface ShopFormData {
  name: string
  location: string
  state: string
  address: string
  website: string
  instagramLink: string
  facebookLink: string
  googleMapLink: string
  comment: string
  contactName: string
  contactEmail: string
  contactPhone: string
  additionalInfo: string
}

interface ShopSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

export function ShopSubmissionForm({ isOpen, onClose }: ShopSubmissionFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    website: '',
    instagramLink: '',
    facebookLink: '',
    googleMapLink: '',
    comment: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    additionalInfo: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          subject: 'New Shop Submission',
          message: `
New Shop Submission Details:

Shop Information:
- Name: ${formData.name}
- Location: ${formData.location}
- State: ${formData.state}
- Address: ${formData.address}
- Website: ${formData.website}
- Instagram: ${formData.instagramLink}
- Facebook: ${formData.facebookLink}
- Google Maps: ${formData.googleMapLink}
- Additional Comments: ${formData.comment}

Contact Information:
- Name: ${formData.contactName}
- Email: ${formData.contactEmail}
- Phone: ${formData.contactPhone}

Additional Information:
${formData.additionalInfo}
          `,
          email: formData.contactEmail,
          name: formData.contactName
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to submit form')
      }

      toast.success('Thank you for your submission! We will review it and get back to you soon.')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        address: '',
        website: '',
        instagramLink: '',
        facebookLink: '',
        googleMapLink: '',
        comment: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        additionalInfo: ''
      })
    } catch (error) {
      console.error('Error submitting form:', error)
      toast.error('Failed to submit form. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your Shop
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
            Fill out the form below to submit your shop for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="name" className="text-primary text-sm sm:text-base">Shop Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter shop name"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="location" className="text-primary text-sm sm:text-base">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter location"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="state" className="text-primary text-sm sm:text-base">State *</Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full rounded-lg border border-input bg-white/80 backdrop-blur-sm text-sm sm:text-base px-3 py-2"
              >
                <option value="">Select a state</option>
                <option value="NSW">New South Wales</option>
                <option value="VIC">Victoria</option>
                <option value="QLD">Queensland</option>
                <option value="WA">Western Australia</option>
                <option value="SA">South Australia</option>
                <option value="TAS">Tasmania</option>
                <option value="ACT">Australian Capital Territory</option>
                <option value="NT">Northern Territory</option>
              </select>
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="address" className="text-primary text-sm sm:text-base">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="Enter address"
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
                onChange={handleChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="instagramLink" className="text-primary text-sm sm:text-base">Instagram Link</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                type="url"
                value={formData.instagramLink}
                onChange={handleChange}
                placeholder="https://instagram.com/username"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="facebookLink" className="text-primary text-sm sm:text-base">Facebook Link</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                type="url"
                value={formData.facebookLink}
                onChange={handleChange}
                placeholder="https://facebook.com/username"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="googleMapLink" className="text-primary text-sm sm:text-base">Google Maps Link</Label>
              <Input
                id="googleMapLink"
                name="googleMapLink"
                type="url"
                value={formData.googleMapLink}
                onChange={handleChange}
                placeholder="https://maps.google.com/..."
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="contactName" className="text-primary text-sm sm:text-base">Contact Name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                placeholder="Enter contact name"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="contactEmail" className="text-primary text-sm sm:text-base">Contact Email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                required
                placeholder="Enter contact email"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="contactPhone" className="text-primary text-sm sm:text-base">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter contact phone"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="comment" className="text-primary text-sm sm:text-base">Additional Comments</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleChange}
              placeholder="Tell us about your shop..."
              className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
            />
          </div>

          <div className="space-y-1 sm:space-y-2">
            <Label htmlFor="additionalInfo" className="text-primary text-sm sm:text-base">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any additional information..."
              className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
            />
          </div>

          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 text-sm sm:text-base rounded-lg"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Shop'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 