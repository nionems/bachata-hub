"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, ExternalLink } from "lucide-react"

interface WeekendEvent {
  id: string
  title: string
  date: string
  time?: string
  location: string
  image: string
  url?: string
  website?: string | null
}

interface WeekendEventsProps {
  events: WeekendEvent[]
  title?: string
}

export default function WeekendEventsHighlight({ events, title = "This Weekend" }: WeekendEventsProps) {
  if (!events || events.length === 0) {
    return (
      <Card className="bg-yellow-50 border-yellow-200 overflow-hidden hover:shadow-lg transition-shadow">
        <CardHeader className="p-4 sm:p-6">
          <CardTitle className="text-lg sm:text-xl text-yellow-800">No Weekend Events</CardTitle>
          <CardDescription className="text-sm sm:text-base text-yellow-700">
            Check back soon for upcoming weekend events
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 sm:p-6 sm:pt-0">
          <p className="text-yellow-700">
            There are no events scheduled for this weekend. Subscribe to our newsletter to be notified when new events
            are added.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl sm:text-2xl font-bold text-yellow-800">{title}</h3>

      {events.map((event) => (
        <Card
          key={event.id}
          className="bg-yellow-50 border-yellow-200 overflow-hidden hover:shadow-lg transition-shadow"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
            <div className="md:col-span-1">
              <div className="h-48 sm:h-full overflow-hidden">
                <img
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
            </div>
            <div className="md:col-span-2 p-4 sm:p-6">
              <div className="mb-2 text-yellow-600 font-medium text-sm">WEEKEND EVENT</div>
              <h2 className="text-xl sm:text-2xl font-bold text-yellow-800 mb-3">{event.title}</h2>

              <div className="space-y-2 mb-4">
                <div className="flex items-center text-yellow-700">
                  <Calendar className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span>{event.date}</span>
                </div>

                {event.time && (
                  <div className="flex items-center text-yellow-700">
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                    <span>{event.time}</span>
                  </div>
                )}

                <div className="flex items-center text-yellow-700">
                  <MapPin className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                  <span>{event.location}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-3 mt-4">
                {event.website && (
                  <Button
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => window.open(event.website, "_blank")}
                  >
                    Visit Event Website
                  </Button>
                )}
                {event.url && (
                  <Button
                    className="bg-yellow-600 hover:bg-yellow-700 text-white"
                    onClick={() => window.open(event.url, "_blank")}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View in Calendar
                  </Button>
                )}
                <Link href={`/events/${event.id}`}>
                  <Button variant="outline" className="border-yellow-600 text-yellow-600 hover:bg-yellow-100">
                    Event Details
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  )
}
