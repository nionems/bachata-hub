"use client"

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"

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
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center">Submit Your Shop</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <Label htmlFor="name">Shop Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Enter shop name"
                />
              </div>

              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  required
                  placeholder="Enter location"
                />
              </div>

              <div>
                <Label htmlFor="state">State *</Label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="w-full rounded-md border border-input bg-background px-3 py-2"
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

              <div>
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  placeholder="Enter address"
                />
              </div>

              <div>
                <Label htmlFor="website">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={handleChange}
                  placeholder="https://example.com"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="instagramLink">Instagram Link</Label>
                <Input
                  id="instagramLink"
                  name="instagramLink"
                  type="url"
                  value={formData.instagramLink}
                  onChange={handleChange}
                  placeholder="https://instagram.com/..."
                />
              </div>

              <div>
                <Label htmlFor="facebookLink">Facebook Link</Label>
                <Input
                  id="facebookLink"
                  name="facebookLink"
                  type="url"
                  value={formData.facebookLink}
                  onChange={handleChange}
                  placeholder="https://facebook.com/..."
                />
              </div>

              <div>
                <Label htmlFor="googleMapLink">Google Maps Link</Label>
                <Input
                  id="googleMapLink"
                  name="googleMapLink"
                  type="url"
                  value={formData.googleMapLink}
                  onChange={handleChange}
                  placeholder="https://maps.google.com/..."
                />
              </div>

              <div>
                <Label htmlFor="comment">Additional Comments</Label>
                <Textarea
                  id="comment"
                  name="comment"
                  value={formData.comment}
                  onChange={handleChange}
                  placeholder="Tell us about your shop..."
                  className="h-24"
                />
              </div>
            </div>
          </div>

          <div className="border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Contact Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="contactName">Your Name *</Label>
                <Input
                  id="contactName"
                  name="contactName"
                  value={formData.contactName}
                  onChange={handleChange}
                  required
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <Label htmlFor="contactEmail">Email Address *</Label>
                <Input
                  id="contactEmail"
                  name="contactEmail"
                  type="email"
                  value={formData.contactEmail}
                  onChange={handleChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <Label htmlFor="contactPhone">Phone Number</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  type="tel"
                  value={formData.contactPhone}
                  onChange={handleChange}
                  placeholder="Enter your phone number"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="additionalInfo">Additional Information</Label>
            <Textarea
              id="additionalInfo"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              placeholder="Any other information you'd like to share..."
              className="h-24"
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 