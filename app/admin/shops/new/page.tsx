'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface ShopFormData {
  name: string
  description: string
  location: string
  imageUrl: string
  website: string
  phone: string
  email: string
  state: string
  address: string
  comment: string
  googleReviewLink: string
  image: File | null
  websiteLink: string
  discountCode: string
}

export default function NewShopPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [formData, setFormData] = useState<ShopFormData>({
    name: '',
    description: '',
    location: '',
    imageUrl: '',
    website: '',
    phone: '',
    email: '',
    state: '',
    address: '',
    comment: '',
    googleReviewLink: '',
    image: null,
    websiteLink: '',
    discountCode: ''
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      const shopData = {
        name: formData.name,
        location: formData.location,
        state: formData.state,
        address: formData.address,
        comment: formData.comment,
        googleReviewLink: formData.googleReviewLink,
        imageUrl: imageUrl,
        website: formData.website,
        contactInfo: `${formData.phone}${formData.email ? `, ${formData.email}` : ''}`,
        websiteLink: formData.websiteLink,
        discountCode: formData.discountCode,
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
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                placeholder="Enter shop description"
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
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email address"
              />
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
              <Label htmlFor="comment">Comment</Label>
              <Textarea
                id="comment"
                name="comment"
                value={formData.comment}
                onChange={handleChange}
                required
                placeholder="Enter comment"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="googleReviewLink">Google Review Link</Label>
              <Input
                id="googleReviewLink"
                name="googleReviewLink"
                value={formData.googleReviewLink}
                onChange={handleChange}
                placeholder="Enter Google Review Link"
              />
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