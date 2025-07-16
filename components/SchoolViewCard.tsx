'use client'

import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp, X, Instagram, Facebook, Globe } from "lucide-react"
import { useState } from "react"
import { School } from "@/types/school"

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
      <Card className="relative overflow-hidden group cursor-pointer h-[300px]">
        <div 
          className="relative h-full cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={school.imageUrl}
            alt={school.name}
            className="object-cover w-full h-full transition-transform hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Dance Style Stickers */}
          {school.danceStyles && school.danceStyles.length > 0 && (
            <div className="absolute top-2 left-2 z-20 flex flex-wrap gap-1 max-w-[calc(100%-4rem)]">
              {school.danceStyles.slice(0, 3).map((style, index) => (
                <div 
                  key={index}
                  className="bg-black/60 backdrop-blur-md border border-white/30 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg"
                >
                  {style}
                </div>
              ))}
              {school.danceStyles.length > 3 && (
                <div className="bg-black/60 backdrop-blur-md border border-white/30 text-white text-xs font-medium px-2 py-1 rounded-full shadow-lg">
                  +{school.danceStyles.length - 3}
                </div>
              )}
            </div>
          )}
          
          {/* School Name Sticker - Top Center */}
          <div className="absolute top-3 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 shadow-2xl max-w-[calc(100%-0.5rem)] hover:shadow-primary/25 transition-all duration-300 rounded-full">
            <span className="truncate block drop-shadow-sm">{school.name}</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <div className="flex items-center gap-2 text-[10px] text-gray-200 mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{school.location}, {school.state}</span>
          </div>
          {school.comment && (
            <div className="mt-1 relative">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-1' : 'max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent border-r border-white/10'}`}>
                {school.comment}
              </div>
              {isCommentExpanded && school.comment.length > 200 && (
                <div className="absolute bottom-0 right-0 w-4 h-4 bg-gradient-to-l from-black/40 to-transparent pointer-events-none"></div>
              )}
              {school.comment.length > 50 && (
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
          <div className="flex gap-2 mt-2">
            {school.instagramUrl && (
              <a
                href={school.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Instagram"
              >
                <Instagram className="h-4 w-4" />
              </a>
            )}
            {school.facebookUrl && (
              <a
                href={school.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Facebook"
              >
                <Facebook className="h-4 w-4" />
              </a>
            )}
            {school.website && (
              <a
                href={school.website}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                title="Website"
              >
                <Globe className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>

        {/* Darker overlay when comment is expanded */}
        {isCommentExpanded && school.comment && (
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