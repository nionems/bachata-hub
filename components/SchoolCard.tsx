'use client'

import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp, X, Instagram, Facebook, ExternalLink } from "lucide-react"
import { useState } from "react"
import { School } from "@/types/school"

interface SchoolCardProps {
  school: School
}

export function SchoolCard({ school }: SchoolCardProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const handleImageClick = (e: React.MouseEvent) => {
          e.stopPropagation();
    if (school.imageUrl) {
      setIsImageModalOpen(true);
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden group cursor-pointer h-[300px] sm:h-[400px]">
        <div 
          className="relative h-full cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={school.imageUrl}
            alt={school.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Dance Style Stickers - Bottom Right for all screen sizes */}
          <div className="absolute bottom-2 right-2 z-30 flex flex-wrap gap-1 max-w-[calc(100%-1rem)]">
            {school.danceStyles.slice(0, 2).map((style) => (
              <div
                key={style}
                className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-[8px] sm:text-xs font-medium"
              >
                {style}
              </div>
            ))}
            {school.danceStyles.length > 2 && (
              <div className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-[8px] sm:text-xs font-medium">
                +{school.danceStyles.length - 2}
              </div>
            )}
          </div>

          {/* School Name Sticker - Top on mobile, Bottom on desktop */}
          <div className="absolute top-0.5 sm:top-auto sm:bottom-4 left-1/2 transform -translate-x-1/2 z-30 bg-gradient-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border border-white/30 text-white text-xs sm:text-base font-bold px-3 py-1 shadow-2xl max-w-[calc(100%-0.5rem)] hover:shadow-primary/25 transition-all duration-300 rounded-full">
            <span className="truncate block drop-shadow-sm">{school.name}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <div className="flex items-center gap-1 sm:gap-2 text-xs sm:text-sm text-gray-200">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {school.location}
          </div>
          {school.comment && (
            <div className="mt-1">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-2' : ''}`}>
                {school.comment}
              </div>
              {school.comment.length > 100 && (
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
          <div className="flex items-center justify-between gap-4 mt-3 sm:mt-2">
            <div className="flex gap-4">
              {school.instagramUrl && (
                <a
                  href={school.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <Instagram className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
              {school.facebookUrl && (
                <a
                  href={school.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <Facebook className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
              {school.website && (
                <a
                  href={school.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <ExternalLink className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
            </div>
          </div>
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
            src={school.imageUrl}
            alt={school.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 