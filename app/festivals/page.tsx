"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { FestivalSubmissionForm } from "@/components/FestivalSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { FestivalCard } from '@/components/FestivalCard'

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
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredFestivals } = useStateFilter(festivals)

  useEffect(() => {
    const fetchFestivals = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const festivalsCollection = collection(db, 'festivals')
        const festivalsSnapshot = await getDocs(festivalsCollection)
        const festivalsList = festivalsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Festival[]
        
        setFestivals(festivalsList)
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

    // Extract month and year
    const months = {
      January: 1,
      February: 2,
      March: 3,
      April: 4,
      May: 5,
      June: 6,
      July: 7,
      August: 8,
      September: 9,
      October: 10,
      November: 11,
      December: 12,
    }

    // Extract month name and year
    const monthMatch = dateString.match(
      /(January|February|March|April|May|June|July|August|September|October|November|December)/,
    )
    const yearMatch = dateString.match(/\d{4}/)

    if (monthMatch && yearMatch) {
      const month = months[monthMatch[0] as keyof typeof months]
      const year = Number.parseInt(yearMatch[0])
      return year * 100 + month // This creates a sortable value (e.g., 202501 for January 2025)
    }

    return Number.POSITIVE_INFINITY // Fallback for unparseable dates
  }

  // Filter out past events and sort by date
  const upcomingFestivals = festivals
    .filter((festival) => isFutureDate(festival.startDate))
    .filter((festival) => selectedState === "all" || festival.state === selectedState)
    .sort((a, b) => getDateSortValue(a.startDate) - getDateSortValue(b.startDate))

  if (isLoading) {
    return <div className="text-center py-8">Loading festivals...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Festivals
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
          Australia's top Bachata festivals — all in one place.
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredFestivals.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No festivals found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredFestivals.map((festival) => (
              <Card
                key={festival.id}
                className="relative overflow-hidden h-80 sm:h-96 text-white cursor-pointer"
                onClick={() => festival.imageUrl && setSelectedImage({ url: festival.imageUrl, title: festival.name })}
              >
                {/* Full image background */}
                <img
                  src={festival.imageUrl}
                  alt={festival.name}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

                {/* Bottom compact content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold">{festival.name}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {festival.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
                    <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                    <span>{festival.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
                    <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-green-300" />
                    <span>
                      {festival.startTime && festival.endTime ? (
                        <>
                          {format(new Date(`2000-01-01T${festival.startTime}`), 'h:mm a')} –{' '}
                          {format(new Date(`2000-01-01T${festival.endTime}`), 'h:mm a')}
                        </>
                      ) : (
                        'Time TBA'
                      )}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
                    <Badge variant="price">Price: {festival.price}</Badge>
                    {festival.comment && <span className="text-gray-300">{festival.comment}</span>}
                  </div>
                  <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                    {festival.ticketLink && (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(festival.ticketLink, '_blank');
                        }}
                      >
                        <Ticket className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Tickets</span>
                      </Button>
                    )}
                    <div className="flex gap-2">
                      {festival.googleMapLink && (
                        <Button
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(festival.googleMapLink, '_blank');
                          }}
                        >
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Map</span>
                        </Button>
                      )}
                      {festival.festivalLink && (
                        <Button
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(festival.festivalLink, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Website</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Image Modal */}
        <ImageModal
          isOpen={!!selectedImage}
          onClose={() => setSelectedImage(null)}
          imageUrl={selectedImage?.url || ''}
          title={selectedImage?.title || ''}
        />

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
