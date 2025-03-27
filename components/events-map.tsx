"use client"

import { useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin } from "lucide-react"

interface Event {
  id: string
  title: string
  location: string
  lat: number
  lng: number
  date: string
  city: string
}

const events: Event[] = [
  {
    id: "1",
    title: "Sydney Bachata Social",
    location: "Sydney Dance Company, 15 Hickson Road, The Rocks",
    lat: -33.8568,
    lng: 151.2153,
    date: "2024-03-15",
    city: "Sydney"
  },
  {
    id: "2",
    title: "Melbourne Bachata Night",
    location: "Dance Central, 123 Swanston Street, Melbourne",
    lat: -37.8136,
    lng: 144.9631,
    date: "2024-03-16",
    city: "Melbourne"
  },
  {
    id: "3",
    title: "Adelaide Bachata Festival",
    location: "Adelaide Convention Centre, North Terrace, Adelaide",
    lat: -34.9212,
    lng: 138.5991,
    date: "2024-03-20",
    city: "Adelaide"
  },
  {
    id: "4",
    title: "Brisbane Bachata Workshop",
    location: "Brisbane City Hall, King George Square, Brisbane",
    lat: -27.4705,
    lng: 153.0260,
    date: "2024-03-22",
    city: "Brisbane"
  },
  {
    id: "5",
    title: "Perth Bachata Social",
    location: "Perth Concert Hall, St Georges Terrace, Perth",
    lat: -31.9505,
    lng: 115.8605,
    date: "2024-03-25",
    city: "Perth"
  }
]

export function EventsMap() {
  const mapRef = useRef<HTMLDivElement>(null)
  const mapInstanceRef = useRef<google.maps.Map | null>(null)
  const markersRef = useRef<google.maps.Marker[]>([])

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script")
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    script.async = true
    script.defer = true
    document.head.appendChild(script)

    script.onload = () => {
      if (mapRef.current) {
        // Initialize map
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -25.2744, lng: 133.7751 }, // Center of Australia
          zoom: 4,
          styles: [
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#333333" }]
            }
          ]
        })

        mapInstanceRef.current = map

        // Add markers for each event
        events.forEach((event) => {
          const marker = new google.maps.Marker({
            position: { lat: event.lat, lng: event.lng },
            map: map,
            title: event.title,
            icon: {
              url: "https://maps.google.com/mapfiles/ms/icons/red-dot.png"
            }
          })

          // Add info window
          const infoWindow = new google.maps.InfoWindow({
            content: `
              <div class="p-2">
                <h3 class="font-bold">${event.title}</h3>
                <p class="text-sm">${event.location}</p>
                <p class="text-sm text-gray-600">${event.date}</p>
              </div>
            `
          })

          marker.addListener("click", () => {
            infoWindow.open(map, marker)
          })

          markersRef.current.push(marker)
        })
      }
    }

    return () => {
      // Cleanup
      document.head.removeChild(script)
      markersRef.current.forEach((marker) => marker.setMap(null))
    }
  }, [])

  return (
    <Card className="border-0 shadow-none">
      <CardHeader className="p-3 sm:p-6 pb-0">
        <CardTitle className="text-lg sm:text-xl text-green-700">Bachata Events Map</CardTitle>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="rounded-lg overflow-hidden border border-gray-200 shadow-lg">
          <div className="bg-gradient-to-r from-green-600 to-yellow-500 p-3 sm:p-4 flex items-center gap-2">
            <MapPin className="h-4 w-4 sm:h-5 sm:w-5 text-white" />
            <h3 className="text-white font-bold text-sm sm:text-lg">Find Bachata Events Near You</h3>
          </div>
          <div ref={mapRef} className="w-full h-[500px]" />
        </div>

        <div className="mt-4 sm:mt-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
          {events.map((event) => (
            <div key={event.id} className="bg-white rounded-lg p-3 sm:p-4 border border-gray-200">
              <h3 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">{event.title}</h3>
              <p className="text-xs sm:text-sm text-gray-600">{event.location}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{event.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 