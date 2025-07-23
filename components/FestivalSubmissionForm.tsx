"use client"

import { useState, ChangeEvent, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { StateSelect } from "@/components/ui/StateSelect"
import { Checkbox } from "@/components/ui/checkbox"
import { SubmitButton, useSubmitButton } from "@/components/ui/submit-button"
import { SuccessConfirmation, useSuccessConfirmation } from "@/components/ui/success-confirmation"
import { X, ImageIcon, CheckCircle } from "lucide-react"
import { toast } from "react-hot-toast"
import { DANCE_STYLES, COUNTRIES } from "@/lib/constants"
import { DateRangePicker } from "@/components/ui/date-range-picker"
import { DateRange } from "react-day-picker"
import { format } from "date-fns"

// Filter dance styles to show only the requested ones
const FESTIVAL_DANCE_STYLES = ['Bachata', 'Salsa', 'Kizomba', 'Zouk', 'Mambo', 'Afrobeat'] as const

interface FestivalSubmissionFormProps {
  isOpen: boolean
  onClose: () => void
}

interface FestivalFormData {
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  country: string
  eventLink: string
  ticketLink: string
  danceStyles: string[]
  imageUrl: string
  image: File | null
  description: string
  ambassadorCode: string
  instagramLink: string
  facebookLink: string
}

export function FestivalSubmissionForm({ isOpen, onClose }: FestivalSubmissionFormProps) {
  const [formData, setFormData] = useState<FestivalFormData>({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    state: 'NSW', // Default state for Australia
    country: 'Australia',
    eventLink: '',
    ticketLink: '',
    danceStyles: [],
    imageUrl: '',
    image: null,
    description: '',
    ambassadorCode: '',
    instagramLink: '',
    facebookLink: ''
  })

  const [dateRange, setDateRange] = useState<DateRange | undefined>()

  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [showSuccessPopup, setShowSuccessPopup] = useState(false)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  // Use the modern submit button hook
  const { isLoading, handleSubmit: handleSubmitButton } = useSubmitButton()

  // Use the success confirmation hook
  const { showSuccess, hideSuccess, isSuccessVisible } = useSuccessConfirmation()

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    
    // If country is changed to non-Australia, set state to N/A
    if (name === 'country') {
      setFormData(prev => ({ 
        ...prev, 
        [name]: value,
        state: value !== 'Australia' ? 'N/A' : 'NSW' // Default to NSW for Australia
      }))
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleDateRangeChange = (range: DateRange | undefined) => {
    setDateRange(range)
    if (range?.from) {
      setFormData(prev => ({ 
        ...prev, 
        startDate: format(range.from!, 'yyyy-MM-dd')
      }))
    }
    if (range?.to) {
      setFormData(prev => ({ 
        ...prev, 
        endDate: format(range.to!, 'yyyy-MM-dd')
      }))
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()

    try {
      // If there's a file, upload it first
      let imageUrl = formData.imageUrl
      if (formData.image) {
        const formDataFile = new FormData()
        formDataFile.append('file', formData.image)
        formDataFile.append('folder', 'festivals')
        
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

      // Ensure state is set correctly based on country
      const finalState = formData.country !== 'Australia' ? 'N/A' : formData.state

      // Prepare festival data for database
      const festivalData = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
        location: formData.location,
        state: finalState,
        country: formData.country,
        eventLink: formData.eventLink,
        ticketLink: formData.ticketLink,
        danceStyles: formData.danceStyles,
        imageUrl: imageUrl,
        description: formData.description,
        ambassadorCode: formData.ambassadorCode,
        instagramLink: formData.instagramLink ? `https://instagram.com/${formData.instagramLink.replace('@', '')}` : '',
        facebookLink: formData.facebookLink ? `https://facebook.com/${formData.facebookLink}` : ''
      }

      // Create festival in database
      const festivalResponse = await fetch('/api/festivals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(festivalData),
      })

      if (!festivalResponse.ok) {
        const errorData = await festivalResponse.json()
        throw new Error(errorData.error || 'Failed to create festival')
      }

      const createdFestival = await festivalResponse.json()
      console.log('Festival created:', createdFestival)

      // Send email notification
      const emailResponse = await fetch('/api/submit-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          type: 'festival_submission',
          data: festivalData
        }),
      })

      if (!emailResponse.ok) {
        console.warn('Failed to send email notification, but festival was created')
      }

      // Show success confirmation and reset form
      showSuccess('festival')
      onClose()
      setFormData({
        name: '',
        startDate: '',
        endDate: '',
        location: '',
        state: 'NSW',
        country: 'Australia',
        eventLink: '',
        ticketLink: '',
        danceStyles: [],
        imageUrl: '',
        image: null,
        description: '',
        ambassadorCode: '',
        instagramLink: '',
        facebookLink: ''
      })
      setImagePreview(null)
      setError(null)
      setSuccess(false)
      setShowSuccessPopup(false)
    } catch (error) {
      console.error('Error submitting festival:', error)
      setError(error instanceof Error ? error.message : 'Failed to submit festival. Please try again.')
    }
  }

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[600px] bg-gradient-to-br from-primary/10 to-secondary/10 max-h-[90vh] overflow-y-auto">
        <DialogHeader className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm">
          <DialogTitle className="text-primary text-lg sm:text-xl flex justify-between items-center">
            Submit Your Festival
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
            Fill out the form below to submit your festival for review.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label htmlFor="name" className="text-primary text-sm">Festival Name *</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="bg-white/80 backdrop-blur-sm h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="dateRange" className="text-primary text-sm">Date Range *</Label>
              <DateRangePicker
                dateRange={dateRange}
                onDateRangeChange={handleDateRangeChange}
                className="bg-white/80 backdrop-blur-sm h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="location" className="text-primary text-sm">Location *</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                required
                placeholder="e.g., Sydney, Melbourne, Brisbane"
                className="bg-white/80 backdrop-blur-sm h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="country" className="text-primary text-sm">Country</Label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className="w-full px-3 py-1.5 border border-gray-300 rounded-md bg-white/80 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent h-9"
              >
                {COUNTRIES.map((country) => (
                  <option key={country} value={country}>
                    {country}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <Label htmlFor="state" className="text-primary text-sm">
                {formData.country === 'Australia' ? 'State *' : 'State/Province'}
              </Label>
              {formData.country === 'Australia' ? (
                <StateSelect
                  value={formData.state}
                  onChange={(value) => setFormData(prev => ({ ...prev, state: value }))}
                  className="bg-white/80 backdrop-blur-sm h-9"
                />
              ) : (
                <Input
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  placeholder="e.g., Catalonia, California, Ontario"
                  className="bg-white/80 backdrop-blur-sm h-9"
                />
              )}
            </div>

            <div className="space-y-1">
              <Label htmlFor="eventLink" className="text-primary text-sm">Event Link</Label>
              <Input
                id="eventLink"
                name="eventLink"
                type="url"
                value={formData.eventLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="ticketLink" className="text-primary text-sm">Ticket Link</Label>
              <Input
                id="ticketLink"
                name="ticketLink"
                type="url"
                value={formData.ticketLink}
                onChange={handleInputChange}
                placeholder="https://"
                className="bg-white/80 backdrop-blur-sm h-9"
              />
            </div>

            <div className="space-y-1">
              <Label htmlFor="instagramLink" className="text-primary text-sm">Instagram Username</Label>
              <Input
                id="instagramLink"
                name="instagramLink"
                type="text"
                value={formData.instagramLink}
                onChange={handleInputChange}
                placeholder="username (without @)"
                className="bg-white/80 backdrop-blur-sm h-9"
              />
              <p className="text-xs text-gray-500 mt-1">
                📱 Just enter your username (e.g., "dance_festival_sydney") - we'll add the full link automatically
              </p>
            </div>

            <div className="space-y-1">
              <Label htmlFor="facebookLink" className="text-primary text-sm">Facebook Username</Label>
              <Input
                id="facebookLink"
                name="facebookLink"
                type="text"
                value={formData.facebookLink}
                onChange={handleInputChange}
                placeholder="username or page name"
                className="bg-white/80 backdrop-blur-sm h-9"
              />
              <p className="text-xs text-gray-500 mt-1">
                📘 Just enter your username or page name (e.g., "dance.festival.sydney") - we'll add the full link automatically
              </p>
            </div>

            <div className="space-y-1">
              <Label className="text-primary text-sm">Dance Styles *</Label>
              <div className="grid grid-cols-2 gap-1.5 bg-white/80 backdrop-blur-sm p-2 rounded-md border">
                {FESTIVAL_DANCE_STYLES.map((style) => (
                  <div key={style} className="flex items-center space-x-1.5">
                    <Checkbox
                      id={style}
                      checked={formData.danceStyles.includes(style)}
                      onCheckedChange={(checked) => handleDanceStyleChange(style, checked as boolean)}
                    />
                    <Label htmlFor={style} className="text-xs font-normal">
                      {style}
                    </Label>
                  </div>
                ))}
              </div>
              {formData.danceStyles.length === 0 && (
                <p className="text-xs text-red-500">Please select at least one dance style</p>
              )}
            </div>

          </div>

          <div className="space-y-1">
            <Label htmlFor="description" className="text-primary text-sm">Festival Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              className="min-h-[100px] bg-white/80 backdrop-blur-sm"
              placeholder="Describe your festival, what makes it special, what dancers can expect, workshops, performances, etc..."
            />
            <p className="text-xs text-gray-500 mt-1">
              💡 This description will be displayed on the festival card to help dancers understand what your festival offers.
            </p>
          </div>

          <div className="space-y-1">
            <Label htmlFor="ambassadorCode" className="text-primary text-sm">Ambassador/Discount Code</Label>
            <Input
              id="ambassadorCode"
              name="ambassadorCode"
              value={formData.ambassadorCode}
              onChange={handleInputChange}
              placeholder="e.g., BACHATAAU/Ambasador, BACHATAHUB20, DANCE10, etc."
              className="bg-white/80 backdrop-blur-sm h-9"
            />
            <p className="text-xs text-gray-500 mt-1">
              🎫 Optional: Add a discount code for our community members to use when purchasing tickets.
            </p>
          </div>

          {error && (
            <div className="text-red-500 text-sm">{error}</div>
          )}

          {success && (
            <div className="text-green-500 text-sm">Festival submitted successfully!</div>
          )}

          <div className="flex justify-end gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-primary text-primary hover:bg-primary/10"
            >
              Cancel
            </Button>
            <SubmitButton
                             isLoading={isLoading}
              variant="gradient"
              size="md"
              icon="send"
            >
              Submit Festival
            </SubmitButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>

            {/* Success Confirmation Popup */}
        <SuccessConfirmation
          isOpen={isSuccessVisible}
          onClose={hideSuccess}
          type="festival"
        />
  </>
  )
} 