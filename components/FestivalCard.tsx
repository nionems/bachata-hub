import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info, ExternalLink, Ticket, Star, Music, Instagram, Facebook, Navigation, ChevronDown, ChevronUp } from "lucide-react"
import { Festival } from "@/types/festival"
import Image from "next/image"
import { useMemo, useState } from "react"
import { DANCE_STYLES } from "@/lib/constants"

interface FestivalCardProps {
  festival: Festival;
}

export function FestivalCard({ festival }: FestivalCardProps) {
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false)
  
  // Memoize date formatting to avoid repeated calculations
  const formattedDates = useMemo(() => {
    const startDate = festival.startDate ? new Date(festival.startDate).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) : festival.date;
    
    const endDate = festival.endDate ? new Date(festival.endDate).toLocaleDateString("en-AU", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }) : null;
    
    return { startDate, endDate };
  }, [festival.startDate, festival.endDate, festival.date]);

  // Helper function to get dance styles as array
  const getDanceStylesArray = (danceStyles: string[] | string | undefined): string[] => {
    if (!danceStyles) return [];
    if (Array.isArray(danceStyles)) return danceStyles;
    return danceStyles.split(',').map(s => s.trim()).filter(Boolean);
  };

  const danceStylesArray = getDanceStylesArray(festival.danceStyles);

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden relative">
        <Image
          src={festival.imageUrl || '/placeholder.svg'}
          alt={festival.name}
          fill
          className="object-cover transition-transform hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
        {festival.featured === 'yes' && (
          <div className="absolute top-2 right-2">
            <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
              <Star className="h-3 w-3 mr-1" />
              Featured
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
      <CardHeader className="p-3">
        <CardTitle className="text-base text-primary">{festival.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <MapPin className="h-3 w-3" />
          {festival.location}
          {festival.country === 'Australia' ? `, ${festival.state}` : festival.state && festival.state !== 'N/A' ? `, ${festival.state}` : ''}
          {festival.country && festival.country !== 'Australia' && `, ${festival.country}`}
        </CardDescription>
        {/* Dance Style Stickers */}
        {danceStylesArray.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {danceStylesArray.slice(0, 3).map((style, index) => (
              <div 
                key={index}
                className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm"
              >
                {style}
              </div>
            ))}
            {danceStylesArray.length > 3 && (
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                +{danceStylesArray.length - 3}
              </div>
            )}
          </div>
        )}
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-green-600" />
            <span>
              {formattedDates.startDate}{" "}
              {formattedDates.endDate && festival.startDate ? (
                <>
                  –{" "}
                  {formattedDates.endDate}
                </>
              ) : null}
            </span>
          </div>

          {festival.time && (
            <div className="flex items-center gap-2 text-xs">
              <Clock className="h-3 w-3 text-green-600" />
              <span>{festival.time}</span>
            </div>
          )}
          {festival.description && (
            <div className="mt-1">
              <div className={`text-gray-600 text-xs ${!isDescriptionExpanded ? 'line-clamp-2' : ''}`}>
                {festival.description}
              </div>
              {festival.description.length > 100 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDescriptionExpanded(!isDescriptionExpanded);
                  }}
                  className="text-primary hover:text-primary/80 text-xs mt-1 flex items-center gap-1"
                >
                  {isDescriptionExpanded ? (
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
          <div className="flex gap-2 items-center">
            {festival.price && (
              <Badge variant="price" className="text-xs">Price: {festival.price}</Badge>
            )}
            {festival.ambassadorCode && (
              <Badge variant="secondary" className="bg-green-500/20 text-green-700 text-xs">
                🎫 {festival.ambassadorCode}
              </Badge>
            )}
          </div>
          <div className="flex flex-col gap-2 mt-3">
            {festival.ticketLink && (
              <Button
                className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8 flex items-center justify-center gap-2"
                onClick={() => window.open(festival.ticketLink, "_blank")}
              >
                <Ticket className="h-4 w-4" />
                <span>Tickets</span>
              </Button>
            )}
            <div className="flex gap-2">
              {festival.websiteUrl && (
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                  onClick={() => window.open(festival.websiteUrl, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Website</span>
                </Button>
              )}
              {festival.eventLink && (
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                  onClick={() => window.open(festival.eventLink, "_blank")}
                >
                  <ExternalLink className="h-4 w-4" />
                  <span>Event</span>
                </Button>
              )}
              {festival.googleMapLink && (
                <Button
                  variant="outline"
                  className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                  onClick={() => window.open(festival.googleMapLink, "_blank")}
                >
                  <MapPin className="h-4 w-4" />
                  <span>Map</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 