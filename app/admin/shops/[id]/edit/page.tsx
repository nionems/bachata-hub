'use client'

import { useState, useEffect } from 'react'
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
    imageUrl: ''
  })
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const response = await fetch(`/api/shops/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch shop')
        const data = await response.json()
        setFormData(data)
      } catch (err) {
        setError('Failed to load shop')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchShop()
  }, [params.id])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const formDataToSend = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        if (value) formDataToSend.append(key, value)
      })

      const response = await fetch(`/api/shops/${params.id}`, {
        method: 'PUT',
        body: formDataToSend,
      })

      if (!response.ok) throw new Error('Failed to update shop')

      router.push('/admin/dashboard')
      router.refresh()
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
            className="mt-1 block w-full"
          />
        </div>

        {formData.imageUrl && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Current Image:</p>
            <img
              src={formData.imageUrl}
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
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 