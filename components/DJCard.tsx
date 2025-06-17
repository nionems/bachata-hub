'use client'

import { Card } from "@/components/ui/card"
import { MapPin, ExternalLink, Instagram, Facebook, Music, ChevronDown, ChevronUp, X } from "lucide-react"
import { useState } from "react"
import { Dj } from "@/types/dj"

interface DJCardProps {
  dj: Dj
}

export function DJCard({ dj }: DJCardProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (dj.imageUrl) {
      setIsImageModalOpen(true);
    }
  }

  // Convert musicStyles to array if it's a string
  const musicStyles = typeof dj.musicStyles === 'string' 
    ? [dj.musicStyles] 
    : Array.isArray(dj.musicStyles) 
      ? dj.musicStyles 
      : []

  return (
    <>
      <Card className="relative overflow-hidden group cursor-pointer h-[400px]">
        <div 
          className="relative h-full cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={dj.imageUrl}
            alt={dj.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
            <span className="text-sm text-white/90 font-medium">DM for booking</span>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-bold text-white line-clamp-1">{dj.name}</h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {dj.location}, {dj.state}
          </div>
          {dj.comment && (
            <div className="mt-1">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-2' : ''}`}>
                {dj.comment}
              </div>
              {dj.comment.length > 100 && (
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
          {musicStyles.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-2 sm:mt-3">
              {musicStyles.map((style) => (
                <span
                  key={style}
                  className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs"
                >
                  {style}
                </span>
              ))}
            </div>
          )}
          <div className="flex gap-4 mt-3 sm:mt-2">
            {dj.instagramLink && (
              <a
                href={dj.instagramLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <Instagram className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
            {dj.facebookLink && (
              <a
                href={dj.facebookLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <Facebook className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
            {dj.musicLink && (
              <a
                href={dj.musicLink}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="text-white hover:text-primary transition-colors p-1"
              >
                <Music className="h-6 w-6 sm:h-5 sm:w-5" />
              </a>
            )}
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
            src={dj.imageUrl}
            alt={dj.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 