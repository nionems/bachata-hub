'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { School } from '@/types/school'
import { StateSelect } from '@/components/ui/StateSelect'
import { toast } from 'sonner'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { DANCE_STYLES } from '@/lib/constants'

interface SchoolFormData {
  name: string;
  location: string;
  state: string;
  address: string;
  website?: string;
  googleReviewLink?: string;
  contactInfo: string;
  danceStyles: string[];
  googleRating?: number;
  googleReviewsCount?: number;
  googleReviewsUrl?: string;
  image: File | null;
  imageUrl?: string;
  instagramUrl: string;
  facebookUrl: string;
  googleMapLink: string;
  comment: string;
}

// List of Australian states and territories
const AUSTRALIAN_STATES = [
  { value: 'NSW', label: 'New South Wales' },
  { value: 'VIC', label: 'Victoria' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA', label: 'Western Australia' },
  { value: 'SA', label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'Australian Capital Territory' },
  { value: 'NT', label: 'Northern Territory' }
];

export default function EditSchoolPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null)
  const [formData, setFormData] = useState<SchoolFormData>({
    name: '',
    location: '',
    state: '',
    address: '',
    website: '',
    googleReviewLink: '',
    contactInfo: '',
    danceStyles: [],
    googleRating: 0,
    googleReviewsCount: 0,
    googleReviewsUrl: '',
    image: null,
    imageUrl: '',
    instagramUrl: '',
    facebookUrl: '',
    googleMapLink: '',
    comment: ''
  })
  const [school, setSchool] = useState<School | null>(null)

  const fetchSchool = useCallback(async () => {
    try {
      const response = await fetch(`/api/schools/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch school')
      const data = await response.json()
      setSchool(data)
      
      // Normalize danceStyles to array
      let danceStylesArr: string[] = []
      if (Array.isArray(data.danceStyles)) {
        danceStylesArr = data.danceStyles
      } else if (typeof data.danceStyles === 'string') {
        danceStylesArr = data.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)
      }
      
      setFormData({
        ...data,
        danceStyles: danceStylesArr,
        instagramUrl: data.socialUrl || '',
        facebookUrl: data.socialUrl2 || ''
      })
    } catch (error) {
      console.error('Error fetching school:', error)
      setError('Failed to fetch school')
    } finally {
      setIsLoading(false)
    }
  }, [params.id])

  useEffect(() => {
    fetchSchool()
  }, [fetchSchool])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFormData({ ...formData, image: file })
      if (imagePreviewUrl) URL.revokeObjectURL(imagePreviewUrl)
      setImagePreviewUrl(URL.createObjectURL(file))
    }
  }

  useEffect(() => {
    return () => {
      if (imagePreviewUrl && !formData.imageUrl?.includes(imagePreviewUrl)) {
        URL.revokeObjectURL(imagePreviewUrl)
      }
    }
  }, [imagePreviewUrl, formData.imageUrl])

  // Handle dance style checkbox changes
  const handleDanceStyleChange = (danceStyle: string) => {
    setFormData(prev => ({
      ...prev,
      danceStyles: prev.danceStyles.includes(danceStyle)
        ? prev.danceStyles.filter(style => style !== danceStyle)
        : [...prev.danceStyles, danceStyle]
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!school) return

    try {
      let finalImageUrl = formData.imageUrl
      if (formData.image) {
        toast.loading('Uploading image...')
        const uploadFormData = new FormData()
        uploadFormData.append('file', formData.image)
        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })
        if (!uploadResponse.ok) throw new Error('Failed to upload image')
        const uploadData = await uploadResponse.json()
        finalImageUrl = uploadData.imageUrl
        toast.dismiss()
        toast.success('Image uploaded successfully')
      }

      toast.loading('Updating school...')
      const updatedSchool = {
        name: formData.name,
        location: formData.location,
        state: formData.state,
        address: formData.address,
        website: formData.website,
        googleReviewLink: formData.googleReviewLink,
        contactInfo: formData.contactInfo,
        danceStyles: formData.danceStyles,
        googleRating: formData.googleRating,
        googleReviewsCount: formData.googleReviewsCount,
        googleReviewsUrl: formData.googleReviewsUrl,
        imageUrl: finalImageUrl,
        socialUrl: formData.instagramUrl,
        socialUrl2: formData.facebookUrl,
        googleMapLink: formData.googleMapLink,
        comment: formData.comment
      }

      const response = await fetch(`/api/schools/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedSchool),
      })

      if (!response.ok) throw new Error('Failed to update school')
      toast.dismiss()
      toast.success('School updated successfully')
      router.push('/admin/dashboard')
    } catch (err) {
      toast.dismiss()
      toast.error(err instanceof Error ? err.message : 'Failed to update school')
      setError(err instanceof Error ? err.message : 'Failed to update school')
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!school) return <div className="p-4">School not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Edit School</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl space-y-6">
        <div className="space-y-2">
          <Label htmlFor="name">School Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location *</Label>
          <Input
            id="location"
            value={formData.location}
            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="state">State *</Label>
          <StateSelect
            value={formData.state}
            onChange={(value) => setFormData({ ...formData, state: value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="address">Address *</Label>
          <Input
            id="address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="contactInfo">Contact Information *</Label>
          <Input
            id="contactInfo"
            value={formData.contactInfo}
            onChange={(e) => setFormData({ ...formData, contactInfo: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website</Label>
          <Input
            id="website"
            type="url"
            value={formData.website || ''}
            onChange={(e) => setFormData({ ...formData, website: e.target.value })}
            placeholder="https://"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="danceStyles">Dance Styles *</Label>
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
          {formData.danceStyles.length === 0 && (
            <p className="text-red-500 text-sm mt-1">Please select at least one dance style</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleReviewLink">Google Review Link</Label>
          <Input
            id="googleReviewLink"
            type="url"
            value={formData.googleReviewLink || ''}
            onChange={(e) => setFormData({ ...formData, googleReviewLink: e.target.value })}
            placeholder="https://"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleRating">Google Rating</Label>
          <Input
            id="googleRating"
            type="number"
            min="0"
            max="5"
            step="0.1"
            value={formData.googleRating || ''}
            onChange={(e) => setFormData({ ...formData, googleRating: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleReviewsCount">Google Reviews Count</Label>
          <Input
            id="googleReviewsCount"
            type="number"
            min="0"
            value={formData.googleReviewsCount || ''}
            onChange={(e) => setFormData({ ...formData, googleReviewsCount: Number(e.target.value) })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleReviewsUrl">Google Reviews URL</Label>
          <Input
            id="googleReviewsUrl"
            type="url"
            value={formData.googleReviewsUrl || ''}
            onChange={(e) => setFormData({ ...formData, googleReviewsUrl: e.target.value })}
            placeholder="https://"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="instagramUrl">Instagram URL</Label>
          <Input
            id="instagramUrl"
            type="url"
            value={formData.instagramUrl || ''}
            onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
            placeholder="https://instagram.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="facebookUrl">Facebook URL</Label>
          <Input
            id="facebookUrl"
            type="url"
            value={formData.facebookUrl || ''}
            onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
            placeholder="https://facebook.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="googleMapLink">Google Maps Link</Label>
          <Input
            id="googleMapLink"
            type="url"
            value={formData.googleMapLink || ''}
            onChange={(e) => setFormData({ ...formData, googleMapLink: e.target.value })}
            placeholder="https://maps.google.com/..."
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="comment">Description *</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">School Image</Label>
          <div className="mt-1 space-y-2">
            <div>
              <Label className="text-sm text-gray-500 mb-1">Upload Image File</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="block w-full"
              />
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center" aria-hidden="true">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center">
                <span className="bg-white px-2 text-sm text-gray-500 mb-1">OR</span>
              </div>
            </div>
            <div>
              <Label className="text-sm text-gray-500 mb-1">Image URL</Label>
              <Input
                type="url"
                value={formData.imageUrl || ''}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://example.com/image.jpg"
              />
            </div>
          </div>
        </div>

        {imagePreviewUrl && (
          <div className="mt-4">
            <p className="text-sm font-medium text-gray-700 mb-1">Image Preview:</p>
            <img src={imagePreviewUrl} alt="Preview" className="max-w-xs max-h-48 object-contain border rounded shadow-sm" />
          </div>
        )}

        <div className="flex gap-4">
          <Button type="submit">Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/dashboard')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 