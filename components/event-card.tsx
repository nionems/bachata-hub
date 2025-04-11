"use client"
import { MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface Event {
  id: string
  title: string
  date: string
  time?: string
  location: string
  image: string
  url?: string
  description?: string
  featured?: boolean
}

interface EventCardProps {
  event: Event
}

export default function EventCard({ event }: EventCardProps) {
  const { id, title, date, time, location, image, url, description } = event

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="h-32 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-3">
        <CardTitle className="text-base text-primary">{title}</CardTitle>
        <CardDescription className="text-xs">{date}</CardDescription>
        {time && time !== "All day" && <CardDescription className="text-xs mt-1">{time}</CardDescription>}
      </CardHeader>
      <CardContent className="p-3 pt-0">
        <div className="flex items-center text-gray-600 text-xs">
          <MapPin className="h-3 w-3 mr-1" />
          <span>{location}</span>
        </div>
        {description && (
          <p className="mt-1 text-xs text-gray-600 line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="p-3 flex flex-col gap-1">
        <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8">
          View Details
        </Button>
        {url && (
          <Button
            className="w-full bg-secondary hover:bg-secondary/90 text-white text-xs h-8"
            onClick={() => window.open(url, "_blank")}
          >
            Visit Website
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
