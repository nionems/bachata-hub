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
  socialUrl1: string;
  socialUrl2: string;
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
    socialUrl1: '',
    socialUrl2: '',
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
      setFormData({
        ...data,
        socialUrl1: data.socialUrl || '',
        socialUrl2: data.socialUrl2 || ''
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
        socialUrl: formData.socialUrl1,
        socialUrl2: formData.socialUrl2,
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
          <Label htmlFor="name">School Name</Label>
          <Input
            id="name"
            value={school.name}
            onChange={(e) => setSchool({ ...school, name: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="location">Location</Label>
          <Input
            id="location"
            value={school.location}
            onChange={(e) => setSchool({ ...school, location: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={school.description}
            onChange={(e) => setSchool({ ...school, description: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="website">Website (optional)</Label>
          <Input
            id="website"
            type="url"
            value={school.website || ''}
            onChange={(e) => setSchool({ ...school, website: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="image">Image URL (optional)</Label>
          <Input
            id="image"
            type="url"
            value={school.image || ''}
            onChange={(e) => setSchool({ ...school, image: e.target.value })}
          />
        </div>

        <div className="flex gap-4">
          <Button type="submit">Save Changes</Button>
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin')}
          >
            Cancel
          </Button>
        </div>
      </form>
    </div>
  )
} 