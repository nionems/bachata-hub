'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'

export default function NewSchool() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [school, setSchool] = useState<Partial<School>>({
    name: '',
    location: '',
    state: '',
    address: '',
    contactInfo: '',
    instructors: [],
    website: '',
    danceStyles: [],
    imageUrl: '',
    comment: '',
    googleReviewsUrl: '',
    googleRating: 0,
    googleReviewsCount: 0,
  })

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
        credentials: 'include'
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('Upload error response:', errorText)
        throw new Error(`Upload failed: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      console.log('Upload response:', data)

      if (!data || !data.url) {
        throw new Error('Invalid response from upload server')
      }

      return data.url
    } catch (error) {
      console.error('Upload error:', error)
      throw new Error('Failed to upload image. Please try again.')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      let imageUrl = ''
      if (school.imageFile) {
        imageUrl = await handleImageUpload(school.imageFile)
      } else if (school.imageUrl) {
        imageUrl = school.imageUrl
      }

      const schoolData = {
        name: school.name,
        location: school.location,
        state: school.state,
        address: school.address,
        contactInfo: school.contactInfo,
        instructors: school.instructors,
        website: school.website,
        danceStyles: school.danceStyles,
        imageUrl: imageUrl,
        comment: school.comment,
        googleReviewsUrl: school.googleReviewsUrl,
        googleRating: school.googleRating,
        googleReviewsCount: school.googleReviewsCount,
      }

      console.log('Submitting school data:', schoolData)

      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(schoolData),
        credentials: 'include'
      })

      if (!response.ok) {
        throw new Error('Failed to create school')
      }

      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create school')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Add New School</h1>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={school.name}
            onChange={(e) => setSchool({ ...school, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={school.location}
            onChange={(e) => setSchool({ ...school, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <input
            type="text"
            value={school.state}
            onChange={(e) => setSchool({ ...school, state: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={school.address}
            onChange={(e) => setSchool({ ...school, address: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            value={school.contactInfo}
            onChange={(e) => setSchool({ ...school, contactInfo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructors</label>
          <input
            type="text"
            value={school.instructors?.join(', ') || ''}
            onChange={(e) => setSchool({ ...school, instructors: e.target.value.split(',').map(i => i.trim()).filter(Boolean) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={school.website}
            onChange={(e) => setSchool({ ...school, website: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dance Styles</label>
          <input
            type="text"
            value={school.danceStyles?.join(', ') || ''}
            onChange={(e) => setSchool({ ...school, danceStyles: e.target.value.split(',').map(i => i.trim()).filter(Boolean) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Image</label>
          <div className="mt-1 space-y-2">
            <div>
              <label className="block text-sm text-gray-500 mb-1">Upload Image File</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0]
                  if (file) {
                    setSchool({ ...school, imageFile: file, imageUrl: '' })
                  }
                }}
                className="block w-full"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500 mb-1">OR</span>
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-500 mb-1">Image URL</label>
              <input
                type="url"
                value={school.imageUrl}
                onChange={(e) => setSchool({ ...school, imageUrl: e.target.value, imageFile: undefined })}
                placeholder="https://example.com/image.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Comment</label>
          <textarea
            value={school.comment}
            onChange={(e) => setSchool({ ...school, comment: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            rows={3}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Reviews URL</label>
          <input
            type="url"
            value={school.googleReviewsUrl}
            onChange={(e) => setSchool({ ...school, googleReviewsUrl: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Rating</label>
          <input
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={school.googleRating}
            onChange={(e) => setSchool({ ...school, googleRating: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Reviews Count</label>
          <input
            type="number"
            min="0"
            value={school.googleReviewsCount}
            onChange={(e) => setSchool({ ...school, googleReviewsCount: Number(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save School'}
          </button>
        </div>
      </form>
    </div>
  )
} 