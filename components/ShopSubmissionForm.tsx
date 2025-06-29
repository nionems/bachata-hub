"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { toast } from "sonner"
import { X, Upload, Camera, Image as ImageIcon } from "lucide-react"

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
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file')
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size is too big. Please select an image smaller than 5MB.')
        return
      }

      setSelectedFile(file)
      
      // Create preview
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    
    // Validate that at least one contact method is provided
    const hasContactMethod = formData.website || formData.instagramUrl || formData.facebookUrl || formData.contactPhone
    if (!hasContactMethod) {
      toast.error('Please provide at least one contact method (website, Instagram, Facebook, or phone) so buyers can contact you.')
      return
    }
    
    setIsLoading(true)
    setUploadProgress(0)

    try {
      let finalImageUrl = formData.imageUrl

      // Upload image if file is selected
      if (selectedFile) {
        setUploadProgress(10)
        
        const formDataUpload = new FormData()
        formDataUpload.append('file', selectedFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataUpload,
        })

        setUploadProgress(50)

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        finalImageUrl = uploadData.imageUrl
        setUploadProgress(100)
      }

      // Validate that we have an image URL
      if (!finalImageUrl) {
        throw new Error('Please provide an image for your item')
      }

      // Submit to the shops API with status: 'pending'
      const shopResponse = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl: finalImageUrl,
          status: 'pending',
        }),
      })

      if (!shopResponse.ok) {
        const shopData = await shopResponse.json()
        throw new Error(shopData.details || shopData.error || 'Failed to submit shop')
      }

      toast.success('Shop submitted successfully! It will be reviewed by our team.')
      onClose()
      
      // Reset form
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
      setSelectedFile(null)
      setImagePreview(null)
      setUploadProgress(0)
    } catch (error) {
      console.error('Error submitting shop:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit shop. Please try again.'
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Add Listing
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
                placeholder="e.g., Dance Shoes Store, Fuego Heels, etc."
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
                placeholder="e.g., Sydney, Melbourne, Brisbane"
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
                placeholder="not mandatory..."
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
                placeholder="e.g., John Smith, Maria Garcia"
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
                placeholder="for admin approval(won't be shared)"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>
          </div>

          {/* Contact Methods Group */}
          <div className="space-y-3 bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
              <strong>Note:</strong> Enter at least one contact method (email, phone, website, Instagram, or Facebook) so buyers can contact you.
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contactPhone" className="text-primary">Contact phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="e.g., 0412 345 678"
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
                  onChange={(e) => {
                    let value = e.target.value
                    // Auto-add https:// if user just enters domain
                    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                      value = 'https://' + value
                    }
                    setFormData(prev => ({ ...prev, website: value }))
                  }}
                  placeholder="yourwebsite.com or https://yourwebsite.com"
                  className="bg-white/80 backdrop-blur-sm rounded-lg"
                />
                <p className="text-xs text-gray-500">Just enter your domain (e.g., mydanceshop.com) or full URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="instagramUrl" className="text-primary">Instagram</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="url"
                  value={formData.instagramUrl}
                  onChange={(e) => {
                    let value = e.target.value
                    // Auto-format Instagram URLs
                    if (value) {
                      if (value.includes('instagram.com/')) {
                        // Already a full URL
                        if (!value.startsWith('http://') && !value.startsWith('https://')) {
                          value = 'https://' + value
                        }
                      } else {
                        // Just username - convert to full URL
                        const username = value.replace('@', '').replace('https://', '').replace('http://', '').replace('instagram.com/', '')
                        value = `https://instagram.com/${username}`
                      }
                    }
                    setFormData(prev => ({ ...prev, instagramUrl: value }))
                  }}
                  placeholder="@yourusername or instagram.com/yourusername"
                  className="bg-white/80 backdrop-blur-sm rounded-lg"
                />
                <p className="text-xs text-gray-500">Enter @username, username, or full Instagram URL</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="facebookUrl" className="text-primary">Facebook</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => {
                    let value = e.target.value
                    // Auto-format Facebook URLs
                    if (value) {
                      if (value.includes('facebook.com/')) {
                        // Already a full URL
                        if (!value.startsWith('http://') && !value.startsWith('https://')) {
                          value = 'https://' + value
                        }
                      } else {
                        // Just username/page name - convert to full URL
                        const username = value.replace('@', '').replace('https://', '').replace('http://', '').replace('facebook.com/', '')
                        value = `https://facebook.com/${username}`
                      }
                    }
                    setFormData(prev => ({ ...prev, facebookUrl: value }))
                  }}
                  placeholder="@yourpage or facebook.com/yourpage"
                  className="bg-white/80 backdrop-blur-sm rounded-lg"
                />
                <p className="text-xs text-gray-500">Enter @pagename, pagename, or full Facebook URL</p>
              </div>
            </div>
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
              placeholder="how you want to be contacted unless website is provided or discount percentage."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="discountCode" className="text-primary">Discount code</Label>
            <Input
              id="discountCode"
              name="discountCode"
              value={formData.discountCode}
              onChange={handleInputChange}
              placeholder="e.g., BACHATAAU"
              className="bg-white/80 backdrop-blur-sm rounded-lg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="image" className="text-primary">Shop/Item Image *</Label>
            <p className="text-xs text-gray-600 bg-yellow-50 p-2 rounded-lg border border-yellow-200">
              📸 <strong>1 photo only per item</strong> - Choose your best image that shows the item clearly
            </p>
            
            {/* File Upload Section */}
            <div className="space-y-3">
              {/* Camera and Gallery Options */}
              <div className="grid grid-cols-2 gap-3">
                {/* Camera Option */}
                <div className="relative">
                  <input
                    id="camera-input"
                    name="camera-input"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="camera-input"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white/80 backdrop-blur-sm"
                  >
                    <Camera className="h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 text-center">
                      <span className="font-medium text-primary">Take Photo</span>
                    </p>
                  </label>
                </div>

                {/* Gallery Option */}
                <div className="relative">
                  <input
                    id="gallery-input"
                    name="gallery-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="gallery-input"
                    className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-primary transition-colors bg-white/80 backdrop-blur-sm"
                  >
                    <ImageIcon className="h-6 w-6 text-gray-400 mb-1" />
                    <p className="text-xs text-gray-600 text-center">
                      <span className="font-medium text-primary">Choose from Gallery</span>
                    </p>
                  </label>
                </div>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative group">
                  <div 
                    className="relative cursor-pointer overflow-hidden rounded-lg border"
                    onClick={() => {
                      // Open image in new tab/window
                      const newWindow = window.open()
                      if (newWindow) {
                        newWindow.document.write(`
                          <html>
                            <head><title>Image Preview</title></head>
                            <body style="margin:0;display:flex;justify-content:center;align-items:center;min-height:100vh;background:#f5f5f5;">
                              <img src="${imagePreview}" style="max-width:90%;max-height:90%;object-fit:contain;border-radius:8px;box-shadow:0 4px 20px rgba(0,0,0,0.15);" />
                            </body>
                          </html>
                        `)
                      }
                    }}
                  >
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover transition-transform duration-200 group-hover:scale-105"
                    />
                    {/* Clickable overlay with zoom icon */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-200 flex items-center justify-center">
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 bg-white/90 rounded-full p-2 shadow-lg">
                        <svg className="w-6 h-6 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0zM10 7v3m0 0v3m0-3h3m-3 0H7" />
                        </svg>
                      </div>
                    </div>
                    {/* Click hint text */}
                    <div className="absolute bottom-2 left-2 bg-black/70 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      Click to enlarge
                    </div>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setSelectedFile(null)
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}

              {/* Upload Progress */}
              {uploadProgress > 0 && uploadProgress < 100 && (
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              )}

              {/* Alternative: Image URL (fallback) */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl" className="text-sm text-gray-600">
                  Or provide image URL (Google Drive, etc.)
                </Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="https://drive.google.com/..."
                  className="bg-white/80 backdrop-blur-sm rounded-lg text-sm"
                />
              </div>

              {/* Instructions */}
              <div className="text-xs text-gray-600 bg-blue-50 p-3 rounded-lg">
                <strong>📱 Mobile-friendly:</strong> Choose "Take Photo" to use your camera or "Choose from Gallery" to select an existing image.
                <br />
                <strong>💡 Tip:</strong> Good lighting and clear photos help sell your items faster!
              </div>
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
              placeholder="for shops only not mandatory"
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
              placeholder="Describe your item: size, material, comfort level, wear history, special features, etc. (e.g., Size 8, leather, worn only twice, very comfortable for dancing)"
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
              {isLoading ? 'Submitting...' : 'Add Listing'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 