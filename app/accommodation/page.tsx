"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Users, Calendar, Clock, Building2, Wifi, ParkingCircle, Utensils, Dumbbell, Waves, Heart, MessageSquare, Share2, ChevronRight } from "lucide-react"
import CollapsibleFilter from "@/components/collapsible-filter"

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

export default function AccommodationPage() {
  const [selectedState, setSelectedState] = useState('All')

  const filteredAccommodations = selectedState === 'All'
    ? accommodationsData
    : accommodationsData.filter(accommodation => accommodation.state === selectedState)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-green-900 mb-4">Dance-Friendly Accommodation</h1>
        <p className="text-lg text-gray-600">
          Find accommodation near dance venues and events across Australia
        </p>
      </div>

      {/* State Filter */}
      <div className="flex justify-center flex-wrap gap-2 mb-8">
        {['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((state) => (
          <button
            key={state}
            onClick={() => setSelectedState(state)}
            className={`px-6 py-2 rounded-full transition-colors duration-200 ${
              selectedState === state
                ? 'bg-green-600 text-white'
                : 'bg-green-100 text-green-700 hover:bg-green-200'
            }`}
          >
            {state}
          </button>
        ))}
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredAccommodations.map((accommodation) => (
          <Card key={accommodation.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img
                src={accommodation.imageUrl}
                alt={accommodation.name}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <CardTitle>{accommodation.name}</CardTitle>
              <CardDescription className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                {accommodation.location}, {accommodation.state}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">{accommodation.comment}</p>
              <p className="text-green-600 font-semibold mb-4">{accommodation.price}</p>
              <div className="flex flex-wrap gap-2">
                {accommodation.amenities.map((amenity) => (
                  <Badge key={amenity} variant="secondary">
                    {amenity}
                  </Badge>
                ))}
              </div>
              <div className="mt-4 flex gap-2">
                <Button
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  onClick={() => window.open(accommodation.bookingLink, "_blank")}
                >
                  Book Now
                </Button>
                <Button
                  variant="outline"
                  onClick={() => window.open(accommodation.googleMapLink, "_blank")}
                >
                  View Map
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add this section before the final closing div */}
      <div className="mt-16 bg-gradient-to-r from-green-600 to-yellow-400 rounded-xl shadow-xl overflow-hidden">
        <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-6 md:mb-0 md:mr-8">
            <h2 className="text-3xl font-bold mb-4">
              List Your Accommodation
            </h2>
            <p className="text-white/90 text-lg mb-6">
              Do you have dance-friendly accommodation? Get featured in our directory and reach dancers across Australia!
            </p>
            <ul className="space-y-3">
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Reach dancers looking for accommodation
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Connect with dance event organizers
              </li>
              <li className="flex items-center">
                <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                </svg>
                Join Australia's dance community network
              </li>
            </ul>
          </div>
          <div className="flex flex-col space-y-4">
            <a
              href="mailto:contact@bachata.au"
              className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-200 text-center min-w-[200px]"
            >
              Contact Us
            </a>
            <a
              href="https://forms.gle/your-google-form-link"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-yellow-400 text-green-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors duration-200 text-center"
            >
              Submit via Form
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
