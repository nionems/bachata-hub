"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, X, Music } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { FestivalSubmissionForm } from "@/components/FestivalSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { FestivalCard } from '@/components/FestivalCard'
import Image from "next/image"
import { GridSkeleton } from "@/components/loading-skeleton"

interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string
  imageUrl: string
  comment: string
  googleMapLink: string
  festivalLink: string
  date: string
  startTime: string
  endTime: string
  time: string
  featured?: 'yes' | 'no'
  published?: boolean
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredFestivals } = useStateFilter(festivals, { useGeolocation: false })

  const handleImageClick = (e: React.MouseEvent, festival: Festival) => {
    e.stopPropagation()
    if (festival.imageUrl) {
      setSelectedImage({
        url: festival.imageUrl,
        title: festival.name
      })
      setIsImageModalOpen(true)
    }
  }

  const handleCloseModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  }

  useEffect(() => {
    const fetchFestivals = async () => {
      setIsLoading(true)
      setError(null)
      try {
        // Use the API route that filters published festivals with cache busting
        const response = await fetch('/api/festivals?t=' + Date.now())
        if (!response.ok) {
          throw new Error('Failed to fetch festivals')
        }
        const festivalsList = await response.json()
        
        // Sort festivals alphabetically by name
        const sortedFestivals = festivalsList.sort((a: Festival, b: Festival) => 
          a.name.localeCompare(b.name)
        )
        
        setFestivals(sortedFestivals)
      } catch (err) {
        console.error('Error fetching festivals:', err)
        setError('Failed to load festivals')
      } finally {
        setIsLoading(false)
      }
    }

    fetchFestivals()
  }, [])

  // Helper function to check if a date is in the future
  const isFutureDate = (dateString: string) => {
    // Handle "To Be Announced" dates
    if (dateString.includes("To Be Announced")) {
      return true // Always show TBA dates
    }

    // Extract the year from the date string
    const yearMatch = dateString.match(/\d{4}/)
    if (!yearMatch) return true // If no year found, treat as future date
    const year = Number.parseInt(yearMatch[0])
    const currentYear = new Date().getFullYear()

    // If the year is in the future, the event is upcoming
    return year >= currentYear
  }

  // Helper function to convert date string to a comparable value for sorting
  const getDateSortValue = (dateString: string) => {
    // Handle "To Be Announced" dates - put them at the end
    if (dateString.includes("To Be Announced")) {
      return Number.POSITIVE_INFINITY // This will place TBA dates at the end
    }

    try {
      const date = new Date(dateString)
      return date.getTime() // Use timestamp for accurate sorting
    } catch (error) {
      return Number.POSITIVE_INFINITY // Fallback for unparseable dates
    }
  }

  // Helper function to format date in Australian format
  const formatDate = (dateString: string) => {
    if (dateString.includes("To Be Announced")) {
      return "To Be Announced"
    }

    try {
      const date = new Date(dateString)
      return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'numeric',
        year: 'numeric'
      })
    } catch (error) {
      return dateString // Return original string if date parsing fails
    }
  }

  // Filter out past events and sort by date
  const upcomingFestivals = festivals
    .filter((festival) => isFutureDate(festival.startDate))
    .filter((festival) => selectedState === "all" || festival.state === selectedState)
    .sort((a, b) => getDateSortValue(a.startDate) - getDateSortValue(b.startDate))

  // Separate featured and regular festivals
  const featuredFestivals = upcomingFestivals.filter(festival => festival.featured === 'yes')
  const regularFestivals = upcomingFestivals.filter(festival => festival.featured !== 'yes')

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
          <div className="text-center mb-4 sm:mb-12">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
              Bachata Festivals
            </h1>
            <p className="text-base sm:text-xl text-gray-600">
              Australia's top Bachata festivals — all in one place.
            </p>
          </div>
          <div className="mb-4 sm:mb-8">
            <StateFilter
              selectedState={selectedState}
              onChange={setSelectedState}
            />
          </div>
          <GridSkeleton count={6} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading Festivals</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Festivals
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Australia's top Bachata festivals — all in one place.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <StateFilter
            selectedState={selectedState}
            onChange={setSelectedState}
          />
        </div>

        {/* Featured Festivals Section */}
        {featuredFestivals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              ⭐ Featured Festivals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              {featuredFestivals.map((festival) => (
                <Card key={festival.id} className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-yellow-300">
                  <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                    <Image
                      src={festival.imageUrl}
                      alt={festival.name}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                      onClick={(e) => handleImageClick(e, festival)}
                    />
                    <div className="absolute top-2 right-2">
                      <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
                        ⭐ Featured
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold mb-2">{festival.name}</h3>
                    <div className="flex items-center text-gray-600 text-sm mb-2">
                      <Calendar className="w-4 h-4 mr-1" />
                      <span>{formatDate(festival.startDate)}</span>
                      {festival.endDate && festival.endDate !== festival.startDate && (
                        <span className="mx-1">-</span>
                      )}
                      {festival.endDate && festival.endDate !== festival.startDate && (
                        <span>{formatDate(festival.endDate)}</span>
                      )}
                    </div>
                    {festival.comment && (
                      <div className="mb-2">
                        <Badge variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30">
                          {festival.comment}
                        </Badge>
                      </div>
                    )}
                    <div className="flex items-center justify-between text-gray-600 text-sm space-x-2">
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-1" />
                        <span className="truncate">{festival.location}, {festival.state}</span>
                      </div>
                      {festival.danceStyles && (
                        <div className="flex items-center">
                          <Music className="w-4 h-4 mr-1" />
                          <span className="truncate">{festival.danceStyles}</span>
                        </div>
                      )}
                      {festival.price && (
                        <div className="flex items-center">
                          <DollarSign className="w-4 h-4 mr-1" />
                          <span className="truncate">{festival.price}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-2">
                      {festival.eventLink && (
                        <Link href={festival.eventLink} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2">
                            <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Event Details</span>
                          </Button>
                        </Link>
                      )}
                      {festival.ticketLink && (
                        <Link href={festival.ticketLink} target="_blank" rel="noopener noreferrer" className="w-full">
                          <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2">
                            <Ticket className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Buy Tickets</span>
                          </Button>
                        </Link>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Regular Festivals Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {regularFestivals.length === 0 && featuredFestivals.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No festivals found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            regularFestivals.map((festival) => (
              <Card key={festival.id} className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
                <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
                  <Image
                    src={festival.imageUrl}
                    alt={festival.name}
                    fill
                    className="object-cover transition-transform duration-300 hover:scale-105 cursor-pointer"
                    onClick={(e) => handleImageClick(e, festival)}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-semibold mb-2">{festival.name}</h3>
                  <div className="flex items-center text-gray-600 text-sm mb-2">
                    <Calendar className="w-4 h-4 mr-1" />
                    <span>{formatDate(festival.startDate)}</span>
                    {festival.endDate && festival.endDate !== festival.startDate && (
                      <span className="mx-1">-</span>
                    )}
                    {festival.endDate && festival.endDate !== festival.startDate && (
                      <span>{formatDate(festival.endDate)}</span>
                    )}
                  </div>
                  {festival.comment && (
                    <div className="mb-2">
                      <Badge variant="secondary" className="bg-secondary/20 text-secondary hover:bg-secondary/30">
                        {festival.comment}
                      </Badge>
                    </div>
                  )}
                  <div className="flex items-center justify-between text-gray-600 text-sm space-x-2">
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      <span className="truncate">{festival.location}, {festival.state}</span>
                    </div>
                    {festival.danceStyles && (
                      <div className="flex items-center">
                        <Music className="w-4 h-4 mr-1" />
                        <span className="truncate">{festival.danceStyles}</span>
                      </div>
                    )}
                    {festival.price && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 mr-1" />
                        <span className="truncate">{festival.price}</span>
                      </div>
                    )}
                  </div>
                  <div className="mt-4 grid grid-cols-2 gap-2">
                    {festival.eventLink && (
                      <Link href={festival.eventLink} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2">
                          <Info className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Event Details</span>
                        </Button>
                      </Link>
                    )}
                    {festival.ticketLink && (
                      <Link href={festival.ticketLink} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2">
                          <Ticket className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Buy Tickets</span>
                        </Button>
                      </Link>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Image Modal */}
        {isImageModalOpen && selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => {
              setIsImageModalOpen(false)
              setSelectedImage(null)
            }}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => {
                setIsImageModalOpen(false)
                setSelectedImage(null)
              }}
            >
              <X className="h-8 w-8" />
            </button>
            <img
              src={selectedImage.url}
              alt={selectedImage.title}
              className="max-h-[90vh] max-w-[90vw] object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        )}

        {/* Submit Your Festival Card */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                Submit Your Festival
              </h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Are you organizing a Bachata festival? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance enthusiasts
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your festival to the dance community
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with dancers across Australia
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-3 sm:space-y-4 w-full sm:w-auto">
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-white text-primary px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center w-full sm:w-auto"
              >
                Contact Us
              </Button>
              <Button
                onClick={() => setIsSubmissionFormOpen(true)}
                className="bg-secondary text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center w-full sm:w-auto"
              >
                Submit via Form
              </Button>
            </div>
          </div>
        </div>

        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />

        <FestivalSubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
        />
      </div>
    </div>
  )
}
