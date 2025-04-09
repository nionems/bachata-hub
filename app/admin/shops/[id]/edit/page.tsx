'use client'

import { useState, useEffect, ChangeEvent } from 'react'
import { useRouter } from 'next/navigation'

interface ShopFormData {
  name: string
  location: string
  state: string
  address: string
  googleReviewLink: string
  websiteLink: string
  comment: string
  imageUrl: string
  image?: File | null
}

export default function EditShopPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    googleReviewLink: '',
    websiteLink: '',
    comment: '',
    imageUrl: '',
    image: null
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`/api/shops/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch shop')
        const data = await response.json()
        setFormData(data)
        if (data.imageUrl) {
          setImagePreviewUrl(data.imageUrl)
        }
      } catch (err) {
        setError('Failed to load shop')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShop()
  }, [params.id])

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      if (imagePreviewUrl && !imagePreviewUrl.includes('http')) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrl && !imagePreviewUrl.includes('http')) {
        URL.revokeObjectURL(imagePreviewUrl)
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      let finalImageUrl = formData.imageUrl
      
      if (formData.image) {
        try {
          finalImageUrl = await handleImageUpload(formData.image)
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
        imageUrl: finalImageUrl,
        comment: formData.comment
      }

      const response = await fetch(`/api/shops/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      })

      if (!response.ok) throw new Error('Failed to update shop')

      router.push('/admin/dashboard?tab=shop')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update shop')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Shop</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            name="location"
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <select
            name="state"
            id="state"
            value={formData.state}
            onChange={(e) => setFormData({ ...formData, state: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          >
            <option value="">Select a state</option>
            <option value="NSW">New South Wales</option>
            <option value="VIC">Victoria</option>
            <option value="QLD">Queensland</option>
            <option value="WA">Western Australia</option>
            <option value="SA">South Australia</option>
            <option value="TAS">Tasmania</option>
            <option value="ACT">Australian Capital Territory</option>
            <option value="NT">Northern Territory</option>
          </select>
        </div>

        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            name="address"
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="googleReviewLink" className="block text-sm font-medium text-gray-700">
            Google Review Link
          </label>
          <input
            type="url"
            name="googleReviewLink"
            id="googleReviewLink"
            value={formData.googleReviewLink}
            onChange={(e) => setFormData({ ...formData, googleReviewLink: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700">
            Website Link
          </label>
          <input
            type="url"
            name="websiteLink"
            id="websiteLink"
            value={formData.websiteLink}
            onChange={(e) => setFormData({ ...formData, websiteLink: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          />
        </div>

        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            New Image (optional)
          </label>
          <input
            type="file"
            name="image"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
        </div>

        {imagePreviewUrl && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Current Image:</p>
            <img
              src={imagePreviewUrl}
              alt="Current shop image"
              className="w-32 h-32 object-cover rounded"
            />
          </div>
        )}

        <div>
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            name="comment"
            id="comment"
            rows={4}
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
          ></textarea>
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:bg-blue-300"
          >
            {isLoading ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard?tab=shop')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 