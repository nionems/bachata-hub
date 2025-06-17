"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, MapPin, DollarSign, Users, Calendar, Clock, Building2, Wifi, ParkingCircle, Utensils, Dumbbell, Waves, Heart, MessageSquare, Share2, ChevronRight, Facebook, Instagram, Globe } from "lucide-react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { SubmissionForm } from '@/components/SubmissionForm'
import { LoadingSpinner } from "@/components/loading-spinner"

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
  facebookLink?: string
  instagramLink?: string
}

export default function AccommodationsPage() {
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  
  const { selectedState, setSelectedState, filteredItems: filteredAccommodations } = useStateFilter(accommodations, { useGeolocation: true })

  useEffect(() => {
    const fetchAccommodations = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Starting to fetch accommodations from API...')
        const response = await fetch('/api/accommodations')
        console.log('API Response status:', response.status)
        
        if (!response.ok) {
          const errorData = await response.json()
          console.error('API Response not OK:', response.status, response.statusText, errorData)
          throw new Error(errorData.error || 'Failed to fetch accommodations')
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
        const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred'
        setError(`Failed to load accommodations: ${errorMessage}`)
      } finally {
        setIsLoading(false)
      }
    }

    fetchAccommodations()
  }, [])

  if (isLoading) return <LoadingSpinner message="Loading accommodations..." />
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
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm px-3 py-1.5 rounded-full z-10">
                  <span className="text-sm text-white/90 font-medium">DM for booking</span>
                </div>
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
                  <div className="flex gap-4 mt-3 sm:mt-2">
                    {accommodation.facebookLink && (
                      <a
                        href={accommodation.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white hover:text-primary transition-colors p-1"
                      >
                        <Facebook className="h-6 w-6 sm:h-5 sm:w-5" />
                      </a>
                    )}
                    {accommodation.instagramLink && (
                      <a
                        href={accommodation.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white hover:text-primary transition-colors p-1"
                      >
                        <Instagram className="h-6 w-6 sm:h-5 sm:w-5" />
                      </a>
                    )}
                    {accommodation.website && (
                      <a
                        href={accommodation.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="text-white hover:text-primary transition-colors p-1"
                      >
                        <Globe className="h-6 w-6 sm:h-5 sm:w-5" />
                      </a>
                    )}
                  </div>
                </div>
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

        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                Host Dancers During Festivals — List Your Space!
              </h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Have a spare room or place available during dance festivals, Weekender or for anyone visiting a different state? Share it with fellow dancers visiting from out of town!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Welcome interstate dancers looking for places to stay
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Get featured in our accommodation listings during major events
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with the dance community and make new friends
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Earn extra income while supporting the scene
                </li>
              </ul>
              <p className="text-white/90 text-sm sm:text-base mt-4 sm:mt-6">
                Whether it's a spare room, a couch, or your entire place — help out a fellow dancer and be part of the movement. 🕺💃
              </p>
            </div>
            <div className="flex flex-col space-y-3 sm:space-y-4 w-full sm:w-auto">
              <Button
                onClick={() => setIsSubmissionFormOpen(true)}
                className="bg-white text-primary px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center w-full sm:w-auto"
              >
                Submit Your Accommodation
              </Button>
            </div>
          </div>
        </div>

        <SubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
          type="accommodation"
        />
      </div>
    </div>
  )
}
