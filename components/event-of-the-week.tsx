import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { CalendarIcon, Clock, MapPin, Star, ExternalLink } from "lucide-react"

interface EventOfTheWeekProps {
  id: string
  title: string
  date: string
  time: string
  location: string
  description: string
  image: string
  website?: string
}

export default function EventOfTheWeek({
  id,
  title,
  date,
  time,
  location,
  description,
  image,
  website,
}: EventOfTheWeekProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Star className="h-5 w-5 text-yellow-500 fill-yellow-500" />
        <h2 className="text-xl font-bold text-gray-900">Event of the Week</h2>
      </div>

      <Card className="overflow-hidden border-0 shadow-lg">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
          <div className="md:col-span-1 h-64 md:h-full overflow-hidden relative">
            <div className="absolute inset-0 bg-gradient-to-r from-green-600/20 to-yellow-500/20 z-10" />
            <img src={image || "/placeholder.svg"} alt={title} className="w-full h-full object-cover" />
          </div>
          <div className="md:col-span-2 p-6 bg-gradient-to-br from-green-50 to-yellow-50">
            <div className="mb-2 flex items-center">
              <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                Featured
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>

            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-700">
                <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                <span>{date}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <Clock className="h-4 w-4 mr-2 text-green-600" />
                <span>{time}</span>
              </div>

              <div className="flex items-center text-gray-700">
                <MapPin className="h-4 w-4 mr-2 text-green-600" />
                <span>{location}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-6">{description}</p>

            <div className="flex flex-wrap gap-3">
              <Link href={`/events/${id}`}>
                <Button className="bg-green-600 hover:bg-green-700">View Details</Button>
              </Link>

              {website && (
                <a href={website} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
