"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { toast } from "sonner"
import { X, Upload, Camera, Image as ImageIcon, CheckCircle, AlertCircle, Loader2 } from "lucide-react"

interface ShopSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface ShopFormData {
  name: string
  location: string
  state: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  instagramUrl: string
  facebookUrl: string
  price: string
  condition: string
  imageUrl: string
  info: string
}

export function ShopSubmissionForm({ isOpen, onClose }: ShopSubmissionFormProps) {
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    location: '',
    state: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    instagramUrl: '',
    facebookUrl: '',
    price: '',
    condition: '',
    imageUrl: '',
    info: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'loading', text: string } | null>(null)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' })
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image size is too big. Please select an image smaller than 5MB.' })
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
      setMessage({ type: 'error', text: 'Please provide at least one contact method (website, Instagram, Facebook, or phone) so buyers can contact you.' })
      return
    }
    
    setIsLoading(true)
    setUploadProgress(0)
    setMessage({ type: 'loading', text: 'Submitting your item...' })

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

      setMessage({ type: 'success', text: 'Item submitted successfully! It will be reviewed by our team.' })
      setTimeout(() => {
        onClose()
        setMessage(null)
      }, 2000)
      
      // Reset form
          setFormData({
      name: '',
      location: '',
      state: '',
      contactName: '',
      contactEmail: '',
      contactPhone: '',
      website: '',
      instagramUrl: '',
      facebookUrl: '',
      price: '',
      condition: '',
      imageUrl: '',
      info: ''
    })
      setSelectedFile(null)
      setImagePreview(null)
      setUploadProgress(0)
    } catch (error) {
      console.error('Error submitting shop:', error)
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit shop. Please try again.'
      setMessage({ type: 'error', text: errorMessage })
    } finally {
      setIsLoading(false)
      setUploadProgress(0)
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl">
            Add Listing
          </DialogTitle>
        
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-1 sm:space-y-1.5">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="name" className="text-primary text-xs font-medium">Shop/Item name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="Dance Shoes Store, Fuego Heels"
                className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="location" className="text-primary text-xs font-medium">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="Sydney, Melbourne, Brisbane"
                className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="state" className="text-primary text-xs font-medium">State *</Label>
              <StateSelect
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="contactName" className="text-primary text-xs font-medium">Contact name *</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleInputChange}
                required
                placeholder="John Smith, Maria Garcia"
                className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="contactEmail" className="text-primary text-xs font-medium">Contact email *</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleInputChange}
                required
                placeholder="for admin approval (won't be shared)"
                className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>
          </div>

          {/* Contact Methods Group */}
          <div className="space-y-1 bg-gradient-to-r from-blue-50 to-indigo-50 p-2 rounded-lg border border-blue-200/50">
            <div className="text-xs text-gray-600 font-medium">
              📞 Contact Methods: Provide at least one way for buyers to contact you
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div className="space-y-0.5">
                <Label htmlFor="contactPhone" className="text-primary text-xs font-medium">Phone</Label>
                <Input
                  id="contactPhone"
                  name="contactPhone"
                  value={formData.contactPhone}
                  onChange={handleInputChange}
                  placeholder="0412 345 678"
                  className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="website" className="text-primary text-xs font-medium">Website</Label>
                <Input
                  id="website"
                  name="website"
                  type="url"
                  value={formData.website}
                  onChange={(e) => {
                    let value = e.target.value
                    if (value && !value.startsWith('http://') && !value.startsWith('https://')) {
                      value = 'https://' + value
                    }
                    setFormData(prev => ({ ...prev, website: value }))
                  }}
                  placeholder="mydanceshop.com"
                  className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="instagramUrl" className="text-primary text-xs font-medium">Instagram</Label>
                <Input
                  id="instagramUrl"
                  name="instagramUrl"
                  type="text"
                  value={formData.instagramUrl}
                  onChange={(e) => {
                    let value = e.target.value
                    if (value) {
                      // Remove any existing @ symbol and convert to username format
                      const username = value.replace('@', '').replace('https://', '').replace('http://', '').replace('instagram.com/', '').replace('www.instagram.com/', '')
                      value = `@${username}`
                    }
                    setFormData(prev => ({ ...prev, instagramUrl: value }))
                  }}
                  placeholder="@yourusername"
                  className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>

              <div className="space-y-0.5">
                <Label htmlFor="facebookUrl" className="text-primary text-xs font-medium">Facebook</Label>
                <Input
                  id="facebookUrl"
                  name="facebookUrl"
                  type="url"
                  value={formData.facebookUrl}
                  onChange={(e) => {
                    let value = e.target.value
                    if (value) {
                      if (value.includes('facebook.com/')) {
                        if (!value.startsWith('http://') && !value.startsWith('https://')) {
                          value = 'https://' + value
                        }
                      } else {
                        const username = value.replace('@', '').replace('https://', '').replace('http://', '').replace('facebook.com/', '')
                        value = `https://facebook.com/${username}`
                      }
                    }
                    setFormData(prev => ({ ...prev, facebookUrl: value }))
                  }}
                  placeholder="facebook.com/yourpage"
                  className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
                />
              </div>
            </div>
          </div>

          {/* Item Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <div className="space-y-0.5">
              <Label htmlFor="price" className="text-primary text-xs font-medium">Price *</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                required
                placeholder="$10-50, Free, etc."
                className="bg-white/90 backdrop-blur-sm rounded-md h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              />
            </div>

            <div className="space-y-0.5">
              <Label htmlFor="condition" className="text-primary text-xs font-medium">Condition *</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={(e) => setFormData(prev => ({ ...prev, condition: e.target.value }))}
                required
                className="w-full p-2 border rounded-md bg-white/90 backdrop-blur-sm h-8 text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Second Hand">Second Hand</option>
              </select>
            </div>
          </div>

          {/* Item Description */}
          <div className="space-y-0.5">
            <Label htmlFor="info" className="text-primary text-xs font-medium">Item Description *</Label>
            <Textarea
              id="info"
              name="info"
              value={formData.info}
              onChange={handleInputChange}
              required
              className="min-h-[80px] bg-white/90 backdrop-blur-sm rounded-md text-sm border-gray-200 focus:border-primary focus:ring-1 focus:ring-primary"
              placeholder="Size 8, leather, worn twice, very comfortable for dancing..."
            />
          </div>

          {/* Item Image */}
          <div className="space-y-1">
            <Label htmlFor="image" className="text-primary text-xs font-medium">Item Image *</Label>
            
            {/* File Upload Section */}
            <div className="space-y-1.5">
              {/* Single Upload Box */}
              <div className="relative">
                <input
                  id="image-input"
                  name="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-input"
                  className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors bg-white/90 backdrop-blur-sm"
                >
                  <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 font-medium">Upload Photo</span>
                </label>
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
              <div className="space-y-1">
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
              <div className="text-xs text-gray-600 bg-blue-50 p-2 rounded-lg">
                <strong>📱 Mobile-friendly:</strong> Tap the upload box to take a photo or choose from your gallery.
                <br />
                <strong>💡 Tip:</strong> Good lighting and clear photos help sell your items faster!
              </div>
            </div>
          </div>
          <div className="pt-1">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white h-10"
            >
              {isLoading ? 'Submitting...' : 'Submit Item'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>

      {/* Centered Message Modal */}
      {message && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-lg p-6 max-w-sm mx-4 shadow-xl">
            <div className="flex items-center justify-center mb-4">
              {message.type === 'loading' && (
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
              )}
              {message.type === 'success' && (
                <CheckCircle className="h-8 w-8 text-green-500" />
              )}
              {message.type === 'error' && (
                <AlertCircle className="h-8 w-8 text-red-500" />
              )}
            </div>
            <p className="text-center text-gray-700 mb-4">{message.text}</p>
            <div className="flex justify-center">
              <Button
                onClick={() => setMessage(null)}
                className="bg-primary hover:bg-primary/90 text-white"
              >
                {message.type === 'loading' ? 'Cancel' : 'OK'}
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  )
} 