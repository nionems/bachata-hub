'use client'

import { useEffect, useState } from 'react'
import MediaForm from '@/components/MediaForm'
import { Media } from '@/types/media'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useParams } from 'next/navigation'

export default function EditMediaPage() {
  const params = useParams()
  const [media, setMedia] = useState<Media | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchMedia = async () => {
      try {
        const mediaDoc = await getDoc(doc(db, 'medias', params.id as string))
        if (mediaDoc.exists()) {
          setMedia({
            id: mediaDoc.id,
            ...mediaDoc.data(),
            createdAt: mediaDoc.data().createdAt?.toDate(),
            updatedAt: mediaDoc.data().updatedAt?.toDate(),
          } as Media)
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
 
 
 