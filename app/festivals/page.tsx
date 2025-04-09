"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
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
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Bachata Festivals
          </h1>
          <p className="text-xl text-gray-600">
            Find Bachata festivals across Australia
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredFestivals.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No festivals found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredFestivals.map((festival) => (
              <FestivalCard key={festival.id} festival={festival} />
            ))
          )}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Submit Your Festival
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you organizing a Bachata festival? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance enthusiasts
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your festival to the dance community
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with dancers across Australia
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <a
                href="mailto:contact@bachata.au"
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]"
              >
                Contact Us
              </a>
              <a
                href="https://forms.gle/your-google-form-link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
              >
                Submit via Form
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
