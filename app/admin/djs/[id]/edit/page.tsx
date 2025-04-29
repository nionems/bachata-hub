'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { states as AUSTRALIAN_STATES } from '@/lib/constants'

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

export default function EditDJPage({ params }: { params: { id: string } }) {
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

  useEffect(() => {
    const fetchDJ = async () => {
      try {
        const response = await fetch(`/api/djs/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch DJ')
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError('Failed to load DJ')
        console.error(err)
      }
    }

    fetchDJ()
  }, [params.id])

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('folder', 'djs')

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error('Failed to upload image')
      }

      const data = await response.json()
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
        const uploadResponse = await handleImageUpload(selectedImage)
        imageUrl = uploadResponse.imageUrl || uploadResponse
      }

      const response = await fetch(`/api/djs/${params.id}`, {
        method: 'PUT',
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
        throw new Error('Failed to update DJ')
      }

      router.push('/admin/dashboard')
    } catch (err) {
      console.error('Error updating DJ:', err)
      setError(err instanceof Error ? err.message : 'Failed to update DJ')
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-red-500">{error}</div>
          <button
            onClick={() => router.back()}
            className="mt-4 px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
          >
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 p-2 sm:p-4">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Edit DJ</h1>
        
        <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              required
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              name="state"
              value={formData.state}
              onChange={handleInputChange}
              required
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="">Select a state</option>
              {AUSTRALIAN_STATES.map(state => (
                <option key={state.value} value={state.value}>
                  {state.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact</label>
            <input
              type="text"
              name="contact"
              value={formData.contact}
              onChange={handleInputChange}
              required
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Music Styles (comma-separated)</label>
            <input
              type="text"
              name="musicStyles"
              value={formData.musicStyles}
              onChange={handleInputChange}
              required
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={formData.imageUrl}
              onChange={handleInputChange}
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
              className="mt-0.5 sm:mt-1"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Comment</label>
            <textarea
              name="comment"
              value={formData.comment}
              onChange={handleInputChange}
              rows={2}
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Instagram Link</label>
            <input
              type="url"
              name="instagramLink"
              value={formData.instagramLink}
              onChange={handleInputChange}
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Facebook Link</label>
            <input
              type="url"
              name="facebookLink"
              value={formData.facebookLink}
              onChange={handleInputChange}
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email Link</label>
            <input
              type="email"
              name="emailLink"
              value={formData.emailLink}
              onChange={handleInputChange}
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Music Link</label>
            <input
              type="url"
              name="musicLink"
              value={formData.musicLink}
              onChange={handleInputChange}
              className="mt-0.5 sm:mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              placeholder="https://soundcloud.com/username or https://mixcloud.com/username"
            />
          </div>

          <div className="flex gap-2 sm:gap-3 pt-3 sm:pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-3 sm:px-4 py-1 sm:py-1.5 rounded hover:bg-blue-600 disabled:bg-blue-300"
            >
              {isLoading ? 'Updating...' : 'Update DJ'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="px-3 sm:px-4 py-1 sm:py-1.5 border rounded hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 