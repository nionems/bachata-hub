'use client'

import { useState } from 'react'
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Clock, Trophy, Music } from "lucide-react"
import { Competition } from "@/types/competition"
import Image from "next/image"
import { ImageModal } from "@/components/ImageModal"

interface CompetitionCardProps {
  competition: Competition
}

export function CompetitionCard({ competition }: CompetitionCardProps) {
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)

  const handleImageClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (competition.imageUrl) {
      setSelectedImage({
        url: competition.imageUrl,
        title: competition.name
      })
      setIsImageModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsImageModalOpen(false)
    setSelectedImage(null)
  }

  return (
    <>
      <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
          <Image
            src={competition.imageUrl || '/images/placeholder.svg'}
            alt={competition.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={handleImageClick}
          />
          {competition.status === 'Upcoming' && (
            <div className="absolute top-4 right-4 bg-primary text-white px-3 py-1 rounded-full text-sm font-semibold flex items-center gap-1 shadow-lg transform rotate-3 hover:rotate-0 transition-transform duration-200">
              <Trophy className="h-4 w-4" />
              Upcoming
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{competition.name}</h3>
          <div className="flex items-center text-gray-600 text-sm mb-2">
            <Calendar className="w-4 h-4 mr-1" />
            <span>{new Date(competition.startDate).toLocaleDateString('en-AU', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric'
            })}</span>
            {competition.endDate && competition.endDate !== competition.startDate && (
              <span className="mx-1">-</span>
            )}
            {competition.endDate && competition.endDate !== competition.startDate && (
              <span>{new Date(competition.endDate).toLocaleDateString('en-AU', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })}</span>
            )}
          </div>
          {competition.comment && (
            <p className="text-sm text-gray-600 mb-2 line-clamp-2">
              {competition.comment}
            </p>
          )}
          <div className="flex items-center justify-between text-gray-600 text-sm space-x-2">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-1" />
              <span className="truncate">{competition.location}, {competition.state}</span>
            </div>
            {competition.danceStyles && (
              <div className="flex items-center">
                <Music className="w-4 h-4 mr-1" />
                <span className="truncate">{competition.danceStyles}</span>
              </div>
            )}
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {competition.categories.map((category) => (
              <span
                key={category}
                className="px-2 py-1 bg-primary/20 text-primary rounded-full text-xs"
              >
                {category}
              </span>
            ))}
          </div>
          <Button
            className="w-full mt-4 bg-primary hover:bg-primary/90 text-white"
            onClick={(e) => {
              e.stopPropagation()
              window.open(competition.eventLink, '_blank')
            }}
          >
            {competition.status === 'Upcoming' ? 'Register Now' : 'View Results'}
          </Button>
        </div>
      </Card>

      <ImageModal
        isOpen={isImageModalOpen}
        onClose={handleCloseModal}
        imageUrl={selectedImage?.url || ''}
        title={selectedImage?.title || ''}
      />
    </>
  )
} 