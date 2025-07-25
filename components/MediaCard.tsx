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
  onApprove?: (id: string) => void
  onReject?: (id: string) => void
  isAdmin?: boolean
}

export function MediaCard({ media, layout = 'grid', onDelete, onApprove, onReject, isAdmin = false }: MediaCardProps) {
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
        layout === 'grid' ? 'h-[300px]' : 'h-auto'
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
            className="object-cover object-top w-full h-full transition-transform hover:scale-105"
            style={{ objectPosition: 'center 20%' }}
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Media Name Sticker - Top on mobile, Bottom on desktop */}
          <div className="absolute top-1 sm:top-auto sm:bottom-3 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border border-white/30 text-white text-xs sm:text-base font-bold px-3 py-1 shadow-2xl max-w-[calc(100%-0.5rem)] hover:shadow-primary/25 transition-all duration-300 rounded-full">
            <span className="truncate block drop-shadow-sm">{media.name}</span>
          </div>
          
          {/* DM for booking badge - Desktop only (top right) */}
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-2 py-1 rounded-full z-10 hidden sm:block">
            <span className="text-xs text-white/90 font-medium">
              DM for booking
            </span>
          </div>
        </div>

        <div className={`${
          layout === 'grid' 
            ? 'absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4'
            : 'p-4'
        }`}>
          <div className="flex items-center gap-1 sm:gap-2 text-[10px] text-gray-200 mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{media.location}</span>
            <div className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full sm:hidden">
              <span className="text-[8px] text-white/90">
                DM for booking
              </span>
            </div>
          </div>
          
          {/* Status badge for admin */}
          {isAdmin && media.status && (
            <div className="mt-2">
              <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                media.status === 'approved' 
                  ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                  : media.status === 'rejected'
                  ? 'bg-red-500/20 text-red-300 border border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30'
              }`}>
                {media.status.charAt(0).toUpperCase() + media.status.slice(1)}
              </span>
            </div>
          )}
          {media.comment && (
            <div className="mt-1 relative">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-1' : 'max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent border-r border-white/10'}`}>
                {media.comment}
              </div>
              {media.comment.length > 50 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsCommentExpanded(!isCommentExpanded);
                  }}
                  className="text-primary hover:text-primary/80 text-xs mt-1 flex items-center gap-1 transition-colors duration-200"
                >
                  {isCommentExpanded ? (
                    <>
                      Show Less <ChevronUp className="h-3 w-3" />
                    </>
                  ) : (
                    <>
                      Show More <ChevronDown className="h-3 w-3" />
                    </>
                  )}
                </button>
              )}
            </div>
          )}
          <div className="flex gap-2 mt-3 sm:mt-2">
            {media.mediaLink && (
              <a
                href={media.mediaLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Media"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
            {media.instagramLink && (
              <a
                href={media.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {media.facebookLink && (
              <a
                href={media.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {media.emailLink && isAdmin && (
              <a
                href={`mailto:${media.emailLink}`}
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Email"
              >
                <Mail className="h-4 w-4" />
              </a>
            )}
          </div>

          {isAdmin && (
            <div className="flex gap-2 mt-4 flex-wrap">
              {media.status === 'pending' && (
                <>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onApprove?.(media.id);
                    }}
                    className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
                  >
                    Approve
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onReject?.(media.id);
                    }}
                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
                  >
                    Reject
                  </button>
                </>
              )}
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

        {/* Darker overlay when comment is expanded */}
        {isCommentExpanded && media.comment && layout === 'grid' && (
          <div className="absolute inset-0 bg-black/60 z-15" />
        )}
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
 
 
 