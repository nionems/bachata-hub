'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { DANCE_STYLES, AUSTRALIAN_STATES } from '@/lib/constants'

interface DJFormData {
  name: string
  location: string
  state: string
  email: string
  danceStyles: string[]
  imageUrl: string
  comment: string
  instagramLink: string
  facebookLink: string
  musicLink: string
}

export default function NewDJPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<DJFormData>({
    name: '',
    location: '',
    state: '',
    email: '',
    danceStyles: [],
    imageUrl: '',
    comment: '',
    instagramLink: '',
    facebookLink: '',
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

  // Handle dance style checkbox changes
  const handleDanceStyleChange = (danceStyle: string) => {
    setFormData(prev => ({
      ...prev,
      danceStyles: prev.danceStyles.includes(danceStyle)
        ? prev.danceStyles.filter(style => style !== danceStyle)
        : [...prev.danceStyles, danceStyle]
    }))
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
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
            name="name"
            value={formData.name}
            onChange={handleInputChange}
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
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">State*</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
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
          <label className="block text-sm font-medium mb-1">Email*</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="your@email.com"
            required
          />
        </div>

        {/* Dance Styles */}
        <div>
          <label className="block text-sm font-medium mb-2">Dance Styles *</label>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
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
          {formData.danceStyles.length === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select at least one dance style</p>
          )}
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
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="Image URL"
            />
          </div>
        </div>

        {/* Social Links */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Instagram Username</label>
            <input
              type="text"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="yourusername"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Facebook Username</label>
            <input
              type="text"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleInputChange}
              className="w-full p-2 border rounded"
              placeholder="yourusername"
            />
          </div>
        </div>

        {/* Music Link */}
        <div>
          <label className="block text-sm font-medium mb-1">Music Link</label>
          <input
            type="url"
            name="musicLink"
            value={formData.musicLink}
            onChange={handleInputChange}
            className="w-full p-2 border rounded"
            placeholder="https://soundcloud.com/username or https://mixcloud.com/username"
          />
        </div>

        {/* Comment */}
        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            name="comment"
            value={formData.comment}
            onChange={handleInputChange}
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