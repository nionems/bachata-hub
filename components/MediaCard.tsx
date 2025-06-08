'use client'

import { Card } from "@/components/ui/card"
import { MapPin, ExternalLink, Instagram, Facebook, Mail, ChevronDown, ChevronUp, X } from "lucide-react"
import { useState } from "react"
import { Media } from "@/types/media"
import { useRouter } from 'next/navigation'

interface MediaCardProps {
  media: Media
  layout?: 'grid' | 'list'
  onDelete?: (id: string) => void
  isAdmin?: boolean
}

export function MediaCard({ media, layout = 'grid', onDelete, isAdmin = false }: MediaCardProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const router = useRouter()

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (media.imageUrl) {
      setIsImageModalOpen(true);
    }
  }

  return (
    <>
      <Card className={`relative overflow-hidden group cursor-pointer ${
        layout === 'grid' ? 'h-[400px]' : 'h-auto'
      }`}>
        <div 
          className={`relative cursor-pointer ${
            layout === 'grid' ? 'h-full' : 'h-32'
          }`}
          onClick={handleImageClick}
        >
          <img
            src={media.imageUrl}
            alt={media.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
            <span className="text-sm text-white/90 font-medium">DM for booking</span>
          </div>
        </div>

        <div className={`${
          layout === 'grid' 
            ? 'absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4'
            : 'p-4'
        }`}>
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{media.name}</h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {media.location}, {media.state}
          </div>
          {media.comment && (
            <div className="mt-1">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-2' : ''}`}>
                {media.comment}
              </div>
              {media.comment.length > 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCommentExpanded(!isCommentExpanded);
                  }}
                  className="text-primary hover:text-primary/80 text-xs mt-1 flex items-center gap-1"
                >
                  {isCommentExpanded ? (
                    <>
                      Show Less <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Read More <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          <div className="flex gap-4 mt-3 sm:mt-2">
            {media.mediaLink && (
              <a
                href={media.mediaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <ExternalLink className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
            {media.instagramLink && (
              <a
                href={media.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <Instagram className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
            {media.facebookLink && (
              <a
                href={media.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <Facebook className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
            {media.emailLink && (
              <a
                href={`mailto:${media.emailLink}`}
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <Mail className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 mt-4">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/admin/media/${media.id}/edit`);
                }}
                className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
              >
                Edit
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete?.(media.id);
                }}
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </Card>

      {/* Image Modal */}
      {isImageModalOpen && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setIsImageModalOpen(false)}
        >
          <button
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            onClick={() => setIsImageModalOpen(false)}
          >
            <X className="h-8 w-8" />
          </button>
          <img
            src={media.imageUrl}
            alt={media.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 
 
 
 