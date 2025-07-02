'use client'

import { Card } from "@/components/ui/card"
import { MapPin, ChevronDown, ChevronUp, X, Instagram, Facebook } from "lucide-react"
import { useState } from "react"
import { Instructor } from "@/types/instructor"

interface InstructorCardProps {
  instructor: Instructor
}

export function InstructorCard({ instructor }: InstructorCardProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (instructor.imageUrl) {
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
            src={instructor.imageUrl}
            alt={instructor.name}
            className="object-cover object-top w-full h-full transition-transform duration-300 hover:scale-110"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Instructor Name Sticker - Top on mobile, Bottom on desktop */}
          <div className="absolute top-1 sm:top-auto sm:bottom-3 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-primary/60 via-primary/50 to-primary/60 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-4 py-1.5 shadow-2xl max-w-[calc(100%-0.5rem)] hover:shadow-primary/25 transition-all duration-300 rounded-full">
            <span className="truncate block drop-shadow-sm">{instructor.name}</span>
          </div>

          {instructor.privatePricePerHour && (
            <div className="absolute top-12 right-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-800 px-3 py-1 rounded-lg text-base font-bold shadow-xl transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 z-10 border-2 border-yellow-200 opacity-85 hover:opacity-100">
              <div className="flex items-center gap-1 relative">
                <span className="drop-shadow-sm">{instructor.privatePricePerHour}</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-lg opacity-50"></div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <div className="flex items-center gap-2 text-[10px] text-gray-200 mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{instructor.location}, {instructor.state}</span>
            <div className="bg-black/60 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
              <span className="text-[8px] text-white/90">
                DM for private
              </span>
            </div>
          </div>
          {instructor.comment && (
            <div className="mt-1 relative">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-1' : 'max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent border-r border-white/10'}`}>
                {instructor.comment}
              </div>
              {instructor.comment.length > 50 && (
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
          <div className="flex items-center justify-between gap-4 mt-3 sm:mt-2">
            <div className="flex gap-2">
              {instructor.instagramLink && (
                <a
                  href={instructor.instagramLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                  title="Instagram"
                >
                  <Instagram className="h-4 w-4" />
                </a>
              )}
              {instructor.facebookLink && (
                <a
                  href={instructor.facebookLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="p-1.5 bg-primary/20 hover:bg-primary/30 text-primary rounded-full transition-colors duration-200"
                  title="Facebook"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              )}
            </div>
            <div className="flex flex-wrap gap-1">
              {instructor.danceStyles.map((style) => (
                <span
                  key={style}
                  className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-[8px] sm:text-xs sm:px-2 sm:py-1"
                >
                  {style}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Darker overlay when comment is expanded */}
        {isCommentExpanded && instructor.comment && (
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
            src={instructor.imageUrl}
            alt={instructor.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 