'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { School } from '@/types/school'
import { StateSelect } from '@/components/ui/StateSelect'

interface SchoolFormData {
  name: string;
  location: string;
  state: string;
  address: string;
  website?: string;
  googleReviewLink?: string;
  contactInfo: string;
  danceStyles: string[];
  googleRating?: number;
  googleReviewsCount?: number;
  googleReviewsUrl?: string;
  image: File | null;
  imageUrl?: string;
  socialUrl: string;
  googleMapLink: string;
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

export default function EditSchoolPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    website: '',
    googleReviewLink: '',
    contactInfo: '',
    danceStyles: [],
    googleRating: 0,
    googleReviewsCount: 0,
    googleReviewsUrl: '',
    image: null,
    imageUrl: '',
    socialUrl: '',
    googleMapLink: ''
  })

  useEffect(() => {
    fetchSchool()
  }, [id])

  const fetchSchool = async () => {
    try {
      const response = await fetch(`/api/schools/${id}`)
      if (!response.ok) throw new Error('Failed to fetch school')
      const data = await response.json()
      
      // Ensure danceStyles is always an array
      const danceStyles = Array.isArray(data.danceStyles) 
        ? data.danceStyles 
        : data.danceStyles 
          ? data.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)
          : []

      setFormData({
        ...data,
        danceStyles,
        image: null // Reset image since we don't want to keep the File object
      })

      if (data.imageUrl) {
        setImagePreviewUrl(data.imageUrl)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrl && !formData.imageUrl?.includes(imagePreviewUrl)) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl, formData.imageUrl])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    try {
      let finalImageUrl = formData.imageUrl
      if (formData.image) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.image)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })
        if (!uploadResponse.ok) throw new Error('Failed to upload image')
        const uploadData = await uploadResponse.json()
        finalImageUrl = uploadData.imageUrl
      }

      const updatedSchool = {
        ...formData,
        imageUrl: finalImageUrl,
      }

      const response = await fetch(`/api/schools/${id}`, {
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
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit School</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Location</label>
            <input
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">State</label>
            <select
              value={formData.state}
              onChange={(e) => setFormData({ ...formData, state: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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

          <div>
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Contact Info</label>
            <input
              type="text"
              value={formData.contactInfo}
              onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Website</label>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => setFormData({ ...formData, website: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dance Styles</label>
          <input
            type="text"
            value={formData.danceStyles.join(', ')}
            onChange={(e) => setFormData({ 
              ...formData, 
              danceStyles: e.target.value.split(',').map(style => style.trim()).filter(Boolean)
            })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="Enter dance styles separated by commas"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Google Rating</label>
            <input
              type="number"
              step="0.1"
              min="0"
              max="5"
              value={formData.googleRating || ''}
              onChange={(e) => setFormData({ ...formData, googleRating: parseFloat(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google Reviews Count</label>
            <input
              type="number"
              value={formData.googleReviewsCount || ''}
              onChange={(e) => setFormData({ ...formData, googleReviewsCount: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Google Reviews URL</label>
            <input
              type="url"
              value={formData.googleReviewsUrl || ''}
              onChange={(e) => setFormData({ ...formData, googleReviewsUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">School Image</label>
          {imagePreviewUrl && (
            <div className="mt-2 w-48 h-48 relative">
              <img
                src={imagePreviewUrl}
                alt="School preview"
                className="w-full h-full object-cover rounded"
              />
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-2 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="socialUrl" className="block text-sm font-medium text-gray-700">
              Social Media URL
            </label>
            <input
              type="text"
              id="socialUrl"
              name="socialUrl"
              value={formData.socialUrl}
              onChange={(e) => setFormData({ ...formData, socialUrl: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="googleMapLink" className="block text-sm font-medium text-gray-700">
              Google Maps Link
            </label>
            <input
              type="text"
              id="googleMapLink"
              name="googleMapLink"
              value={formData.googleMapLink}
              onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="https://maps.google.com/..."
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
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