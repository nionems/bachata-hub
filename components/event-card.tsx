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
      <div className="h-40 sm:h-48 overflow-hidden">
        <img
          src={image || "/placeholder.svg"}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardHeader className="p-4 sm:p-6">
        <CardTitle className="text-lg sm:text-xl text-green-700">{title}</CardTitle>
        <CardDescription className="text-sm sm:text-base">{date}</CardDescription>
        {time && time !== "All day" && <CardDescription className="text-sm sm:text-base mt-1">{time}</CardDescription>}
      </CardHeader>
      <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
        <div className="flex items-center text-gray-600 text-sm sm:text-base">
          <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
          <span>{location}</span>
        </div>
        {description && (
          <p className="mt-2 text-sm text-gray-600 line-clamp-2">{description}</p>
        )}
      </CardContent>
      <CardFooter className="p-4 sm:p-6 flex flex-col sm:flex-row gap-2">
        <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-sm sm:text-base">
          View Details
        </Button>
        {url && (
          <Button
            className="w-full bg-green-600 hover:bg-green-700 text-white text-sm sm:text-base"
            onClick={() => window.open(url, "_blank")}
          >
            Visit Website
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}
