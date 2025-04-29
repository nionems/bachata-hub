"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { MapPin, Phone, Mail, Globe, DollarSign, Bed, Users } from "lucide-react"

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
  image: File | null
  imageUrl: string
  comment: string
  googleMapLink: string
}

export default function NewAccommodationPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
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
    image: null,
    imageUrl: '',
    comment: '',
    googleMapLink: ''
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target
    if (type === 'file') {
      const fileInput = e.target as HTMLInputElement
      const file = fileInput.files?.[0] || null
      setFormData(prev => ({ ...prev, image: file }))
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(file ? URL.createObjectURL(file) : null)
    } else {
      setFormData(prev => ({ ...prev, [name]: value }))
    }
  }

  useEffect(() => {
    return () => { if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl) }
  }, [imagePreviewUrl])

  const handleImageUpload = async (file: File): Promise<string> => {
    console.log("Accommodation Form: Starting image upload for", file.name)
    const uploadFormData = new FormData()
    uploadFormData.append('file', file)
    uploadFormData.append('folder', 'accommodations')
    let responseText = ''

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData,
      })

      console.log(`Accommodation Form: Received response status ${response.status}`)
      responseText = await response.text()
      console.log("Accommodation Form: Raw response text:", responseText)

      if (!response.ok) {
        let errorDetails = `HTTP error! status: ${response.status}`
        try {
          const errorData = JSON.parse(responseText)
          errorDetails = errorData?.error || errorData?.details || errorDetails
        } catch (parseError) { /* Ignore parsing error if response wasn't JSON */ }
        console.error("Accommodation Form: Upload request failed:", errorDetails)
        throw new Error(errorDetails)
      }

      let data
      try {
        data = JSON.parse(responseText)
        console.log("Accommodation Form: Parsed response JSON:", data)
      } catch (parseError) {
        console.error("Accommodation Form: Failed to parse successful response as JSON.", parseError)
        throw new Error(`Invalid JSON received from upload server: ${responseText}`)
      }

      if (!data || typeof data.imageUrl !== 'string' || data.imageUrl === '') {
        console.error("Accommodation Form: Invalid response structure from /api/upload. 'imageUrl' missing, not a string, or empty:", data)
        throw new Error('Invalid response structure from upload server')
      }

      console.log("Accommodation Form: Successfully got imageUrl:", data.imageUrl)
      return data.imageUrl

    } catch (uploadError) {
      console.error("Accommodation Form: Error during upload fetch/processing:", uploadError)
      throw uploadError instanceof Error ? uploadError : new Error(String(uploadError))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsLoading(true)
    console.log("Accommodation Form: Starting handleSubmit")

    let uploadedImageUrl = ''
    if (formData.image) {
      console.log("Accommodation Form: Image selected, attempting upload...")
      try {
        uploadedImageUrl = await handleImageUpload(formData.image)
        console.log("Accommodation Form: Image upload successful, URL:", uploadedImageUrl)
      } catch (uploadError: any) {
        console.error("Accommodation Form: Image upload failed during submit:", uploadError)
        setError(`Image upload failed: ${uploadError.message || 'Unknown error'}`)
        setIsLoading(false)
        return
      }
    } else {
      console.log("Accommodation Form: No image selected for upload.")
      setError('Please upload an image')
      setIsLoading(false)
      return
    }

    const accommodationData = {
      name: formData.name,
      location: formData.location,
      state: formData.state,
      address: formData.address,
      contactInfo: formData.contactInfo,
      email: formData.email,
      website: formData.website,
      price: formData.price,
      rooms: formData.rooms,
      capacity: formData.capacity,
      imageUrl: uploadedImageUrl,
      comment: formData.comment,
      googleMapLink: formData.googleMapLink,
    }

    console.log("Accommodation Form: Submitting data to /api/accommodations:", accommodationData)

    try {
      const response = await fetch('/api/accommodations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(accommodationData),
      })

      console.log(`Accommodation Form: Received response status ${response.status} from /api/accommodations`)
      const responseData = await response.json()

      if (!response.ok) {
        console.error("Accommodation Form: Error submitting accommodation data:", responseData)
        throw new Error(responseData.error || responseData.details || `HTTP error! status: ${response.status}`)
      }

      console.log("Accommodation Form: Accommodation added successfully!")
      router.push('/admin/accommodations')
      router.refresh()

    } catch (submitError: any) {
      console.error("Accommodation Form: Error during accommodation submission:", submitError)
      setError(`Failed to add accommodation: ${submitError.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Add New Accommodation</CardTitle>
            <CardDescription>Fill in the details for the new accommodation</CardDescription>
          </CardHeader>
          <CardContent>
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter accommodation name"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="location">Location</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="location"
                        name="location"
                        value={formData.location}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder="Enter location"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="state">State</Label>
                    <Input
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      required
                      placeholder="Enter state"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Enter full address"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactInfo">Contact Info</Label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="contactInfo"
                        name="contactInfo"
                        value={formData.contactInfo}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder="Enter contact number"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder="Enter email address"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                    <Input
                      id="website"
                      name="website"
                      value={formData.website}
                      onChange={handleChange}
                      className="pl-10"
                      placeholder="Enter website URL"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="price">Price</Label>
                    <div className="relative">
                      <DollarSign className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder="Enter price"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="rooms">Number of Rooms</Label>
                    <div className="relative">
                      <Bed className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="rooms"
                        name="rooms"
                        value={formData.rooms}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder="Enter number of rooms"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="capacity">Capacity</Label>
                    <div className="relative">
                      <Users className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                      <Input
                        id="capacity"
                        name="capacity"
                        value={formData.capacity}
                        onChange={handleChange}
                        required
                        className="pl-10"
                        placeholder="Enter capacity"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="image">Image</Label>
                  <div className="space-y-2">
                    <div>
                      <Label className="block text-sm text-gray-500 mb-1">Upload Image File</Label>
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        name="image"
                        className="block w-full"
                      />
                    </div>
                    {imagePreviewUrl && (
                      <div className="mt-4 p-4 border rounded-lg">
                        <p className="text-sm text-gray-500 mb-2">Preview:</p>
                        <div className="relative aspect-video w-full max-w-md">
                          <img
                            src={imagePreviewUrl}
                            alt="Preview"
                            className="w-full h-full object-contain rounded-lg"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="comment">Description</Label>
                  <Textarea
                    id="comment"
                    name="comment"
                    value={formData.comment}
                    onChange={handleChange}
                    required
                    placeholder="Enter accommodation description"
                    rows={4}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="googleMapLink">Google Maps Link</Label>
                  <Input
                    id="googleMapLink"
                    name="googleMapLink"
                    value={formData.googleMapLink}
                    onChange={handleChange}
                    placeholder="Enter Google Maps link"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || !formData.image}
                >
                  {isLoading ? 'Creating...' : 'Create Accommodation'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 