"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Users, Calendar, Clock, Building2, Wifi, ParkingCircle, Utensils, Dumbbell, Waves, Heart, MessageSquare, Share2, ChevronRight } from "lucide-react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'

// Hardcoded accommodations data
const accommodationsData = [
  {
    id: "1",
    name: "Dance Central Hotel",
    location: "Sydney",
    state: "NSW",
    address: "123 Dance Street, Sydney CBD",
    websiteLink: "https://example.com",
    price: "From $150/night",
    bookingLink: "https://example.com/book",
    imageUrl: "/accommodations/sydney-hotel.jpg",
    comment: "Located near major dance venues, featuring spacious rooms and practice areas.",
    googleMapLink: "https://goo.gl/maps/example",
    amenities: ["Free WiFi", "Dance Practice Room", "Pool", "Gym"]
  },
  {
    id: "2",
    name: "Dancers Paradise Resort",
    location: "Melbourne",
    state: "VIC",
    address: "456 Salsa Avenue, Melbourne CBD",
    websiteLink: "https://example.com",
    price: "From $180/night",
    bookingLink: "https://example.com/book",
    imageUrl: "/accommodations/melbourne-hotel.jpg",
    comment: "Perfect for dance festival attendees, with special rates for event participants.",
    googleMapLink: "https://goo.gl/maps/example",
    amenities: ["Free WiFi", "Restaurant", "Parking", "Dance Studio"]
  },
  // Add more hardcoded accommodations as needed
]

interface Accommodation {
  id: string;
  name: string;
  state: string;
  // ... other accommodation properties
}

export default function AccommodationPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredAccommodations } = useStateFilter(accommodations)

  useEffect(() => {
    const fetchAccommodations = async () => {
      // ... (similar fetch logic using 'accommodations' collection)
    }

    fetchAccommodations()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-4">
            Dance Event Accommodation
          </h1>
          <p className="text-xl text-gray-600">
            Find accommodation near dance events across Australia
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        {/* ... (rest of the JSX) */}
      </div>
    </div>
  )
}
