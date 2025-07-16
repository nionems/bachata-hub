'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { DANCE_STYLES, AUSTRALIAN_STATES } from '@/lib/constants'

interface ShopFormData {
  name: string
  location: string
  state: string
  address: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  instagramUrl: string
  facebookUrl: string
  price: string
  condition: string
  comment: string
  discountCode: string
  imageUrl: string
  googleMapLink: string
  info: string
  danceStyles: string[]
  status: 'pending' | 'approved' | 'rejected'
  image: File | null
}

export default function NewShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    website: '',
    instagramUrl: '',
    facebookUrl: '',
    price: '',
    condition: '',
    comment: '',
    discountCode: '',
    imageUrl: '',
    googleMapLink: '',
    info: '',
    danceStyles: [],
    status: 'pending',
    image: null
  })

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.replace('/admin/login')
        }
      } catch (err) {
        router.replace('/admin/login')
      }
    }
    checkAuth()
  }, [router])

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  // Handle dance style checkbox changes
  const handleDanceStyleChange = (danceStyle: string) => {
    if (danceStyle === 'All') {
      setFormData(prev => ({
        ...prev,
        danceStyles: prev.danceStyles.includes('All') ? [] : [...DANCE_STYLES]
      }))
    } else {
      setFormData(prev => {
        let newStyles = prev.danceStyles.includes(danceStyle)
          ? prev.danceStyles.filter(style => style !== danceStyle && style !== 'All')
          : [...prev.danceStyles.filter(style => style !== 'All'), danceStyle]
        // If all styles except 'All' are selected, add 'All' too
        if (newStyles.length === DANCE_STYLES.length - 1) {
          newStyles = [...DANCE_STYLES]
        }
        return {
          ...prev,
          danceStyles: newStyles
        }
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      let imageUrl = formData.imageUrl
      if (selectedFile) {
        // Upload image first
        const imageFormData = new FormData()
        imageFormData.append('file', selectedFile)
        
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: imageFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const uploadData = await uploadResponse.json()
        imageUrl = uploadData.imageUrl
      }

      let danceStylesToSave = formData.danceStyles.includes('All')
        ? DANCE_STYLES.filter(style => style !== 'All')
        : formData.danceStyles

      const shopData = {
        name: formData.name,
        location: formData.location,
        state: formData.state,
        address: formData.address,
        contactName: formData.contactName,
        contactEmail: formData.contactEmail,
        contactPhone: formData.contactPhone,
        website: formData.website,
        instagramUrl: formData.instagramUrl,
        facebookUrl: formData.facebookUrl,
        price: formData.price,
        condition: formData.condition,
        comment: formData.comment,
        discountCode: formData.discountCode,
        imageUrl: imageUrl,
        googleMapLink: formData.googleMapLink,
        info: formData.info,
        danceStyles: danceStylesToSave,
        status: formData.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      const response = await fetch('/api/shops', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData),
      })

      if (!response.ok) {
        if (response.status === 401) {
          router.replace('/admin/login')
          return
        }
        throw new Error('Failed to create shop')
      }

      toast.success('Shop created successfully')
      router.push('/admin/dashboard')
    } catch (err) {
      console.error('Error creating shop:', err)
      setError('Failed to create shop')
      toast.error('Failed to create shop')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Create New Shop</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Shop Name</Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter shop name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                placeholder="Enter shop location"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <select
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select a state</option>
                <option value="ALL">All states</option>
                {AUSTRALIAN_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactName">Contact Name</Label>
              <Input
                id="contactName"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                required
                placeholder="Enter contact name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                name="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={handleChange}
                placeholder="Enter contact email"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                name="contactPhone"
                type="tel"
                value={formData.contactPhone}
                onChange={handleChange}
                placeholder="Enter contact phone"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="website">Website</Label>
              <Input
                id="website"
                name="website"
                type="url"
                value={formData.website}
                onChange={handleChange}
                placeholder="Enter website URL"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instagramUrl">Instagram Link</Label>
              <Input
                id="instagramUrl"
                name="instagramUrl"
                value={formData.instagramUrl}
                onChange={handleChange}
                placeholder="Enter Instagram Link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facebookUrl">Facebook Link</Label>
              <Input
                id="facebookUrl"
                name="facebookUrl"
                value={formData.facebookUrl}
                onChange={handleChange}
                placeholder="Enter Facebook Link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price Range</Label>
              <Input
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="Enter price range (e.g., $10-50, Free, etc.)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="condition">Condition</Label>
              <select
                id="condition"
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-white"
              >
                <option value="">Select condition</option>
                <option value="New">New</option>
                <option value="Second Hand">Second Hand</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discountCode">Discount Code</Label>
              <Input
                id="discountCode"
                name="discountCode"
                value={formData.discountCode}
                onChange={handleChange}
                placeholder="Enter discount code"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleMapLink">Google Map Link</Label>
              <Input
                id="googleMapLink"
                name="googleMapLink"
                value={formData.googleMapLink}
                onChange={handleChange}
                placeholder="Enter Google Map Link"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="info">Additional Info</Label>
              <Textarea
                id="info"
                name="info"
                value={formData.info}
                onChange={handleChange}
                placeholder="Any additional information about the shop"
                rows={3}
              />
            </div>

            {/* Dance Styles */}
            <div className="space-y-2">
              <Label>Dance Styles</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {DANCE_STYLES.map((style) => (
                  <label key={style} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.danceStyles.includes(style)}
                      onChange={() => handleDanceStyleChange(style)}
                      className="rounded border-gray-300 text-primary focus:ring-primary"
                    />
                    <span className="text-sm text-gray-700">{style}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded bg-white"
              >
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="image">Shop Image</Label>
              {imagePreview && (
                <div className="mt-2">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg"
                  />
                </div>
              )}
              <Input
                id="image"
                name="image"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                required
                className="cursor-pointer"
              />
              <p className="text-sm text-gray-500">
                Upload a high-quality image of your shop (max 5MB)
              </p>
            </div>

            {error && (
              <div className="text-red-500 text-sm">{error}</div>
            )}

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/admin/dashboard')}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? 'Creating...' : 'Create Shop'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
} 