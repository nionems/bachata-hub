'use client'

import { useState } from 'react'

interface AccommodationFormData {
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
}

export default function CreateAccommodation() {
  const [formData, setFormData] = useState<AccommodationFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    contactInfo: '',
    email: '',
    website: '',
    price: '',
    rooms: '',
    capacity: '',
    imageUrl: '',
    comment: '',
    googleMapLink: '',
    festival: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Add your form submission logic here
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Create New Accommodation</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
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
              value={formData.festival}
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
              value={formData.location}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          {/* ... rest of the existing form fields ... */}
        </div>
      </form>
    </div>
  )
} 