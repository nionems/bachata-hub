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
import { X, Upload, ImageIcon } from "lucide-react"
import { SubmitButton, useSubmitButton } from "@/components/ui/submit-button"
import { SuccessConfirmation, useSuccessConfirmation } from "@/components/ui/success-confirmation"

interface MediaSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface MediaFormData {
  name: string
  location: string
  state: string
  email: string
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
    email: '',
    comment: '',
    instagramLink: '',
    facebookLink: '',
    emailLink: '',
    mediaLink: '',
    mediaLink2: '',
    imageUrl: ''
  })

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isUploading, setIsUploading] = useState(false)

  // Use the modern submit button hook
  const { isLoading, handleSubmit: handleSubmitButton } = useSubmitButton()

  // Use the success confirmation hook
  const { showSuccess, hideSuccess, isSuccessVisible } = useSuccessConfirmation()

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
          return
        } finally {
          setIsUploading(false)
        }
      }

      // Create media data with uploaded image URL and constructed social links
      const mediaData = {
        ...formData,
        imageUrl: imageUrl || formData.imageUrl,
        // Construct full URLs from usernames
        instagramLink: formData.instagramLink ? `https://instagram.com/${formData.instagramLink.replace('@', '')}` : '',
        facebookLink: formData.facebookLink ? `https://facebook.com/${formData.facebookLink}` : ''
      }

      // Create media in database
      const mediaResponse = await fetch('/api/media', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(mediaData),
      })

      if (!mediaResponse.ok) {
        const errorData = await mediaResponse.json()
        throw new Error(errorData.error || 'Failed to create media')
      }

      const createdMedia = await mediaResponse.json()
      console.log('Media created:', createdMedia)

      // Send email notification
      const emailResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'media_submission',
          data: mediaData
        }),
      })

      if (!emailResponse.ok) {
        console.warn('Failed to send email notification, but media was created')
      }

      // Show success confirmation and reset form
      showSuccess('media')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        email: '',
        comment: '',
        instagramLink: '',
        facebookLink: '',
        emailLink: '',
        mediaLink: '',
        mediaLink2: '',
        imageUrl: ''
      })
      setImageFile(null)
      setImagePreview(null)
      setUploadProgress(0)
    } catch (error) {
      console.error('Error submitting media:', error)
      toast.error('Failed to submit media. Please try again.')
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
                placeholder="Your name or media creator name"
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
                placeholder="City (e.g., Sydney, Melbourne)"
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
              <Label htmlFor="email" className="text-primary">Email Address *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="your@email.com"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramLink" className="text-primary">Instagram Username</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                type="text"
                value={formData.instagramLink}
                onChange={handleInputChange}
                placeholder="yourusername (without @)"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                📱 Just enter your username (e.g., "dance_studio_sydney") - we'll add the full link automatically
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookLink" className="text-primary">Facebook Username</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                type="text"
                value={formData.facebookLink}
                onChange={handleInputChange}
                placeholder="yourusername or page name"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                📘 Just enter your username or page name (e.g., "dance.studio.sydney") - we'll add the full link automatically
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="emailLink" className="text-primary">Email</Label>
              <Input
                id="emailLink"
                name="emailLink"
                type="email"
                value={formData.emailLink}
                onChange={handleInputChange}
                placeholder="contact@yourwebsite.com"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                📧 Add a contact email for business inquiries or collaborations
              </p>
            </div>

            <div className="space-y-2">
                              <Label htmlFor="mediaLink" className="text-primary">Media Link</Label>
              <Input
                id="mediaLink"
                name="mediaLink"
                type="url"
                value={formData.mediaLink}
                onChange={handleInputChange}
                required
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                🎥 Add the direct link to your video (YouTube, Vimeo, TikTok, etc.)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="mediaLink2" className="text-primary">Media Link 2</Label>
              <Input
                id="mediaLink2"
                name="mediaLink2"
                type="url"
                value={formData.mediaLink2}
                onChange={handleInputChange}
                placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
              <p className="text-xs text-gray-500 mt-1">
                🎥 Optional: Add another video link if you have multiple pieces of content
              </p>
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
              placeholder="Describe your media content, dance style, performers, or any other relevant details..."
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 Tip: Include dance styles, performers, event details, or any other information that helps describe your content.
            </p>
          </div>

          {/* Media Image */}
          <div className="space-y-1">
            <Label htmlFor="image" className="text-primary text-xs font-medium">Media Image *</Label>
            
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
                <strong>💡 Tip:</strong> Good lighting and clear photos help showcase your media content better!
              </div>
            </div>
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
            <SubmitButton
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              {isLoading ? 'Submitting...' : 'Submit Media'}
            </SubmitButton>
          </div>
        </form>
      </DialogContent>

              {/* Success Confirmation Popup */}
        <SuccessConfirmation
          isOpen={isSuccessVisible}
          onClose={hideSuccess}
          type="media"
        />
    </Dialog>
  )
} 
 
 
 