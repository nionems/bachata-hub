'use client'

import { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ShopFormData {
  name: string;
  location: string;
  state: string;
  address: string;
  googleReviewLink: string;
  websiteLink: string;
  image: File | null;
  imageUrl?: string;
  comment: string;
}

export default function NewShopPage() {
  const router = useRouter()
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    googleReviewLink: '',
    websiteLink: '',
    image: null,
    imageUrl: '',
    comment: '',
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  const states = [
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' },
  ]

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target

    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null

      setFormData((prev) => ({
        ...prev,
        image: file,
      }))

      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
      }

      if (file) {
        const newPreviewUrl = URL.createObjectURL(file)
        setImagePreviewUrl(newPreviewUrl)
      } else {
        setImagePreviewUrl(null)
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl)
        console.log("Revoked image preview URL:", imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl])

  const handleImageUpload = async (file: File): Promise<string> => {
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })
      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }
      const data = await response.json()
      return data.imageUrl
    } catch (uploadError) {
      console.error("Upload error:", uploadError)
      throw uploadError
    }
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    let uploadedImageUrl = ''
    if (formData.image) {
      try {
        uploadedImageUrl = await handleImageUpload(formData.image)
      } catch (uploadError: any) {
        setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
        setIsLoading(false)
        return
      }
    }

    const shopData = {
      name: formData.name,
      location: formData.location,
      state: formData.state,
      address: formData.address,
      googleReviewLink: formData.googleReviewLink,
      websiteLink: formData.websiteLink,
      imageUrl: uploadedImageUrl || formData.imageUrl,
      comment: formData.comment
    }

    try {
      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      router.push('/admin/dashboard?tab=shop')
    } catch (submitError: any) {
      setError(`Failed to add shop: ${submitError.message}`)
      console.error('Submit error:', submitError)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Add New Shop</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Shop Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Best Dance Shoes"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location (City/Suburb) <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="e.g., Sydney"
            />
          </div>
          <div>
            <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
              State <span className="text-red-500">*</span>
            </label>
            <select
              id="state"
              name="state"
              value={formData.state}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 bg-white"
            >
              <option value="">Select State</option>
              {states.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., 123 Dance St"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="googleReviewLink" className="block text-sm font-medium text-gray-700 mb-1">
              Google Review Link
            </label>
            <input
              type="url"
              id="googleReviewLink"
              name="googleReviewLink"
              value={formData.googleReviewLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://maps.google.com/..."
            />
          </div>
          <div>
            <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700 mb-1">
              Website Link
            </label>
            <input
              type="url"
              id="websiteLink"
              name="websiteLink"
              value={formData.websiteLink}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://www.exampleshop.com"
            />
          </div>
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Shop Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {imagePreviewUrl && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
              <img
                src={imagePreviewUrl}
                alt="Selected shop image preview"
                className="max-w-xs max-h-48 object-contain border rounded shadow-sm"
              />
            </div>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            rows={3}
            value={formData.comment}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="e.g., Great selection of comfortable heels"
          ></textarea>
        </div>

        <div className="pt-4">
          <button
            type="submit"
            disabled={isLoading}
            className="w-full inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {isLoading ? 'Adding Shop...' : 'Add Shop'}
          </button>
        </div>
      </form>
    </div>
  )
} 