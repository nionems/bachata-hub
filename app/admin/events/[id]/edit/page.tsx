'use client'

import { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { DANCE_STYLES } from '@/lib/constants'
import { normalizeDanceStyles } from '@/lib/utils'

interface Event {
  id: string
  name: string
  date: string
  startTime: string
  endTime: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string[]
  imageUrl: string
  image?: File | null
  comment: string
  googleMapLink: string
  isWeekly: boolean
  recurrence: string
  isWorkshop: boolean
  published: boolean
}

const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
]

export default function EditEventPage() {
  const router = useRouter()
  const params = useParams()
  const eventId = params?.id as string

  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const [formData, setFormData] = useState<Partial<Event>>({
    id: '',
    name: '',
    date: '',
    startTime: '',
    endTime: '',
    location: '',
    state: '',
    address: '',
    eventLink: '',
    price: '',
    ticketLink: '',
    danceStyles: [],
    imageUrl: '',
    comment: '',
    googleMapLink: '',
    isWeekly: false,
    recurrence: '',
    isWorkshop: false,
    published: false
  })

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (!response.ok) throw new Error('Failed to fetch event')
      const data = await response.json()
      
      // Handle dance styles - convert string to array if needed
      const processedData = {
        ...data,
        danceStyles: normalizeDanceStyles(data.danceStyles)
      }
      
      setFormData(processedData)
    } catch (error) {
      console.error('Error fetching event:', error)
      setError('Failed to load event data')
    } finally {
      setIsLoading(false)
    }
  }, [eventId])

  useEffect(() => {
    fetchEvent()
  }, [fetchEvent])

  useEffect(() => {
    return () => {
      if (imagePreviewUrl?.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setSelectedImage(file)
      if (imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('folder', 'events')

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      if (!data.imageUrl) throw new Error('Invalid upload response: missing imageUrl')
      return data.imageUrl
    } catch (error) {
      console.error('Upload error:', error)
      throw error instanceof Error ? error : new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)

    let finalImageUrl = formData.imageUrl || ''

    if (selectedImage) {
      try {
        finalImageUrl = await handleImageUpload(selectedImage)
      } catch (uploadError: any) {
        setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
        setIsSubmitting(false)
        return
      }
    }

    const eventUpdateData = {
      ...formData,
      imageUrl: finalImageUrl,
    }

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventUpdateData),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      router.push('/admin/dashboard?tab=events')
    } catch (submitError: any) {
      setError(`Failed to update event: ${submitError.message}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div className="container mx-auto px-4 py-8 text-center">Loading event data...</div>
  if (error && !formData.name) return <div className="container mx-auto px-4 py-8 text-center text-red-500">Error loading event: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Event: {formData.name || '...'}</h1>
      
      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Event Name <span className="text-red-500">*</span></label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Sydney Bachata Gala"/>
        </div>

        {/* Date */}
        <div>
          <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date <span className="text-red-500">*</span></label>
          <input type="date" id="date" name="date" value={formData.date} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
        </div>

        {/* Start/End Time */}
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-1">Start Time <span className="text-red-500">*</span></label>
            <input type="time" id="startTime" name="startTime" value={formData.startTime} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
          <div>
            <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-1">End Time <span className="text-red-500">*</span></label>
            <input type="time" id="endTime" name="endTime" value={formData.endTime} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"/>
          </div>
        </div>

        {/* Location */}
        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">Location <span className="text-red-500">*</span></label>
          <input type="text" id="location" name="location" value={formData.location} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., Sydney Dance Studio"/>
        </div>

        {/* State */}
        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">State <span className="text-red-500">*</span></label>
          <select id="state" name="state" value={formData.state} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white">
            <option value="">Select State</option>
            {AUSTRALIAN_STATES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
          </select>
        </div>

        {/* Address */}
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Address <span className="text-red-500">*</span></label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., 123 Dance Street, Sydney NSW 2000"/>
        </div>

        {/* Event Link */}
        <div>
          <label htmlFor="eventLink" className="block text-sm font-medium text-gray-700 mb-1">Event Link</label>
          <input type="url" id="eventLink" name="eventLink" value={formData.eventLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..."/>
        </div>

        {/* Price */}
        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">Price</label>
          <input type="text" id="price" name="price" value={formData.price} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="e.g., $25 or Free"/>
        </div>

        {/* Ticket Link */}
        <div>
          <label htmlFor="ticketLink" className="block text-sm font-medium text-gray-700 mb-1">Ticket Link</label>
          <input type="url" id="ticketLink" name="ticketLink" value={formData.ticketLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..."/>
        </div>

        {/* Dance Styles */}
                  <div>
            <label htmlFor="danceStyles" className="block text-sm font-medium text-gray-700 mb-1">Dance Styles</label>
            <div className="space-y-2">
              {DANCE_STYLES.map(style => (
                <label key={style} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    value={style}
                    checked={formData.danceStyles?.includes(style) || false}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({ 
                          ...prev, 
                          danceStyles: [...(prev.danceStyles || []), style] 
                        }))
                      } else {
                        setFormData(prev => ({ 
                          ...prev, 
                          danceStyles: (prev.danceStyles || []).filter(s => s !== style) 
                        }))
                      }
                    }}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-700">{style}</span>
                </label>
              ))}
            </div>
            {formData.danceStyles && formData.danceStyles.length > 0 && (
              <p className="text-xs text-gray-500 mt-1">
                Selected: {formData.danceStyles.join(', ')}
              </p>
            )}
          </div>

        {/* Image Upload */}
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">Event Image</label>
          <div className="space-y-2">
            {formData.imageUrl && (
              <div className="w-32 h-32 relative mb-2">
                <img
                  src={formData.imageUrl}
                  alt="Current event image"
                  className="w-full h-full object-cover rounded"
                />
              </div>
            )}
            <input
              type="file"
              id="image"
              name="image"
              accept="image/*"
              onChange={handleChange}
              className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            <div className="text-sm text-gray-500">OR</div>
            <input
              type="url"
              id="imageUrl"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="Image URL"
            />
            {imagePreviewUrl && (
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
                <img src={imagePreviewUrl} alt="Preview" className="max-w-xs max-h-48 object-contain border rounded shadow-sm" />
              </div>
            )}
          </div>
        </div>

        {/* Comment */}
        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
          <textarea id="comment" name="comment" rows={4} value={formData.comment} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="Additional information about the event..."></textarea>
        </div>

        {/* Google Map Link */}
        <div>
          <label htmlFor="googleMapLink" className="block text-sm font-medium text-gray-700 mb-1">Google Map Link</label>
          <input type="url" id="googleMapLink" name="googleMapLink" value={formData.googleMapLink} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500" placeholder="https://..."/>
        </div>

        {/* Workshop Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isWorkshop"
            name="isWorkshop"
            checked={formData.isWorkshop}
            onChange={(e) => setFormData(prev => ({ ...prev, isWorkshop: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isWorkshop" className="text-sm font-medium text-gray-700">
            This is a workshop
          </label>
        </div>

        {/* Weekly Event Checkbox */}
        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            id="isWeekly"
            name="isWeekly"
            checked={formData.isWeekly}
            onChange={(e) => setFormData(prev => ({ ...prev, isWeekly: e.target.checked }))}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="isWeekly" className="text-sm font-medium text-gray-700">
            This is a recurring event
          </label>
        </div>

        {/* Recurrence Pattern */}
        {formData.isWeekly && (
          <div>
            <label htmlFor="recurrence" className="block text-sm font-medium text-gray-700 mb-1">
              Recurrence Pattern
            </label>
            <select
              id="recurrence"
              name="recurrence"
              value={formData.recurrence}
              onChange={(e) => setFormData(prev => ({ ...prev, recurrence: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="">Select pattern</option>
              <option value="every monday">Every Monday</option>
              <option value="every tuesday">Every Tuesday</option>
              <option value="every wednesday">Every Wednesday</option>
              <option value="every thursday">Every Thursday</option>
              <option value="every friday">Every Friday</option>
              <option value="every saturday">Every Saturday</option>
              <option value="every sunday">Every Sunday</option>
              <option value="fortnightly">Fortnightly</option>
              <option value="first monday of month">First Monday Of Month</option>
              <option value="last friday of month">Last Friday Of Month</option>
              <option value="monthly">Monthly</option>
              <option value="2nd and 4th saturday">Every 2nd & 4th Saturday Of The Month</option>
              <option value="2nd and 4th sunday">Every 2nd & 4th Sunday Of The Month</option>
            </select>
          </div>
        )}

        {/* Published Status */}
        <div>
          <label htmlFor="published" className="block text-sm font-medium text-gray-700 mb-1">Published Status</label>
          <select
            id="published"
            name="published"
            value={formData.published ? 'true' : 'false'}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value === 'true' }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
          >
            <option value="true">Published (Visible to public)</option>
            <option value="false">Draft (Hidden from public)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Draft events are hidden from the public but can be edited and published later
          </p>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end gap-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}
