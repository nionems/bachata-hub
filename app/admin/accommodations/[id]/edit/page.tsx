'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Image from 'next/image'

interface Accommodation {
  id: string
  name: string
  location: string
  state: string
  address: string
  contactInfo: string
  email: string
  website: string
  price: string
  rooms: string
  capacity: string
  imageUrl: string
  comment: string
  googleMapLink: string
  festival: string
  facebookLink: string
  instagramLink: string
  phone: string
}

export default function EditAccommodationPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [accommodation, setAccommodation] = useState<Accommodation | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)

  useEffect(() => {
    const fetchAccommodation = async () => {
      try {
        const response = await fetch(`/api/accommodations/${params.id}`)
        if (!response.ok) {
          throw new Error('Failed to fetch accommodation')
        }
        const data = await response.json()
        setAccommodation(data)
        setImagePreview(data.imageUrl)
      } catch (error) {
        console.error('Error fetching accommodation:', error)
        toast.error('Failed to load accommodation details')
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccommodation()
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      let imageUrl = accommodation?.imageUrl

      // If a new image is selected, upload it first
      if (selectedImage) {
        const formData = new FormData()
        formData.append('file', selectedImage)
        formData.append('folder', 'accommodations')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.imageUrl
      }

      // Update the accommodation with the new image URL
      const response = await fetch(`/api/accommodations/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...accommodation,
          imageUrl,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to update accommodation')
      }

      toast.success('Accommodation updated successfully')
      router.push('/admin/dashboard')
    } catch (error) {
      console.error('Error updating accommodation:', error)
      toast.error('Failed to update accommodation')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setAccommodation(prev => prev ? { ...prev, [name]: value } : null)
  }

  if (isLoading) {
    return <div className="p-4">Loading...</div>
  }

  if (!accommodation) {
    return <div className="p-4 text-red-500">Accommodation not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit Accommodation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Image Upload Section */}
        <div className="space-y-4">
          <div className="flex items-center gap-4">
            {imagePreview && (
              <div className="relative w-32 h-32">
                <Image
                  src={imagePreview}
                  alt="Accommodation preview"
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div>
              <label className="block text-sm font-medium mb-1">Change Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={accommodation.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Festival</label>
            <input
              type="text"
              name="festival"
              value={accommodation.festival}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter the festival name this accommodation is associated with"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Location</label>
            <input
              type="text"
              name="location"
              value={accommodation.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">State</label>
            <select
              name="state"
              value={accommodation.state}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a state</option>
              <option value="NSW">New South Wales (NSW)</option>
              <option value="VIC">Victoria (VIC)</option>
              <option value="QLD">Queensland (QLD)</option>
              <option value="WA">Western Australia (WA)</option>
              <option value="SA">South Australia (SA)</option>
              <option value="TAS">Tasmania (TAS)</option>
              <option value="ACT">Australian Capital Territory (ACT)</option>
              <option value="NT">Northern Territory (NT)</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={accommodation.address}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Contact Info</label>
            <input
              type="text"
              name="contactInfo"
              value={accommodation.contactInfo}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              value={accommodation.email}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={accommodation.phone}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              placeholder="Enter phone number"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Facebook Link</label>
            <input
              type="url"
              name="facebookLink"
              value={accommodation.facebookLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter Facebook profile/link"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Instagram Link</label>
            <input
              type="url"
              name="instagramLink"
              value={accommodation.instagramLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter Instagram profile/link"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Price</label>
            <input
              type="text"
              name="price"
              value={accommodation.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Rooms</label>
            <input
              type="text"
              name="rooms"
              value={accommodation.rooms}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Capacity</label>
            <input
              type="text"
              name="capacity"
              value={accommodation.capacity}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Google Map Link</label>
            <input
              type="url"
              name="googleMapLink"
              value={accommodation.googleMapLink}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Comment</label>
          <textarea
            name="comment"
            value={accommodation.comment}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows={4}
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isSubmitting ? 'Saving...' : 'Save Changes'}
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
