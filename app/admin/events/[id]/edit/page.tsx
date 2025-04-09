'use client'

import { useState, useEffect, ChangeEvent, FormEvent } from 'react'
import { useRouter, useParams } from 'next/navigation'

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
  danceStyles: string
  imageUrl: string
  image?: File | null
  comment: string
  googleMapLink: string
}

// List of Australian states and territories
const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
];

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
    danceStyles: '',
    imageUrl: '',
    comment: '',
    googleMapLink: ''
  })

  useEffect(() => {
    fetchEvent()
  }, [eventId])

  const fetchEvent = async () => {
    if (!eventId) {
      setError("Event ID is missing.")
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)
    console.log(`Edit Event: Attempting to fetch event data for ID: ${eventId}`)
    const apiUrl = `/api/events/${eventId}`

    try {
      console.log(`Edit Event: Fetching from URL: ${apiUrl}`)
      const response = await fetch(apiUrl)
      console.log(`Edit Event: Received response status ${response.status}`)

      if (!response.ok) {
        let errorDetails = `HTTP error! status: ${response.status}`
        try {
          const errorData = await response.json()
          errorDetails = errorData?.error || errorData?.details || errorDetails
        } catch (e) { /* Ignore if error response isn't JSON */ }
        console.error("Edit Event: Failed to fetch event data:", errorDetails)
        throw new Error(`Failed to fetch event: ${errorDetails}`)
      }

      const eventData: Event = await response.json()
      console.log("Edit Event: Successfully fetched event data:", eventData)

      setFormData({
        ...eventData,
        image: null,
        imageUrl: eventData.imageUrl || '',
      })
      if (eventData.imageUrl) {
        setImagePreviewUrl(eventData.imageUrl)
      }
    } catch (err: any) {
      console.error("Edit Event: >>> Error caught in fetchEvent <<<")
      console.error("Edit Event: Error details:", err)
      setError(err.message || "An unknown error occurred while fetching event data.")
    } finally {
      setIsLoading(false)
      console.log("Edit Event: fetchEvent execution finished.")
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setFormData((prev) => ({ ...prev, image: file, imageUrl: undefined }))
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    return () => { if (imagePreviewUrl && imagePreviewUrl.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl) }
  }, [imagePreviewUrl])

  const handleImageUpload = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    const response = await fetch('/api/upload', { method: 'POST', body: formData })
    if (!response.ok) throw new Error('Upload failed')
    const data = await response.json()
    if (!data?.imageUrl) throw new Error('Invalid upload response')
    return data.imageUrl
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setError(null)
    console.log("Edit Event: Starting handleSubmit for update")

    let finalImageUrl = formData.imageUrl || ''

    if (formData.image) {
      console.log("Edit Event: New image selected, attempting upload...")
      try {
        finalImageUrl = await handleImageUpload(formData.image)
        console.log("Edit Event: New image upload successful, URL:", finalImageUrl)
      } catch (uploadError: any) {
        console.error("Edit Event: Image upload failed during submit:", uploadError)
        setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
        setIsSubmitting(false)
        return
      }
    } else {
      console.log("Edit Event: No new image selected.")
    }

    const eventUpdateData = {
      ...formData,
      imageUrl: finalImageUrl,
      image: undefined,
    }
    delete eventUpdateData.image

    console.log(`Edit Event: Submitting data to PUT /api/events/${eventId}:`, eventUpdateData)

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventUpdateData),
      })

      console.log(`Edit Event: Received response status ${response.status} from PUT /api/events/${eventId}`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        console.error("Edit Event: Error submitting update data:", errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      console.log("Edit Event: Event updated successfully!")
      router.push('/admin/dashboard?tab=events')
    } catch (submitError: any) {
      console.error("Edit Event: Error during event update:", submitError)
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
      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-1">Event Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Date*</label>
            <input
              type="date"
              value={formData.date}
              onChange={handleChange}
              name="date"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Start Time*</label>
            <input
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              name="startTime"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Time*</label>
            <input
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              name="endTime"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Location*</label>
            <input
              type="text"
              value={formData.location}
              onChange={handleChange}
              name="location"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <select
              value={formData.state}
              onChange={handleChange}
              name="state"
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a state</option>
              {AUSTRALIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address*</label>
          <input
            type="text"
            value={formData.address}
            onChange={handleChange}
            name="address"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Event Link</label>
            <input
              type="url"
              value={formData.eventLink}
              onChange={handleChange}
              name="eventLink"
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price*</label>
            <input
              type="number"
              value={formData.price}
              onChange={handleChange}
              name="price"
              className="w-full p-2 border rounded"
              min="0"
              step="0.01"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Ticket Link</label>
            <input
              type="url"
              value={formData.ticketLink}
              onChange={handleChange}
              name="ticketLink"
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Dance Styles*</label>
          <input
            type="text"
            value={formData.danceStyles}
            onChange={handleChange}
            name="danceStyles"
            className="w-full p-2 border rounded"
            placeholder="e.g., Bachata, Salsa, Kizomba"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
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
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="w-full p-2 border rounded"
            />
            <div className="text-sm text-gray-500">OR</div>
            <input
              type="url"
              value={formData.imageUrl}
              onChange={handleChange}
              name="imageUrl"
              className="w-full p-2 border rounded"
              placeholder="Image URL"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={formData.comment}
            onChange={handleChange}
            name="comment"
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Google Map Link</label>
          <input
            type="url"
            value={formData.googleMapLink}
            onChange={handleChange}
            name="googleMapLink"
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isSubmitting ? 'Updating Event...' : 'Update Event'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border rounded hover:bg-gray-100"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 