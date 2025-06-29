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

interface ShopSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface ShopFormData {
  name: string
  location: string
  state: string
  address: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  instagramUrl: string
  facebookUrl: string
  price: string
  condition: string
  comment: string
  discountCode: string
  imageUrl: string
  googleMapLink: string
  info: string
}

export function ShopSubmissionForm({ isOpen, onClose }: ShopSubmissionFormProps) {
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    instagramUrl: '',
    facebookUrl: '',
    price: '',
    condition: '',
    comment: '',
    discountCode: '',
    imageUrl: '',
    googleMapLink: '',
    info: ''
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
      const response = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'shop_submission',
          data: formData
        }),
      })

      let data;
      try {
        data = await response.json();
      } catch (e) {
        console.error('Failed to parse response:', e);
        throw new Error('Failed to parse server response');
      }

      if (!response.ok) {
        throw new Error(data.details || data.error || 'Failed to submit shop')
      }

      toast.success('Shop submitted successfully!')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        address: '',
        contactName: '',
        contactEmail: '',
        contactPhone: '',
        website: '',
        instagramUrl: '',
        facebookUrl: '',
        price: '',
        condition: '',
        comment: '',
        discountCode: '',
        imageUrl: '',
        googleMapLink: '',
        info: ''
      })
    } catch (error) {
      console.error('Error submitting shop:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit shop. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit your Shop or Item
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
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">Shop name / Item name *</Label>
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
              <Label htmlFor="location" className="text-primary">Location (city) *</Label>
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
              <Label htmlFor="address" className="text-primary">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="contactName" className="text-primary">Contact name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail" className="text-primary">Contact email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone" className="text-primary">Contact phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                value={formData.contactPhone}
                onChange={handleInputChange}
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website" className="text-primary">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl" className="text-primary">Instagram</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookUrl" className="text-primary">Facebook</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={handleInputChange}
                placeholder="https://facebook.com/username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>
          </div>

          <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
            <strong>Note:</strong> Enter at least one contact method (email, phone, website, Instagram, or Facebook) so buyers can contact you.
          </div>

          {/* Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="price" className="text-primary">Price range *</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="e.g., $10-50, Free, etc."
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition" className="text-primary">Condition *</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                required
                className="w-full p-2 border rounded bg-white/80 backdrop-blur-sm"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Second Hand">Second Hand</option>
              </select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-primary">Comment (contact me on insta, 10% off, etc.)</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Any special instructions, contact preferences, or promotional messages..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountCode" className="text-primary">Discount code</Label>
            <Input
              id="discountCode"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleInputChange}
              placeholder="e.g., BACHATA10, SUMMER20"
              className="bg-white/80 backdrop-blur-sm rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl" className="text-primary">Image URL (Google Drive) *</Label>
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
            <div className="text-xs text-gray-600 bg-yellow-50 p-3 rounded-lg">
              <strong>How to add an image:</strong>
              <br />1. Upload your image to Google Drive
              <br />2. Right-click the image and select "Share"
              <br />3. Set access to "Anyone with the link"
              <br />4. Copy the link and paste it here
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="googleMapLink" className="text-primary">Google map link</Label>
            <Input
              id="googleMapLink"
              name="googleMapLink"
              type="url"
              value={formData.googleMapLink}
              onChange={handleInputChange}
              placeholder="https://maps.google.com/..."
              className="bg-white/80 backdrop-blur-sm rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="info" className="text-primary">Item info (worn twice, very comfortable, etc.) *</Label>
            <Textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleInputChange}
              required
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Describe your item: condition, size, material, usage, comfort, etc."
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
              {isLoading ? 'Submitting...' : 'Submit Shop'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 