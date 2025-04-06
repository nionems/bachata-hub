'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Festival {
  id: string
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
}

export default function EditFestivalPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  
  const [formData, setFormData] = useState<Festival>({
    id: '',
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
    googleMapLink: ''
  })

  useEffect(() => {
    fetchFestival()
  }, [])

  const fetchFestival = async () => {
    try {
      const response = await fetch(`/api/festivals/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch festival')
      const data = await response.json()
      setFormData(data)
    } catch (err) {
      setError('Failed to load festival')
      console.error(err)
    }
  }

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'festivals')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) throw new Error('Failed to upload image')

      const data = await response.json()
      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let imageUrl = formData.imageUrl
      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage)
      }

      const response = await fetch(`/api/festivals/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        }),
      })

      if (!response.ok) throw new Error('Failed to update festival')

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update festival')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Festival</h1>

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
            onChange={(e) => setFormData({...formData, name: e.target.value})}
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
              onChange={(e) => setFormData({...formData, startDate: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">End Date*</label>
            <input
              type="date"
              value={formData.endDate}
              onChange={(e) => setFormData({...formData, endDate: e.target.value})}
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
              onChange={(e) => setFormData({...formData, location: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Address*</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({...formData, address: e.target.value})}
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
              onChange={(e) => setFormData({...formData, eventLink: e.target.value})}
              className="w-full p-2 border rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Price*</label>
            <input
              type="number"
              value={formData.price}
              onChange={(e) => setFormData({...formData, price: e.target.value})}
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
              onChange={(e) => setFormData({...formData, ticketLink: e.target.value})}
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
            onChange={(e) => setFormData({...formData, danceStyles: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="e.g., Bachata, Salsa, Kizomba"
            required
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium mb-1">Image</label>
          <div className="space-y-2">
            {formData.imageUrl && (
              <div className="w-32 h-32 relative mb-2">
                <img
                  src={formData.imageUrl}
                  alt="Current festival image"
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
              onChange={(e) => setFormData({...formData, imageUrl: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="Image URL"
            />
          </div>
        </div>

        {/* Additional Information */}
        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Google Map Link</label>
          <input
            type="url"
            value={formData.googleMapLink}
            onChange={(e) => setFormData({...formData, googleMapLink: e.target.value})}
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
            {isLoading ? 'Updating...' : 'Update Festival'}
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