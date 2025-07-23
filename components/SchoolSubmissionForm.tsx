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
import { DANCE_STYLES } from "@/lib/constants"
import { SubmitButton, useSubmitButton } from "@/components/ui/submit-button"
import { SuccessConfirmation, useSuccessConfirmation } from "@/components/ui/success-confirmation"

interface SchoolSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface SchoolFormData {
  name: string
  location: string
  state: string
  website: string
  instagramUrl: string
  facebookUrl: string
  email: string
  danceStyles: string[]
  description: string
  imageUrl: string
}

export function SchoolSubmissionForm({ isOpen, onClose }: SchoolSubmissionFormProps) {
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    location: '',
    state: '',
    website: '',
    instagramUrl: '',
    facebookUrl: '',
    email: '',
    danceStyles: [],
    description: '',
    imageUrl: ''
  })

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'loading', text: string } | null>(null)

  // Use the modern submit button hook
  const { isLoading, handleSubmit: handleSubmitButton } = useSubmitButton()

  // Use the success confirmation hook
  const { showSuccess, hideSuccess, isSuccessVisible } = useSuccessConfirmation()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleDanceStyleChange = (danceStyle: string) => {
    setFormData(prev => ({
      ...prev,
      danceStyles: prev.danceStyles.includes(danceStyle)
        ? prev.danceStyles.filter(style => style !== danceStyle)
        : [...prev.danceStyles, danceStyle]
    }))
  }

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setMessage({ type: 'error', text: 'Please select an image file' })
        e.target.value = '' // Clear the input
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: 'Image file is too large. Try taking a screenshot instead of uploading a high-quality photo. Maximum size: 5MB.' })
        e.target.value = '' // Clear the input
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
    
    // Validate dance styles
    if (formData.danceStyles.length === 0) {
      setMessage({ type: 'error', text: 'Please select at least one dance style' })
      return
    }
    
    setUploadProgress(0)
    setMessage({ type: 'loading', text: 'Submitting your school...' })

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
        throw new Error('Please provide an image for your school')
      }

      // Create school in database
      const schoolResponse = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          location: formData.location,
          state: formData.state,
          website: formData.website,
          instagramUrl: formData.instagramUrl,
          facebookUrl: formData.facebookUrl,
          email: formData.email,
          danceStyles: formData.danceStyles,
          comment: formData.description,
          imageUrl: finalImageUrl,
          status: 'pending'
        }),
      })

      if (!schoolResponse.ok) {
        const errorData = await schoolResponse.json()
        throw new Error(errorData.error || 'Failed to create school')
      }

      // Send email notification
      const emailResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'school_submission',
          data: {
            name: formData.name,
            location: formData.location,
            state: formData.state,
            website: formData.website,
            instagramUrl: formData.instagramUrl,
            facebookUrl: formData.facebookUrl,
            email: formData.email,
            danceStyles: formData.danceStyles.join(', '),
            description: formData.description,
            imageUrl: finalImageUrl
          }
        }),
      })

      if (!emailResponse.ok) {
        console.warn('Failed to send email notification, but school was created')
      }

      // Show success confirmation and reset form
      showSuccess('school')
      onClose()
      setFormData({
        name: '',
        location: '',
        state: '',
        website: '',
        instagramUrl: '',
        facebookUrl: '',
        email: '',
        danceStyles: [],
        description: '',
        imageUrl: ''
      })
      setSelectedFile(null)
      setImagePreview(null)
      setUploadProgress(0)
      setMessage(null)
    } catch (error) {
      console.error('Error submitting school:', error)
      setMessage({ type: 'error', text: error instanceof Error ? error.message : 'Failed to submit school. Please try again.' })
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
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
                placeholder="e.g., Latin Dance Academy, Salsa Studio, etc."
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
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
                placeholder="e.g., Sydney, Melbourne, Brisbane"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="state" className="text-primary text-sm sm:text-base">State *</Label>
              <StateSelect
                value={formData.state}
                onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
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
                onChange={handleInputChange}
                placeholder="https://www.yourschool.com.au"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="instagramUrl" className="text-primary text-sm sm:text-base">Instagram URL</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                type="url"
                value={formData.instagramUrl}
                onChange={handleInputChange}
                placeholder="https://instagram.com/yourschool"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label htmlFor="facebookUrl" className="text-primary text-sm sm:text-base">Facebook URL</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                type="url"
                value={formData.facebookUrl}
                onChange={handleInputChange}
                placeholder="https://facebook.com/yourschool"
                className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
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
                placeholder="contact@yourschool.com.au"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-1 sm:space-y-2">
              <Label className="text-primary text-sm sm:text-base">Dance Styles *</Label>
              <div className="bg-white/80 backdrop-blur-sm rounded-lg p-3 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {DANCE_STYLES.map((style) => (
                    <label key={style} className="flex items-center space-x-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.danceStyles.includes(style)}
                        onChange={() => handleDanceStyleChange(style)}
                        className="rounded border-gray-300 text-primary focus:ring-primary"
                      />
                      <span className="text-sm text-gray-700">{style}</span>
                    </label>
                  ))}
                </div>
              </div>
              {formData.danceStyles.length === 0 && (
                <p className="text-xs text-red-500">Please select at least one dance style</p>
              )}
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
              placeholder="Tell us about your dance school! Include information about your teaching style, experience, class offerings, pricing, and what makes your school unique. For example: 'We offer beginner to advanced classes in Bachata, Salsa, and Kizomba. Our experienced instructors provide personalized attention in small group settings. Classes run Monday to Friday with weekend workshops available.'"
              className="bg-white/80 backdrop-blur-sm text-sm sm:text-base rounded-lg"
              rows={4}
            />
          </div>

          {/* School Image */}
          <div className="space-y-1">
            <Label htmlFor="image" className="text-primary text-xs font-medium">School Image *</Label>
            
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
                <strong>💡 Tip:</strong> Good lighting and clear photos help showcase your school better!
              </div>
            </div>
          </div>



          <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="w-full sm:w-auto border-primary text-primary hover:bg-primary/10 text-sm sm:text-base rounded-lg"
            >
              Cancel
            </Button>
            <SubmitButton
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white rounded-lg"
            >
              {isLoading ? 'Submitting...' : 'Submit School'}
            </SubmitButton>
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

            {/* Success Confirmation Popup */}
        <SuccessConfirmation
          isOpen={isSuccessVisible}
          onClose={hideSuccess}
          type="school"
        />
  </>
  )
} 