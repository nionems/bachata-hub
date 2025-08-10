'use client'

import { useEffect, useState } from 'react'
import MediaForm from '@/components/MediaForm'
import { Media } from '@/types/media'
import { useParams } from 'next/navigation'

export default function EditMediaPage() {
  const params = useParams()
  const [media, setMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const response = await fetch(`/api/media/${params.id}`)
        if (response.ok) {
          const mediaData = await response.json()
          setMedia(mediaData as Media)
        } else {
          console.error('Failed to fetch media')
        }
      } catch (error) {
        console.error('Error fetching media:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchMedia()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!media) {
    return <div>Media not found</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl font-bold mb-6">Edit Media</h1>
        <MediaForm media={media} isEditing />
      </div>
    </div>
  )
} 
 
 
 