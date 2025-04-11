"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface EditShopPageProps {
  params: {
    id: string
  }
}

export default function EditShopPage({ params }: EditShopPageProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shop, setShop] = useState<any>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopDoc = await getDoc(doc(db, 'shops', params.id))
        if (shopDoc.exists()) {
          const shopData = shopDoc.data()
          setShop(shopData)
          if (shopData.imageUrl) {
            setImagePreview(shopData.imageUrl)
          }
        } else {
          setError('Shop not found')
        }
      } catch (error) {
        console.error('Error fetching shop:', error)
        setError('Failed to fetch shop')
      } finally {
        setLoading(false)
      }
    }

    fetchShop()
  }, [params.id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleImageUpload = async (file: File): Promise<string> => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload image')
      }

      const data = await response.json()
      if (!data.imageUrl) {
        console.error('Invalid upload response:', data)
        throw new Error('Invalid upload response: missing imageUrl')
      }

      return data.imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw error instanceof Error ? error : new Error('Failed to upload image')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)

    try {
      let imageUrl = shop.imageUrl

      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage)
      }

      const form = e.target as HTMLFormElement
      const formElements = form.elements
      const shopData = {
        name: (formElements.namedItem('name') as HTMLInputElement)?.value || '',
        location: (formElements.namedItem('location') as HTMLInputElement)?.value || '',
        state: (formElements.namedItem('state') as HTMLInputElement)?.value || '',
        address: (formElements.namedItem('address') as HTMLInputElement)?.value || '',
        googleReviewLink: (formElements.namedItem('googleReviewLink') as HTMLInputElement)?.value || '',
        websiteLink: (formElements.namedItem('websiteLink') as HTMLInputElement)?.value || '',
        comment: (formElements.namedItem('comment') as HTMLTextAreaElement)?.value || '',
        imageUrl,
      }

      const response = await fetch(`/api/shops/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update shop')
      }

      router.push('/admin/shops')
    } catch (error) {
      console.error('Error updating shop:', error)
      setError(error instanceof Error ? error.message : 'Failed to update shop')
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!shop) return <div>Shop not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Shop</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl">
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            defaultValue={shop.name}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
            Location
          </label>
          <input
            type="text"
            id="location"
            name="location"
            defaultValue={shop.location}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="state" className="block text-sm font-medium text-gray-700">
            State
          </label>
          <input
            type="text"
            id="state"
            name="state"
            defaultValue={shop.state}
            required
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">
            Address
          </label>
          <input
            type="text"
            id="address"
            name="address"
            defaultValue={shop.address}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="googleReviewLink" className="block text-sm font-medium text-gray-700">
            Google Review Link
          </label>
          <input
            type="url"
            id="googleReviewLink"
            name="googleReviewLink"
            defaultValue={shop.googleReviewLink}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="websiteLink" className="block text-sm font-medium text-gray-700">
            Website Link
          </label>
          <input
            type="url"
            id="websiteLink"
            name="websiteLink"
            defaultValue={shop.websiteLink}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="comment" className="block text-sm font-medium text-gray-700">
            Comment
          </label>
          <textarea
            id="comment"
            name="comment"
            defaultValue={shop.comment}
            rows={3}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">
            Image
          </label>
          <input
            type="file"
            id="image"
            name="image"
            accept="image/*"
            onChange={handleImageChange}
            className="mt-1 block w-full"
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="h-32 w-32 object-cover rounded-md"
              />
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium text-white bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
          >
            Update Shop
          </button>
        </div>
      </form>
    </div>
  )
} 