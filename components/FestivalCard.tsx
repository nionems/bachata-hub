import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info } from "lucide-react"

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
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle>{festival.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {festival.location}, {festival.state}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-green-600" />
            <span>{festival.date}</span>
          </div>
          {festival.time && (
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-green-600" />
              <span>{festival.time}</span>
            </div>
          )}
          {festival.description && (
            <p className="text-gray-600 line-clamp-2">{festival.description}</p>
          )}
          {festival.price && (
            <div className="flex gap-2">
              <Badge variant="secondary">Price: {festival.price}</Badge>
            </div>
          )}
          <div className="flex gap-2 mt-4">
            {festival.ticketLink && (
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700"
                onClick={() => window.open(festival.ticketLink, "_blank")}
              >
                Get Tickets
              </Button>
            )}
            {festival.websiteUrl && (
              <Button
                variant="outline"
                onClick={() => window.open(festival.websiteUrl, "_blank")}
              >
                Website
              </Button>
            )}
            {festival.googleMapLink && (
              <Button
                variant="outline"
                onClick={() => window.open(festival.googleMapLink, "_blank")}
              >
                View Map
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
} 