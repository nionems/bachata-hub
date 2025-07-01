'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Trophy, Music, X, ChevronDown, ChevronUp } from "lucide-react"
import { Competition } from "@/types/competition"
import Image from "next/image"

interface CompetitionCardProps {
  competition: Competition
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (competition.imageUrl) {
      setIsImageModalOpen(true)
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden group cursor-pointer h-[300px]">
        <div 
          className="relative h-full cursor-pointer"
          onClick={handleImageClick}
        >
          <Image
            src={competition.imageUrl || '/images/placeholder.svg'}
            alt={competition.name}
            fill
            className="object-cover transition-transform hover:scale-102"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
          
          {/* Competition Name Sticker - Top Center */}
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 z-20 bg-gradient-to-r from-primary/40 via-primary/30 to-primary/40 backdrop-blur-md border border-white/30 text-white text-sm font-bold px-2 py-0.5 shadow-2xl max-w-[calc(100%-0.5rem)] hover:shadow-primary/25 transition-all duration-300 rounded-full">
            <span className="truncate block drop-shadow-sm">{competition.name}</span>
          </div>

          {competition.status === 'Upcoming' && (
            <div className="absolute top-12 right-3 bg-gradient-to-r from-yellow-300 via-yellow-400 to-yellow-500 text-gray-800 px-1.5 py-0.5 rounded-lg text-xs font-bold shadow-xl transform -rotate-3 hover:rotate-0 hover:scale-110 transition-all duration-300 z-10 border-2 border-yellow-200 opacity-85 hover:opacity-100">
              <div className="flex items-center gap-1 relative">
                <Trophy className="h-3 w-3" />
                <span className="drop-shadow-sm">Upcoming</span>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-white/40 to-transparent rounded-lg opacity-50"></div>
            </div>
          )}
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <div className="flex items-center gap-2 text-[10px] text-gray-200 mt-1">
            <Calendar className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">
              {new Date(competition.startDate).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })}
              {competition.endDate && competition.endDate !== competition.startDate && (
                <>
                  <span className="mx-1">-</span>
                  {new Date(competition.endDate).toLocaleDateString('en-AU', {
                    day: 'numeric',
                    month: 'numeric',
                    year: 'numeric'
                  })}
                </>
              )}
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-[10px] text-gray-200 mt-1">
            <MapPin className="h-3 w-3 flex-shrink-0" />
            <span className="truncate">{competition.location}, {competition.state}</span>
          </div>

          {competition.comment && (
            <div className="mt-1 relative">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-1' : 'max-h-32 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/20 scrollbar-track-transparent border-r border-white/10'}`}>
                {competition.comment}
              </div>
              {competition.comment.length > 50 && (
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

          <div className="flex flex-wrap gap-1 mt-1">
            {competition.categories.map((category) => (
              <span
                key={category}
                className="px-1.5 py-0.5 bg-primary/20 text-primary rounded-full text-[8px]"
              >
                {category}
              </span>
            ))}
          </div>

          <Button
            className="w-full mt-1 bg-gradient-to-r from-primary/40 via-primary/30 to-primary/40 backdrop-blur-md border border-white/30 text-white text-sm font-bold py-0.5 rounded-full shadow-2xl hover:shadow-primary/25 transition-all duration-300 transform hover:scale-105"
            onClick={(e) => {
              e.stopPropagation()
              window.open(competition.eventLink, '_blank')
            }}
          >
            <span className="drop-shadow-sm">{competition.status === 'Upcoming' ? 'Register Now' : 'View Results'}</span>
          </Button>
        </div>

        {/* Darker overlay when comment is expanded */}
        {isCommentExpanded && competition.comment && (
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
            src={competition.imageUrl}
            alt={competition.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 