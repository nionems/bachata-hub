import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, MapPin, DollarSign, Info, Ticket, Instagram, Facebook, Navigation, ChevronDown, ChevronUp } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Festival } from "@/types/festival"

interface LazyFestivalCardProps {
  festival: Festival
  onImageClick: (e: React.MouseEvent, festival: Festival) => void
  expandedDescriptions: { [key: string]: boolean }
  toggleDescription: (festivalId: string) => void
  dateHelpers: any
  isFeatured?: boolean
}

export function LazyFestivalCard({
  festival,
  onImageClick,
  expandedDescriptions,
  toggleDescription,
  dateHelpers,
  isFeatured = false
}: LazyFestivalCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  return (
    <Card className={`overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 ${isFeatured ? 'border-2 border-yellow-300' : ''}`}>
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={festival.imageUrl || '/images/placeholder.jpg'}
          alt={festival.name}
          fill
          className={`object-cover transition-transform duration-300 hover:scale-105 cursor-pointer ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => onImageClick(e, festival)}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {isFeatured && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
              ⭐ Featured
            </Badge>
          </div>
        )}
        
        {/* Social Media and Map Icons on Image */}
        {(festival.instagramLink || festival.facebookLink || festival.googleMapLink) && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {festival.instagramLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(festival.instagramLink, "_blank")
                }}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {festival.facebookLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(festival.facebookLink, "_blank")
                }}
              >
                <Facebook className="h-4 w-4" />
              </Button>
            )}
            {festival.googleMapLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(festival.googleMapLink, "_blank")
                }}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{festival.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{dateHelpers.formatDate(festival.startDate)}</span>
          {festival.endDate && festival.endDate !== festival.startDate && (
            <span className="mx-1">-</span>
          )}
          {festival.endDate && festival.endDate !== festival.startDate && (
            <span>{dateHelpers.formatDate(festival.endDate)}</span>
          )}
        </div>
        {festival.description && (
          <div className="mb-2">
            <div className={`text-sm text-gray-600 ${!expandedDescriptions[festival.id] ? 'line-clamp-2' : ''}`}>
              {festival.description}
            </div>
            {festival.description.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDescription(festival.id);
                }}
                className="text-primary hover:text-primary/80 text-xs mt-1 flex items-center gap-1"
              >
                {expandedDescriptions[festival.id] ? (
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
        {festival.ambassadorCode && (
          <div className="mb-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-700 hover:bg-green-500/30 font-semibold border border-green-500/30">
              🎫 Discount Code: {festival.ambassadorCode}
            </Badge>
          </div>
        )}
        <div className="flex items-center justify-between text-gray-600 text-sm space-x-2">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">
              {festival.location}
              {festival.country === 'Australia' ? `, ${festival.state}` : festival.state && festival.state !== 'N/A' ? `, ${festival.state}` : ''}
              {festival.country && festival.country !== 'Australia' && `, ${festival.country}`}
            </span>
          </div>
          {festival.price && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="truncate">{festival.price}</span>
            </div>
          )}
        </div>
        {/* Dance Style Stickers */}
        {festival.danceStyles && (
          <div className="flex flex-wrap gap-1 mt-2">
            {(Array.isArray(festival.danceStyles) ? festival.danceStyles : festival.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)).slice(0, 3).map((style: string, index: number) => (
              <div 
                key={index}
                className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm"
              >
                {style}
              </div>
            ))}
            {(Array.isArray(festival.danceStyles) ? festival.danceStyles : festival.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)).length > 3 && (
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                +{(Array.isArray(festival.danceStyles) ? festival.danceStyles : festival.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)).length - 3}
              </div>
            )}
          </div>
        )}
        
        <div className="mt-4 grid grid-cols-2 gap-2">
          {festival.eventLink && (
            <Link href={festival.eventLink} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2">
                <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Event Details</span>
              </Button>
            </Link>
          )}
          {festival.ticketLink && (
            <Link href={festival.ticketLink} target="_blank" rel="noopener noreferrer" className="w-full">
              <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2">
                <Ticket className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Buy Tickets</span>
              </Button>
            </Link>
          )}
        </div>
      </div>
    </Card>
  )
}
