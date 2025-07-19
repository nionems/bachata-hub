'use client'

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton } from "@/components/ui/submit-button"
import { SuccessConfirmation, useSuccessConfirmation } from "@/components/ui/success-confirmation"
import { toast } from "react-hot-toast"
import { X, ImageIcon, CheckCircle } from "lucide-react"
import { COUNTRIES } from "@/lib/constants"

interface CompetitionSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface CompetitionFormData {
  name: string
  organizer: string
  email: string
  startDate: string
  endDate: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  resultLink: string
  danceStyles: string[]
  imageUrl: string
  image: File | null
  comment: string
  googleMapLink: string
  categories: string[]
  level: string[]
  socialLink: string
  instagramLink: string
  facebookLink: string
}

const COMPETITION_CATEGORIES = [
  'Jack&Jill',
  'Bachatanama',
  'Team Choregraphy',
  'Solo Choregraphy'
]

const COMPETITION_LEVELS = [
  'Beginner',
  'Novice',
  'Intermediate',
  'Amateur',
  'Advance',
  'Rising Stars',
  'Experienced',
  'Professional',
  'Role Rotation'
]

export function CompetitionSubmissionForm({ isOpen, onClose }: CompetitionSubmissionFormProps) {
  const [formData, setFormData] = useState<CompetitionFormData>({
    name: '',
    organizer: '',
    email: '',
    startDate: '',
    endDate: '',
    location: '',
    state: 'NSW',
    address: '',
    eventLink: '',
    price: '',
    ticketLink: '',
    resultLink: '',
    danceStyles: [],
    imageUrl: '',
    image: null,
    comment: '',
    googleMapLink: '',
    categories: [],
    level: [],
    socialLink: '',
    instagramLink: '',
    facebookLink: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const { showSuccess, close: closeSuccess, isOpen: isSuccessOpen, config: successConfig } = useSuccessConfirmation()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    
    if (type === 'select-multiple') {
      const select = e.target as HTMLSelectElement
      const selectedOptions = Array.from(select.selectedOptions).map(option => option.value)
      setFormData(prev => ({ ...prev, [name]: selectedOptions }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null
    
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
      
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setImagePreview(null)
    }
    
    setFormData(prev => ({ ...prev, image: file }))
  }

  const handleDanceStyleChange = (style: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      danceStyles: checked 
        ? [...prev.danceStyles, style]
        : prev.danceStyles.filter(s => s !== style)
    }))
  }

  const handleCategoryChange = (category: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      categories: checked 
        ? [...prev.categories, category]
        : prev.categories.filter(c => c !== category)
    }))
  }

  const handleLevelChange = (level: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      level: checked 
        ? [...prev.level, level]
        : prev.level.filter(l => l !== level)
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // If there's a file, upload it first
      let imageUrl = formData.imageUrl
      if (formData.image) {
        const formDataFile = new FormData()
        formDataFile.append('file', formData.image)
        formDataFile.append('folder', 'competitions')
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formDataFile,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const { imageUrl: uploadedImageUrl } = await uploadResponse.json()
        imageUrl = uploadedImageUrl
      }

      // Prepare competition data for database
      const competitionData = {
        name: formData.name,
        organizer: formData.organizer,
        email: formData.email,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        state: formData.state,
        country: 'Australia', // Competitions are Australia-only
        address: formData.address,
        eventLink: formData.eventLink,
        price: formData.price,
        ticketLink: formData.ticketLink,
        resultLink: formData.resultLink,
        danceStyles: formData.danceStyles,
        imageUrl: imageUrl,
        comment: formData.comment,
        googleMapLink: formData.googleMapLink,
        categories: formData.categories,
        level: formData.level,
        socialLink: formData.socialLink,
        instagramLink: formData.instagramLink ? `https://instagram.com/${formData.instagramLink.replace('@', '')}` : '',
        facebookLink: formData.facebookLink ? `https://facebook.com/${formData.facebookLink}` : '',
        status: 'pending',
        published: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Create competition in database
      const competitionResponse = await fetch('/api/competitions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(competitionData),
      })

      if (!competitionResponse.ok) {
        const errorData = await competitionResponse.json()
        throw new Error(errorData.error || 'Failed to create competition')
      }

      const createdCompetition = await competitionResponse.json()
      console.log('Competition created:', createdCompetition)

      // Show success confirmation
      showSuccess({
        title: "Competition Submitted! 🏆",
        message: "Your competition has been submitted successfully and is awaiting approval.",
        subtitle: "We'll review your competition and add it to our listings soon!",
        type: 'competition'
      })

      // Reset form
      setFormData({
        name: '',
        organizer: '',
        email: '',
        startDate: '',
        endDate: '',
        location: '',
        state: 'NSW',
        address: '',
        eventLink: '',
        price: '',
        ticketLink: '',
        resultLink: '',
        danceStyles: [],
        imageUrl: '',
        image: null,
        comment: '',
        googleMapLink: '',
        categories: [],
        level: [],
        socialLink: '',
        instagramLink: '',
        facebookLink: ''
      })
      setImagePreview(null)
      // setError(null) // This line was not in the new_code, so it's removed.
    } catch (error) {
      console.error('Error submitting competition:', error)
      toast.error('Failed to submit competition. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto rounded-xl sm:rounded-2xl">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm rounded-t-xl sm:rounded-t-2xl">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your Competition
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
            Fill out the form below to submit your competition for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-primary">Competition Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g., Australian Bachata Championship 2024"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="organizer" className="text-primary">Organizer *</Label>
              <Input
                id="organizer"
                name="organizer"
                value={formData.organizer}
                onChange={handleInputChange}
                required
                placeholder="e.g., Dance Studio Name or Organizer Name"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-primary">Email *</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                placeholder="contact@yourstudio.com"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>



            <div className="space-y-2">
              <Label htmlFor="startDate" className="text-primary">Start Date *</Label>
              <Input
                id="startDate"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="endDate" className="text-primary">End Date *</Label>
              <Input
                id="endDate"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location" className="text-primary">City *</Label>
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
              <Label htmlFor="address" className="text-primary">Address *</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleInputChange}
                required
                placeholder="e.g., 123 Dance Street, Sydney NSW 2000"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-primary">Price</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleInputChange}
                placeholder="e.g., $50 per category or Free entry"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-primary">Dance Styles</Label>
              <div className="grid grid-cols-2 gap-2 bg-white/80 backdrop-blur-sm rounded-lg p-3">
                {['Bachata', 'Salsa', 'Zouk', 'Kizomba'].map((style) => (
                  <div key={style} className="flex items-center space-x-2">
                    <Checkbox
                      id={`dance-${style}`}
                      checked={formData.danceStyles.includes(style)}
                      onCheckedChange={(checked) => handleDanceStyleChange(style, checked as boolean)}
                    />
                    <Label htmlFor={`dance-${style}`} className="text-sm font-normal">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="eventLink" className="text-primary">Event Link</Label>
              <Input
                id="eventLink"
                name="eventLink"
                type="url"
                value={formData.eventLink}
                onChange={handleInputChange}
                placeholder="https://www.eventbrite.com/your-event"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="ticketLink" className="text-primary">Ticket Link</Label>
              <Input
                id="ticketLink"
                name="ticketLink"
                type="url"
                value={formData.ticketLink}
                onChange={handleInputChange}
                placeholder="https://www.trybooking.com/your-tickets"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="resultLink" className="text-primary">Result Link</Label>
              <Input
                id="resultLink"
                name="resultLink"
                type="url"
                value={formData.resultLink}
                onChange={handleInputChange}
                placeholder="https://www.competition-results.com/your-event"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
              <p className="text-xs text-gray-500">Link to competition results (can be added after the event)</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramLink" className="text-primary">Instagram Handle</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                value={formData.instagramLink}
                onChange={handleInputChange}
                placeholder="@username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookLink" className="text-primary">Facebook Page</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                value={formData.facebookLink}
                onChange={handleInputChange}
                placeholder="facebook.com/username"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="socialLink" className="text-primary">Other Social Link</Label>
              <Input
                id="socialLink"
                name="socialLink"
                type="url"
                value={formData.socialLink}
                onChange={handleInputChange}
                placeholder="https://www.youtube.com/your-channel"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapLink" className="text-primary">Google Map Link</Label>
              <Input
                id="googleMapLink"
                name="googleMapLink"
                type="url"
                value={formData.googleMapLink}
                onChange={handleInputChange}
                placeholder="https://maps.google.com/?q=your-venue"
                className="bg-white/80 backdrop-blur-sm rounded-lg"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="categories" className="text-primary">Categories *</Label>
            <select
              id="categories"
              name="categories"
              multiple
              value={formData.categories}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {COMPETITION_CATEGORIES.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple categories</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level" className="text-primary">Level *</Label>
            <select
              id="level"
              name="level"
              multiple
              value={formData.level}
              onChange={handleInputChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              {COMPETITION_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">Hold Ctrl/Cmd to select multiple levels</p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="comment" className="text-primary">Description</Label>
            <Textarea
              id="comment"
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm rounded-lg"
              placeholder="Additional information about the competition..."
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="image" className="text-primary text-xs font-medium">Competition Image *</Label>
            
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
                  className="flex items-center justify-center w-full h-12 border-2 border-dashed border-gray-300 rounded-md cursor-pointer hover:border-primary transition-colors bg-white/90 backdrop-blur-sm"
                >
                  <ImageIcon className="h-4 w-4 text-gray-400 mr-2" />
                  <span className="text-xs text-gray-600 font-medium">Upload Photo</span>
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  📸 Maximum file size: 5MB. 💡 Tip: Take a screenshot instead of uploading high-quality photos for smaller file sizes. Supported formats: JPG, PNG, GIF, WebP
                </p>
              </div>

              {/* Image Preview */}
              {imagePreview && (
                <div className="relative group">
                  <div 
                    className="w-full h-24 bg-gray-100 rounded-md overflow-hidden"
                    style={{
                      backgroundImage: `url(${imagePreview})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center'
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, image: null }))
                      setImagePreview(null)
                    }}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              )}

              {/* Or Divider */}
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-background px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <Label htmlFor="imageUrl" className="text-sm text-muted-foreground">Use Google Drive Link</Label>
                <Input
                  id="imageUrl"
                  name="imageUrl"
                  type="url"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  placeholder="Enter Google Drive image URL"
                  className="bg-white/80 backdrop-blur-sm rounded-lg"
                />
                <p className="text-xs text-gray-500 mt-1">
                  To add an image from Google Drive:
                  <br />1. Upload your image to Google Drive
                  <br />2. Right-click the image and select "Share"
                  <br />3. Set access to "Anyone with the link"
                  <br />4. Copy the link and paste it here
                </p>
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
              isLoading={isLoading}
              variant="gradient"
              size="md"
              icon="send"
              className="w-full"
            >
              Submit Competition
            </SubmitButton>
          </div>
        </form>
      </DialogContent>

      {/* Success Confirmation */}
      <SuccessConfirmation
        isOpen={isSuccessOpen}
        onClose={closeSuccess}
        title={successConfig.title}
        message={successConfig.message}
        subtitle={successConfig.subtitle}
        type={successConfig.type}
      />
    </Dialog>
  )
} 