"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { toast } from "sonner"
import { X, Upload, X as XIcon, ImageIcon } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

// Limited dance styles for DJs
const DJ_DANCE_STYLES = ['Salsa', 'Bachata', 'Kizomba', 'Zouk'] as const

interface DJSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface DJFormData {
  name: string
  location: string
  state: string
  email: string
  danceStyles: string[]
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
    email: '',
    danceStyles: [],
    imageUrl: '',
    comment: '',
    instagramLink: '',
    facebookLink: '',
    emailLink: '',
    musicLink: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    
    if (file) {
      // Check file size (5MB limit)
      const maxSize = 5 * 1024 * 1024 // 5MB in bytes
      if (file.size > maxSize) {
        toast.error('Image file is too large. Try taking a screenshot instead of uploading a high-quality photo. Maximum size: 5MB.')
        e.target.value = '' // Clear the input
        return
      }
      
      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file.')
        e.target.value = '' // Clear the input
        return
      }
      
      setImageFile(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleDanceStyleChange = (style: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      danceStyles: checked 
        ? [...prev.danceStyles, style]
        : prev.danceStyles.filter(s => s !== style)
    }))
  }

  const uploadImage = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await fetch('/api/upload', {
      method: 'POST',
      body: formData,
    })
    
    if (!response.ok) {
      throw new Error('Failed to upload image')
    }
    
    const data = await response.json()
    return data.imageUrl
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = formData.imageUrl

      // Upload image if file is selected
      if (imageFile) {
        setIsUploading(true)
        setUploadProgress(0)
        
        try {
          imageUrl = await uploadImage(imageFile)
          setUploadProgress(100)
        } catch (uploadError) {
          console.error('Image upload failed:', uploadError)
          toast.error('Image upload failed. Please try again or use a URL instead.')
          setIsUploading(false)
          setIsLoading(false)
          return
        } finally {
          setIsUploading(false)
        }
      }

      // Validate dance styles
      if (formData.danceStyles.length === 0) {
        toast.error('Please select at least one dance style')
        setIsLoading(false)
        return
      }

      // Create DJ data with uploaded image URL
      const djData = {
        ...formData,
        imageUrl: imageUrl || formData.imageUrl
      }

      // Create DJ in database
      const djResponse = await fetch('/api/djs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(djData),
      })

      if (!djResponse.ok) {
        const errorData = await djResponse.json()
        throw new Error(errorData.error || 'Failed to create DJ')
      }

      const createdDJ = await djResponse.json()
      console.log('DJ created:', createdDJ)

      // Send email notification
      const emailResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'dj_submission',
          data: djData
        }),
      })

      if (!emailResponse.ok) {
        console.warn('Failed to send email notification, but DJ was created')
      }

      toast.success('DJ submitted successfully! It will be reviewed and approved soon.')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        email: '',
        danceStyles: [],
        imageUrl: '',
        comment: '',
        instagramLink: '',
        facebookLink: '',
        emailLink: '',
        musicLink: ''
      })
      setImageFile(null)
      setImagePreview(null)
      setUploadProgress(0)
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
              <Label className="text-primary">Dance Styles *</Label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 max-h-32 overflow-y-auto bg-white/80 backdrop-blur-sm rounded-lg p-3">
                {DJ_DANCE_STYLES.map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={style}
                      checked={formData.danceStyles.includes(style)}
                      onCheckedChange={(checked) => handleDanceStyleChange(style, checked as boolean)}
                    />
                    <Label htmlFor={style} className="text-sm font-normal cursor-pointer">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.danceStyles.length === 0 && (
                <p className="text-xs text-red-500">Please select at least one dance style</p>
              )}
            </div>

          {/* DJ Image */}
          <div className="space-y-1">
            <Label htmlFor="image" className="text-primary text-xs font-medium">Profile Image *</Label>
            
            {/* File Upload Section */}
            <div className="space-y-1.5">
              {/* Single Upload Box */}
              <div className="relative">
                <input
                  id="image-input"
                  name="image-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <label
                  htmlFor="image-input"
                  className="flex items-center justify-center w-full h-16 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors bg-white/90 backdrop-blur-sm"
                >
                  <ImageIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-sm text-gray-600 font-medium">Upload Photo</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  📸 Maximum file size: 5MB. 💡 Tip: Take a screenshot instead of uploading high-quality photos for smaller file sizes. Supported formats: JPG, PNG, GIF, WebP
                </p>
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
                      setImageFile(null)
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
                <strong>💡 Tip:</strong> Good lighting and clear photos help showcase your profile better!
              </div>
            </div>
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