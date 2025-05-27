'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AUSTRALIAN_STATES } from '@/lib/constants'

interface DJFormData {
  name: string
  location: string
  state: string
  contact: string
  musicStyles: string
  imageUrl: string
  comment: string
  instagramLink: string
  facebookLink: string
  emailLink: string
  musicLink: string
}

export default function NewDJPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<DJFormData>({
    name: '',
    location: '',
    state: '',
    contact: '',
    musicStyles: '',
    imageUrl: '',
    comment: '',
    instagramLink: '',
    facebookLink: '',
    emailLink: '',
    musicLink: ''
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'djs') // Store in djs folder

      console.log('Sending image upload request to API...') // Debug log
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Upload API error:', errorData) // Debug log
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
      console.log('Upload API response:', data) // Debug log
      return data
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
        console.log('Uploading image to storage...')
        const uploadResponse = await handleImageUpload(selectedImage)
        imageUrl = uploadResponse.imageUrl || uploadResponse
        console.log('Image uploaded successfully:', imageUrl)
      }

      console.log('Creating DJ with data:', { ...formData, imageUrl })

      const response = await fetch('/api/djs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          imageUrl
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Server error:', errorData)
        throw new Error('Failed to create DJ')
      }

      const result = await response.json()
      console.log('DJ created successfully:', result)

      router.push('/admin/dashboard')
    } catch (err) {
      console.error('Error creating DJ:', err)
      setError(err instanceof Error ? err.message : 'Failed to create DJ')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New DJ</h1>

      {error && (
        <div className="bg-red-50 text-red-500 p-4 rounded mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        {/* Basic Information */}
        <div>
          <label className="block text-sm font-medium mb-1">Name*</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({...formData, name: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
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
            <select
              value={formData.state}
              onChange={(e) => setFormData({...formData, state: e.target.value})}
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

        {/* Contact */}
        <div>
          <label className="block text-sm font-medium mb-1">Contact*</label>
          <input
            type="text"
            value={formData.contact}
            onChange={(e) => setFormData({...formData, contact: e.target.value})}
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Music Styles */}
        <div>
          <label className="block text-sm font-medium mb-1">Music Styles*</label>
          <input
            type="text"
            value={formData.musicStyles}
            onChange={(e) => setFormData({...formData, musicStyles: e.target.value})}
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
                  alt="Current DJ image"
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

        {/* Social Links */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Link</label>
            <input
              type="url"
              value={formData.instagramLink}
              onChange={(e) => setFormData({...formData, instagramLink: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="https://instagram.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook Link</label>
            <input
              type="url"
              value={formData.facebookLink}
              onChange={(e) => setFormData({...formData, facebookLink: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="https://facebook.com/..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Email Link</label>
            <input
              type="email"
              value={formData.emailLink}
              onChange={(e) => setFormData({...formData, emailLink: e.target.value})}
              className="w-full p-2 border rounded"
              placeholder="example@email.com"
            />
          </div>
        </div>

        {/* Music Link */}
        <div>
          <label className="block text-sm font-medium mb-1">Music Link</label>
          <input
            type="url"
            value={formData.musicLink}
            onChange={(e) => setFormData({...formData, musicLink: e.target.value})}
            className="w-full p-2 border rounded"
            placeholder="https://soundcloud.com/username or https://mixcloud.com/username"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            value={formData.comment}
            onChange={(e) => setFormData({...formData, comment: e.target.value})}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        {/* Submit Buttons */}
        <div className="flex gap-4 pt-6">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Creating...' : 'Create DJ'}
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