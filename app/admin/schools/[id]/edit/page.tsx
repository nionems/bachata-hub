'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'

export default function EditSchool({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    fetchSchool()
  }, [params.id])

  const fetchSchool = async () => {
    try {
      const response = await fetch(`/api/schools/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch school')
      const data = await response.json()
      setSchool(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!school) return

    try {
      let imageUrl = school.imageUrl
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })
        if (!uploadResponse.ok) throw new Error('Failed to upload image')
        const { url } = await uploadResponse.json()
        imageUrl = url
      }

      const updatedSchool = {
        ...school,
        imageUrl,
      }

      const response = await fetch(`/api/schools/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSchool),
      })

      if (!response.ok) throw new Error('Failed to update school')
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update school')
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!school) return <div className="p-4">School not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit School</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <select
              value={school.state}
              onChange={(e) => setSchool({ ...school, state: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            >
              <option value="NSW">New South Wales</option>
              <option value="VIC">Victoria</option>
              <option value="QLD">Queensland</option>
              <option value="WA">Western Australia</option>
            </select>
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
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={school.website}
              onChange={(e) => setSchool({ ...school, website: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Dance Styles */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Dance Styles</label>
          <input
            type="text"
            value={Array.isArray(school.danceStyles) ? school.danceStyles.join(', ') : ''}
            onChange={(e) => setSchool({ 
              ...school, 
              danceStyles: e.target.value.split(',').map(style => style.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter dance styles separated by commas"
          />
        </div>

        {/* Google Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={school.googleRating || ''}
              onChange={(e) => setSchool({ ...school, googleRating: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google Reviews Count</label>
            <input
              type="number"
              value={school.googleReviewsCount || ''}
              onChange={(e) => setSchool({ ...school, googleReviewsCount: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google Reviews URL</label>
            <input
              type="url"
              value={school.googleReviewsUrl || ''}
              onChange={(e) => setSchool({ ...school, googleReviewsUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700">School Image</label>
          {school.imageUrl && (
            <div className="mt-2 w-48 h-48 relative">
              <img
                src={school.imageUrl}
                alt={school.name}
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setSelectedImage(e.target.files?.[0] || null)}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 