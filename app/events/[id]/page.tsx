'use client'

import { useParams, useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Calendar, Clock, ArrowLeft } from "lucide-react"
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { CloudinaryImage } from "@/components/cloudinary-image"

interface Event {
  id: string
  name: string
  date: string
  time: string
  start: string
  end: string
  description: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  imageUrl: string
  comment: string
  googleMapLink: string
}

export default function EventDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const [event, setEvent] = useState<Event | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchEventDetails = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (!response.ok) throw new Error('Failed to fetch event details')
        const data = await response.json()
        setEvent(data)
      } catch (err) {
        setError('Failed to load event details')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchEventDetails()
  }, [params.id])

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (error || !event) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Event not found</h1>
          <Button
            className="mt-4"
            onClick={() => router.back()}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Go Back
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.back()}
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back
      </Button>

      <Card className="overflow-hidden">
        <div className="relative h-96">
          <CloudinaryImage
            src={event.imageUrl}
            alt={event.name}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            quality={90}
            format="auto"
            crop="fill"
            gravity="auto"
            onError={(e: any) => {
              e.currentTarget.src = '/placeholder.svg'
            }}
          />
        </div>
        <CardHeader>
          <CardTitle className="text-3xl">{event.name}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-green-600" />
                <span className="text-lg">{event.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-green-600" />
                <span className="text-lg">{event.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-green-600" />
                <span className="text-lg">{event.location}</span>
              </div>
            </div>

            {event.address && (
              <div>
                <h3 className="font-semibold mb-2">Address:</h3>
                <p>{event.address}</p>
              </div>
            )}

            {event.description && (
              <div>
                <h3 className="font-semibold mb-2">About this event:</h3>
                <div 
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: event.description }}
                />
              </div>
            )}

            {event.price && (
              <div>
                <h3 className="font-semibold mb-2">Price:</h3>
                <p>{event.price}</p>
              </div>
            )}

            <div className="flex gap-4 mt-8">
              {event.ticketLink && (
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(event.ticketLink, "_blank")}
                >
                  Get Tickets
                </Button>
              )}
              {event.googleMapLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(event.googleMapLink, "_blank")}
                >
                  View Map
                </Button>
              )}
              {event.eventLink && (
                <Button
                  variant="outline"
                  onClick={() => window.open(event.eventLink, "_blank")}
                >
                  Event Website
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 