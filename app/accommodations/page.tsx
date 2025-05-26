"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Users, Calendar, Clock, Building2, Wifi, ParkingCircle, Utensils, Dumbbell, Waves, Heart, MessageSquare, Share2, ChevronRight } from "lucide-react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'

interface Accommodation {
  id: string
  name: string
  location: string
  state: string
  address: string
  contactInfo: string
  email: string
  website: string
  price: string
  rooms: string
  capacity: string
  imageUrl: string
  comment: string
  googleMapLink: string
  createdAt: string
  updatedAt: string
}

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredAccommodations } = useStateFilter(accommodations)

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Starting to fetch accommodations from API...')
        const response = await fetch('/api/accommodations')
        console.log('API Response status:', response.status)
        
        if (!response.ok) {
          console.error('API Response not OK:', response.status, response.statusText)
          throw new Error('Failed to fetch accommodations')
        }
        
        const data = await response.json()
        console.log('Fetched accommodations data:', data)
        console.log('Number of accommodations:', data.length)
        
        if (!Array.isArray(data)) {
          console.error('Received data is not an array:', data)
          throw new Error('Invalid data format received')
        }
        
        setAccommodations(data)
        console.log('Accommodations state updated')
      } catch (err) {
        console.error('Error in fetchAccommodations:', err)
        setError('Failed to load accommodations: ' + (err instanceof Error ? err.message : 'Unknown error'))
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccommodations()
  }, [])

  if (isLoading) return <div className="text-center py-8">Loading accommodations...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Accommodations
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find places to stay near Australia's top dance events.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <StateFilter
            selectedState={selectedState}
            onChange={setSelectedState}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {filteredAccommodations.map((accommodation) => (
            <Card key={accommodation.id} className="overflow-hidden">
              <div className="relative aspect-video">
                <img
                  src={accommodation.imageUrl}
                  alt={accommodation.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <CardHeader>
                <CardTitle>{accommodation.name}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  <span>{accommodation.location}, {accommodation.state}</span>
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-4 h-4" />
                    <span>{accommodation.price}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    <span>{accommodation.rooms} rooms</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    <span>Capacity: {accommodation.capacity}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">
                    {accommodation.comment}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
