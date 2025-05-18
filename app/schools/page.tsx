"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, Star, MapIcon, Share2, Instagram, Facebook } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { SchoolSubmissionForm } from "@/components/SchoolSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { SchoolViewCard } from '@/components/SchoolViewCard'
import { School } from "@/types/school"

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter
} from "@/components/ui/card"

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  
  const { selectedState, setSelectedState, filteredItems: filteredSchools } = useStateFilter(schools)

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const schoolsCollection = collection(db, 'schools')
        const schoolsSnapshot = await getDocs(schoolsCollection)
        const schoolsList = schoolsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            name: data.name || '',
            location: data.location || '',
            state: data.state || '',
            address: data.address || '',
            contactInfo: data.contactInfo || '',
            instructors: data.instructors || [],
            website: data.website || '',
            danceStyles: Array.isArray(data.danceStyles) ? data.danceStyles : [],
            imageUrl: data.imageUrl || '',
            imageRef: data.imageRef || '',
            comment: data.comment || '',
            googleReviewsUrl: data.googleReviewsUrl || '',
            googleRating: data.googleRating || 0,
            googleReviewsCount: data.googleReviewsCount || 0,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: data.updatedAt || new Date().toISOString(),
            googleReviewLink: data.googleReviewLink || '',
            instagramLink: data.socialUrl || '', // Map socialUrl to instagramLink
            facebookLink: data.socialUrl2 || '', // Map socialUrl2 to facebookLink
            googleMapLink: data.googleMapLink || ''
          } as School
        })
        
        setSchools(schoolsList)
      } catch (err) {
        console.error('Error fetching schools:', err)
        setError('Failed to load schools')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Loading schools...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="text-center mb-8 sm:mb-12">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
          Dance Schools
        </h1>
        <p className="text-base sm:text-xl text-gray-600">
          Find dance schools in your area
        </p>
      </div>

      <div className="mb-8">
        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSchools.map((school) => (
          <SchoolViewCard key={school.id} school={school} />
        ))}
      </div>

      {/* Add Your School Card */}
      <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
        <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
          <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
            <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
              Add Your School
            </h2>
            <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
              Are you a dance school owner? Get featured in our directory and connect with dancers across Australia!
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
                Promote your classes and events
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

      <SchoolSubmissionForm
        isOpen={isSubmissionFormOpen}
        onClose={() => setIsSubmissionFormOpen(false)}
      />

      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </div>
  )
}

