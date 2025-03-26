import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CalendarIcon, Clock, MapPin, ExternalLink } from "lucide-react"

interface Event {
  id: string
  title: string
  date: string
  time: string
  location: string
  image: string
  url?: string
  website?: string
}

interface UpcomingEventsListProps {
  events: Event[]
  title?: string
}

export default function UpcomingEventsList({ events, title = "Upcoming Events" }: UpcomingEventsListProps) {
  if (!events || events.length === 0) {
    return (
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-xl font-bold flex items-center">
            <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-600">No upcoming events found. Check back soon!</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-bold flex items-center">
          <CalendarIcon className="h-5 w-5 mr-2 text-green-600" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {events.map((event) => (
            <div key={event.id} className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-1 h-32 overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg?height=200&width=300"}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="md:col-span-3 p-4">
                  <h3 className="text-lg font-semibold text-green-700 mb-2">{event.title}</h3>

                  <div className="space-y-1 mb-3">
                    <div className="flex items-center text-gray-600 text-sm">
                      <CalendarIcon className="h-4 w-4 mr-2 text-green-600" />
                      <span>{event.date}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                      <Clock className="h-4 w-4 mr-2 text-green-600" />
                      <span>{event.time}</span>
                    </div>

                    <div className="flex items-center text-gray-600 text-sm">
                      <MapPin className="h-4 w-4 mr-2 text-green-600" />
                      <span>{event.location}</span>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <Link href={`/events/${event.id}`}>
                      <Button size="sm" variant="outline" className="border-green-600 text-green-600 hover:bg-green-50">
                        View Details
                      </Button>
                    </Link>

                    {event.website && (
                      <a href={event.website} target="_blank" rel="noopener noreferrer">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Visit Website
                        </Button>
                      </a>
                    )}

                    {event.url && (
                      <a href={event.url} target="_blank" rel="noopener noreferrer">
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-yellow-500 text-yellow-600 hover:bg-yellow-50"
                        >
                          <CalendarIcon className="h-3 w-3 mr-1" />
                          View in Calendar
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
