"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

interface Shop {
  id: string
  name: string
  location: string
  state: string
  address: string
  contactInfo: string
  email: string
  website: string
  price: string
  imageUrl: string
  comment: string
  googleMapLink: string
  googleReviewLink: string
  createdAt: string
  updatedAt: string
  discountCode: string
}

export default function EditShopPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [shop, setShop] = useState<Shop | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)

  useEffect(() => {
    const fetchShop = async () => {
      try {
        const shopDoc = await getDoc(doc(db, 'shops', params.id))
        if (shopDoc.exists()) {
          const shopData = shopDoc.data() as Shop
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

    if (!shop) {
      setError('Shop data not found')
      return
    }

    try {
      let imageUrl = shop.imageUrl

      if (selectedImage) {
        imageUrl = await handleImageUpload(selectedImage)
      }

      const shopData = {
        name: shop.name,
        location: shop.location,
        state: shop.state,
        address: shop.address,
        comment: shop.comment,
        googleReviewLink: shop.googleReviewLink,
        imageUrl: imageUrl,
        website: shop.website,
        discountCode: shop.discountCode,
        updatedAt: new Date().toISOString()
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
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={shop.name}
              onChange={(e) => setShop({ ...shop, name: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={shop.location}
              onChange={(e) => setShop({ ...shop, location: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <input
              type="text"
              name="state"
              value={shop.state}
              onChange={(e) => setShop({ ...shop, state: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={shop.address}
              onChange={(e) => setShop({ ...shop, address: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={shop.contactInfo}
              onChange={(e) => setShop({ ...shop, contactInfo: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={shop.email}
              onChange={(e) => setShop({ ...shop, email: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <input
              type="url"
              name="websiteLink"
              value={shop.website}
              onChange={(e) => setShop({ ...shop, website: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Comment</label>
            <textarea
              name="comment"
              value={shop.comment}
              onChange={(e) => setShop({ ...shop, comment: e.target.value })}
              className="w-full p-2 border rounded"
              rows={3}
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Discount Code</label>
            <input
              type="text"
              name="discountCode"
              value={shop.discountCode}
              onChange={(e) => setShop({ ...shop, discountCode: e.target.value })}
              className="w-full p-2 border rounded"
              placeholder="Enter discount code"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full p-2 border rounded"
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