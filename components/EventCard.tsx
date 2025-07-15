'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Calendar, Clock, MapPin, ExternalLink, X, ChevronUp, ChevronDown } from 'lucide-react'
import { Event } from '@/types/event'


interface EventCardProps {
  event: Event
}

export function EventCard({ event }: EventCardProps) {
  const [isCommentExpanded, setIsCommentExpanded] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (event.imageUrl) {
      setIsImageModalOpen(true);
    }
  }

  return (
    <>
      <Card className="relative overflow-hidden group cursor-pointer h-[400px]">
        <div 
          className="aspect-w-16 aspect-h-9 relative h-[200px] cursor-pointer"
          onClick={handleImageClick}
        >
          <img
            src={event.imageUrl}
            alt={event.name}
            className="object-cover w-full h-full"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
          <h3 className="text-base sm:text-lg font-semibold text-primary line-clamp-1">{event.name}</h3>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
            {new Date(event.startDate).toLocaleDateString()} - {new Date(event.endDate).toLocaleDateString()}
          </div>
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
            {event.location}, {event.state}
          </div>
          {event.comment && (
            <div className="mt-1">
              <div className={`text-xs sm:text-sm text-gray-300 ${!isCommentExpanded ? 'line-clamp-2' : ''}`}>
                {event.comment}
              </div>
              {event.comment.length > 100 && (
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
          <div className="flex flex-col gap-2 mt-2 sm:mt-3">
            <Button
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
              onClick={(e) => {
                e.stopPropagation();
                window.open(event.eventLink, '_blank');
              }}
            >
              <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
              <span>Register Now</span>
            </Button>
            <div className="flex flex-wrap gap-2">
              {Array.isArray(event.danceStyles) && event.danceStyles.map((style, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs"
                >
                  {style}
                </span>
              ))}
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
            src={event.imageUrl}
            alt={event.name}
            className="max-h-[90vh] max-w-[90vw] object-contain"
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </>
  )
} 