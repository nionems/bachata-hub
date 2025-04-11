import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info, ExternalLink, Ticket } from "lucide-react"

interface Festival {
  id: string;
  name: string;
  date: string;
  time: string;
  location: string;
  state: string;
  price?: string;
  description?: string;
  imageUrl?: string;
  websiteUrl?: string;
  ticketLink?: string;
  googleMapLink?: string;
  startDate?: string;
  endDate?: string;
  eventLink?: string;
  comment?: string;
}

interface FestivalCardProps {
  festival: Festival;
}

export function FestivalCard({ festival }: FestivalCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-48 overflow-hidden">
        <img
          src={festival.imageUrl || '/placeholder.svg'}
          alt={festival.name}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-base text-primary">{festival.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 text-xs">
          <MapPin className="h-3 w-3" />
          {festival.location}, {festival.state}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-xs">
            <Calendar className="h-3 w-3 text-green-600" />
            <span>
              {festival.startDate ? new Date(festival.startDate).toLocaleDateString("en-AU", {
                day: "numeric",
                month: "short",
                year: "numeric",
              }) : festival.date}{" "}
              {festival.endDate && festival.startDate ? (
                <>
                  –{" "}
                  {new Date(festival.endDate).toLocaleDateString("en-AU", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
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