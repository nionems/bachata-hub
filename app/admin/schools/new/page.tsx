'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'

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
  googleMapLink: string;
  socialUrl: string;
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

export default function NewSchoolPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
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
    googleMapLink: '',
    socialUrl: '',
  })
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setFormData({ ...formData, image: file })
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
    } else {
      setFormData({ ...formData, [name]: value })
    }
  }

  useEffect(() => {
    return () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl) }
  }, [imagePreviewUrl])

  const handleImageUpload = async (file: File): Promise<string> => {
    console.log("School Form: Starting image upload for", file.name)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    let responseText = '' // To store raw text for debugging

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      console.log(`School Form: Received response status ${response.status}`)
      responseText = await response.text() // Get text regardless of status
      console.log("School Form: Raw response text:", responseText)

      if (!response.ok) {
        let errorDetails = `HTTP error! status: ${response.status}`
        try {
          const errorData = JSON.parse(responseText)
          errorDetails = errorData?.error || errorData?.details || errorDetails
        } catch (parseError) { /* Ignore parsing error if response wasn't JSON */ }
        console.error("School Form: Upload request failed:", errorDetails)
        throw new Error(errorDetails) // Throw error if not ok
      }

      // --- If response.ok, proceed to parse ---
      let data
      try {
        data = JSON.parse(responseText)
        console.log("School Form: Parsed response JSON:", data)
      } catch (parseError) {
        console.error("School Form: Failed to parse successful response as JSON.", parseError)
        throw new Error(`Invalid JSON received from upload server: ${responseText}`) // More specific error
      }

      if (!data || typeof data.imageUrl !== 'string' || data.imageUrl === '') {
        console.error("School Form: Invalid response structure from /api/upload. 'imageUrl' missing, not a string, or empty:", data)
        throw new Error('Invalid response structure from upload server') // Refined error
      }

      console.log("School Form: Successfully got imageUrl:", data.imageUrl)
      return data.imageUrl // Return the URL string

    } catch (uploadError) {
      console.error("School Form: Error during upload fetch/processing:", uploadError)
      // Ensure we throw an actual Error object
      throw uploadError instanceof Error ? uploadError : new Error(String(uploadError))
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    console.log("School Form: Starting handleSubmit")

    let uploadedImageUrl = ''
    // 1. Upload image if selected
    if (formData.image) {
      console.log("School Form: Image selected, attempting upload...")
      try {
        uploadedImageUrl = await handleImageUpload(formData.image)
        console.log("School Form: Image upload successful, URL:", uploadedImageUrl)
      } catch (uploadError: any) {
        console.error("School Form: Image upload failed during submit:", uploadError)
        setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
        setIsLoading(false)
        return // Stop submission
      }
    } else {
      console.log("School Form: No image selected for upload.")
    }

    // 2. Prepare data for the school API (e.g., /api/schools)
    // IMPORTANT: Send `uploadedImageUrl` (the string), not `formData.image` (the File)
    const schoolData = {
      name: formData.name,
      location: formData.location,
      state: formData.state,
      address: formData.address,
      website: formData.website,
      googleReviewLink: formData.googleReviewLink,
      contactInfo: formData.contactInfo,
      danceStyles: formData.danceStyles,
      googleRating: formData.googleRating,
      googleReviewsCount: formData.googleReviewsCount,
      googleReviewsUrl: formData.googleReviewsUrl,
      imageUrl: uploadedImageUrl, // Send the URL string from the upload
      googleMapLink: formData.googleMapLink,
      socialUrl: formData.socialUrl,
    }

    console.log("School Form: Submitting data to /api/schools:", schoolData)

    // 3. Send data to your school creation API endpoint
    try {
      // Replace '/api/schools' with your actual endpoint if different
      const response = await fetch('/api/schools', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }, // Assuming your API expects JSON
        body: JSON.stringify(schoolData),
      })

      console.log(`School Form: Received response status ${response.status} from /api/schools`)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Failed to parse error response' }))
        console.error("School Form: Error submitting school data:", errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      console.log("School Form: School added successfully!")
      router.push('/admin/dashboard') // Redirect on success

    } catch (submitError: any) {
      console.error("School Form: Error during school submission:", submitError)
      setError(`Failed to add school: ${submitError.message}`)
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
            value={formData.name}
            onChange={handleChange}
            name="name"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={formData.location}
            onChange={handleChange}
            name="location"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">State</label>
          <select
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            name="state"
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
            onChange={handleChange}
            name="address"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={formData.website}
            onChange={handleChange}
            name="website"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Reviews URL</label>
          <input
            type="url"
            value={formData.googleReviewLink}
            onChange={handleChange}
            name="googleReviewLink"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            value={formData.contactInfo}
            onChange={handleChange}
            name="contactInfo"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dance Styles</label>
          <input
            type="text"
            value={formData.danceStyles.join(', ')}
            onChange={(e) => setFormData({ ...formData, danceStyles: e.target.value.split(',').map(s => s.trim()) })}
            name="danceStyles"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Rating</label>
          <input
            type="number"
            value={formData.googleRating}
            onChange={(e) => setFormData({ ...formData, googleRating: Number(e.target.value) })}
            name="googleRating"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Reviews Count</label>
          <input
            type="number"
            value={formData.googleReviewsCount}
            onChange={(e) => setFormData({ ...formData, googleReviewsCount: Number(e.target.value) })}
            name="googleReviewsCount"
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Google Reviews URL</label>
          <input
            type="url"
            value={formData.googleReviewsUrl}
            onChange={(e) => setFormData({ ...formData, googleReviewsUrl: e.target.value })}
            name="googleReviewsUrl"
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
                onChange={handleChange}
                name="image"
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
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                name="imageUrl"
                placeholder="https://example.com/image.jpg"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
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
              onChange={handleChange}
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
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
              placeholder="https://maps.google.com/..."
            />
          </div>
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
            {isLoading ? 'Adding School...' : 'Add School'}
          </button>
        </div>
      </form>
      {imagePreviewUrl && (
        <div className="mt-4">
          <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
          <img src={imagePreviewUrl} alt="Preview" className="max-w-xs max-h-48 object-contain border rounded shadow-sm" />
        </div>
      )}
    </div>
  )
} 