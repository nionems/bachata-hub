'use client'

import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp, X, Instagram, Facebook, Globe } from "lucide-react"
import { useState } from "react"
import { School } from "@/types/school"
import { ImageModal } from "@/components/ImageModal"

interface SchoolViewCardProps {
  school: School
}

export function SchoolViewCard({ school }: SchoolViewCardProps) {
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
      <Card className="relative overflow-hidden group cursor-pointer h-[400px]">
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
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{school.name}</h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {school.location}, {school.state}
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
              {school.instagramLink && (
                <a
                  href={school.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-white hover:text-primary transition-colors p-1"
                >
                  <Instagram className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
              {school.facebookLink && (
                <a
                  href={school.facebookLink}
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
                  <Globe className="h-6 w-6 sm:h-5 sm:w-5" />
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {school.danceStyles.map((style) => (
                <span
                  key={style}
                  className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Card>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        imageUrl={school.imageUrl}
        title={school.name}
      />
    </>
  )
} 