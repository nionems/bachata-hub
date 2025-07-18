import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info, ExternalLink, Ticket, Star, Music } from "lucide-react"
import { Festival } from "@/types/festival"
import Image from "next/image"
import { useMemo } from "react"
import { DANCE_STYLES } from "@/lib/constants"

interface FestivalCardProps {
  festival: Festival;
}

export function FestivalCard({ festival }: FestivalCardProps) {
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
            <p className="text-gray-600 text-xs line-clamp-2">{festival.description}</p>
          )}
          <div className="flex gap-2 items-center">
            {festival.price && (
              <Badge variant="price" className="text-xs">Price: {festival.price}</Badge>
            )}
            {festival.comment && (
              <span className="text-gray-600 text-xs">{festival.comment}</span>
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