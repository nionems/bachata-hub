'use client'

import { useState, useEffect, ChangeEvent, FormEvent, useCallback } from 'react'
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
    danceStyles: '',
    imageUrl: '',
    comment: '',
    googleMapLink: ''
  })

  const fetchEvent = useCallback(async () => {
    try {
      const response = await fetch(`/api/events/${eventId}`)
      if (!response.ok) throw new Error('Failed to fetch event')
      const data = await response.json()
      setFormData(data)
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

  // ... form rendering remains unchanged
  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Edit Event: {formData.name || '...'}</h1>
      {/* Rest of the form remains as you have it */}
      {/* No change needed to form rendering, so I kept it out to avoid redundancy */}
    </div>
  )
}
