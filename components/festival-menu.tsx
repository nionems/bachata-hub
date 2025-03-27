"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, MapPin, Clock, Star } from "lucide-react"

const festivals = [
  {
    id: 1,
    title: "Sydney International Bachata Festival 25",
    date: "April 18-20, 2025",
    time: "3 days",
    location: "West HQ, Rooty Hill, NSW",
    description:
      "Australia's premier Bachata festival featuring world-class workshops, performances, and a live Bachata concert with international artists.",
    image: "/placeholder.svg?height=300&width=600",
    url: "https://www.bachatafestival.com.au/",
    ticketUrl: "https://www.trybooking.com/events/1219139/sessions/4595849/sections",
    featured: true,
  },
  {
    id: 2,
    title: "Adelaide Sensual Week-end 25",
    date: "23-07-2025",
    time: "3 days",
    location: "Adelaide, SA",
    description:
      "Experience the best of Bachata,kizomba, salsa and more in Adelaide with workshops, performances, and social dancing.+ secret Vineyard Party",
    image: "/images/aws25.jpeg",
    url: "https://adelaidesensualweekend.com/",
    ticketUrl: "https://www.trybooking.com/events/1255696/sessions/4754269/sections/2376399/tickets",
    featured: true,
  },
]

export default function FestivalMenu() {
  return (
    <div className="container mx-auto py-6 sm:py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {festivals.map((festival) => (
            <Card key={festival.id} className="overflow-hidden hover:shadow-lg transition-shadow border-yellow-200">
              <div className="relative h-40 sm:h-48 overflow-hidden">
                <div className="absolute top-0 right-0 bg-yellow-500 text-black z-10 px-2 py-1 text-xs sm:text-sm font-medium">
                  Featured
                </div>
                <div className="absolute top-0 left-0 bg-green-500 text-white z-10 px-2 py-1 text-xs sm:text-sm font-medium">
                  Festival
                </div>
                <img
                  src={festival.image || "/placeholder.svg"}
                  alt={festival.title}
                  className="w-full h-full object-cover transition-transform hover:scale-105"
                />
              </div>
              <CardHeader className="p-3 sm:p-4">
                <CardTitle className="text-base sm:text-xl text-green-700">{festival.title}</CardTitle>
                <CardDescription className="text-xs sm:text-sm flex items-center">
                  <Calendar className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  {festival.date}
                </CardDescription>
              </CardHeader>
              <CardContent className="p-3 sm:p-4 pt-0">
                <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-2">
                  <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span>{festival.location}</span>
                </div>
                <div className="flex items-center text-gray-600 text-xs sm:text-sm mb-3">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                  <span>{festival.time}</span>
                </div>
                <p className="text-gray-700 text-xs sm:text-sm line-clamp-3">{festival.description}</p>
              </CardContent>
              <CardFooter className="border-t pt-3 p-3 sm:pt-4 sm:p-4">
                <div className="w-full flex flex-col gap-2 sm:gap-3">
                  {festival.ticketUrl && (
                    <a href={festival.ticketUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button
                        size="sm"
                        className="w-full bg-green-600 hover:bg-green-700 text-white text-xs sm:text-sm"
                      >
                        Buy Tickets
                      </Button>
                    </a>
                  )}
                  {festival.url && (
                    <a href={festival.url} target="_blank" rel="noopener noreferrer" className="w-full">
                      <Button
                        size="sm"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-black text-xs sm:text-sm"
                      >
                        Visit Festival Website
                      </Button>
                    </a>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 