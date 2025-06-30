'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface FestivalFormData {
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string
  imageUrl: string
  comment: string
  googleMapLink: string
  featured: 'yes' | 'no'
  published: boolean
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

export default function NewFestivalPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<FestivalFormData>({
    name: '',
    startDate: '',
    endDate: '',
    location: '',
    state: '',
    address: '',
    eventLink: '',
    price: '',
    ticketLink: '',
    danceStyles: '',
    imageUrl: '',
    comment: '',
    googleMapLink: '',
    featured: 'no',
    published: true
  })

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('folder', 'festivals')

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setSelectedImage(file)
      if (imagePreviewUrl?.startsWith('blob:')) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let imageUrl = formData.imageUrl
      if (selectedImage) {
        try {
          imageUrl = await handleImageUpload(selectedImage)
        } catch (uploadError: any) {
          setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
          setIsLoading(false)
          return
        }
      }

      const response = await fetch('/api/festivals', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      router.push('/admin/dashboard?tab=festivals')
    } catch (submitError: any) {
      setError(`Failed to create festival: ${submitError.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Festival</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium mb-1">Festival Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Festival Dates */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">Start Date*</label>
            <input
              type="date"
              value={formData.startDate}
              onChange={handleChange}
              name="startDate"
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date*</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={handleChange}
              name="endDate"
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        {/* Location Information */}
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

        {/* Links and Price */}
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

        {/* Dance Styles */}
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

        {/* Featured Festival */}
        <div>
          <label className="block text-sm font-medium mb-1">Featured Festival</label>
          <select
            value={formData.featured}
            onChange={handleChange}
            name="featured"
            className="w-full p-2 border rounded"
          >
            <option value="no">No</option>
            <option value="yes">Yes</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Featured festivals will be highlighted on the website
          </p>
        </div>

        {/* Published Status */}
        <div>
          <label className="block text-sm font-medium mb-1">Published Status</label>
          <select
            value={formData.published ? 'true' : 'false'}
            onChange={(e) => setFormData(prev => ({ ...prev, published: e.target.value === 'true' }))}
            name="published"
            className="w-full p-2 border rounded"
          >
            <option value="true">Published (Visible to public)</option>
            <option value="false">Draft (Hidden from public)</option>
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Draft festivals are hidden from the public but can be edited and published later
          </p>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Festival Image *</label>
          <div className="space-y-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleChange}
                name="image"
                className="w-full p-2 border rounded"
                required
              />
            </div>
            {imagePreviewUrl && (
              <div className="mt-4 p-4 border rounded-lg">
                <p className="text-sm text-gray-500 mb-2">Preview:</p>
                <div className="relative aspect-video w-full max-w-md">
                  <img
                    src={imagePreviewUrl}
                    alt="Preview"
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Additional Information */}
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

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Creating...' : 'Create Festival'}
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