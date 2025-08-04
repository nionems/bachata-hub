'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Media } from '@/types/media'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface MediaFormProps {
  media?: Media
  isEditing?: boolean
}

const AUSTRALIAN_STATES = [
  { code: 'NSW', name: 'New South Wales' },
  { code: 'VIC', name: 'Victoria' },
  { code: 'QLD', name: 'Queensland' },
  { code: 'WA', name: 'Western Australia' },
  { code: 'SA', name: 'South Australia' },
  { code: 'TAS', name: 'Tasmania' },
  { code: 'ACT', name: 'Australian Capital Territory' },
  { code: 'NT', name: 'Northern Territory' }
]

export default function MediaForm({ media, isEditing = false }: MediaFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>(media?.imageUrl || '')
  const [formData, setFormData] = useState({
    name: media?.name || '',
    location: media?.location || '',
    state: media?.state || '',
    comment: media?.comment || '',
    instagramLink: media?.instagramLink || '',
    facebookLink: media?.facebookLink || '',
    emailLink: media?.emailLink || '',
    mediaLink: media?.mediaLink || '',
    mediaLink2: media?.mediaLink2 || '',
  })

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setImageFile(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setImagePreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      let imageUrl = media?.imageUrl

      if (imageFile) {
        const uploadFormData = new FormData()
        uploadFormData.append('file', imageFile)
        uploadFormData.append('folder', 'media')

        const uploadResponse = await fetch('/api/upload', {
          method: 'POST',
          body: uploadFormData,
        })

        if (!uploadResponse.ok) {
          throw new Error('Failed to upload image')
        }

        const { imageUrl: uploadedImageUrl } = await uploadResponse.json()
        imageUrl = uploadedImageUrl
      }

      const mediaData = {
        ...formData,
        email: formData.emailLink, // Map emailLink to email for API
        imageUrl,
        updatedAt: new Date(),
      }

      if (isEditing && media) {
        const response = await fetch(`/api/media/${media.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(mediaData),
        })

        if (!response.ok) throw new Error('Failed to update media')
        toast.success('Media updated successfully')
      } else {
        const response = await fetch('/api/media', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...mediaData,
            createdAt: new Date(),
          }),
        })

        if (!response.ok) throw new Error('Failed to create media')
        toast.success('Media created successfully')
      }

      router.push('/admin/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Error saving media:', error)
      toast.error('Error saving media')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              required
            />
          </div>
          <div>
            <Label htmlFor="state">State</Label>
            <Select
              value={formData.state}
              onValueChange={(value) => setFormData({ ...formData, state: value })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a state" />
              </SelectTrigger>
              <SelectContent>
                {AUSTRALIAN_STATES.map((state) => (
                  <SelectItem key={state.code} value={state.code}>
                    {state.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>



        <div>
          <Label htmlFor="comment">Description</Label>
          <Textarea
            id="comment"
            value={formData.comment}
            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
            rows={4}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="instagramLink">Instagram Link</Label>
            <Input
              id="instagramLink"
              value={formData.instagramLink}
              onChange={(e) => setFormData({ ...formData, instagramLink: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="facebookLink">Facebook Link</Label>
            <Input
              id="facebookLink"
              value={formData.facebookLink}
              onChange={(e) => setFormData({ ...formData, facebookLink: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="emailLink">Email</Label>
            <Input
              id="emailLink"
              type="email"
              value={formData.emailLink}
              onChange={(e) => setFormData({ ...formData, emailLink: e.target.value })}
            />
          </div>
          <div>
            <Label htmlFor="mediaLink">Media Link</Label>
            <Input
              id="mediaLink"
              value={formData.mediaLink}
              onChange={(e) => setFormData({ ...formData, mediaLink: e.target.value })}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="mediaLink2">Media Link 2</Label>
          <Input
            id="mediaLink2"
            value={formData.mediaLink2}
            onChange={(e) => setFormData({ ...formData, mediaLink2: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="image">Image</Label>
          <Input
            id="image"
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            required={!isEditing}
          />
          {imagePreview && (
            <div className="mt-2">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-32 h-32 object-cover rounded-lg"
              />
            </div>
          )}
        </div>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? 'Saving...' : isEditing ? 'Update Media' : 'Create Media'}
      </Button>
    </form>
  )
} 
 
 
 