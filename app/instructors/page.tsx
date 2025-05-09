"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, Instagram, Facebook, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { InstructorSubmissionForm } from "@/components/InstructorSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { InstructorCard } from '@/components/InstructorCard'

interface Instructor {
  id: string
  name: string
  location: string
  state: string
  address: string
  website: string
  price: string
  danceStyles: string[]
  imageUrl: string
  comment: string
  googleMapLink: string
  socialUrl: string
  instagramLink?: string
  facebookLink?: string
  emailLink?: string
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  
  const { selectedState, setSelectedState, filteredItems: filteredInstructors } = useStateFilter(instructors)

  useEffect(() => {
    const fetchInstructors = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const instructorsCollection = collection(db, 'instructors')
        const instructorsSnapshot = await getDocs(instructorsCollection)
        const instructorsList = instructorsSnapshot.docs.map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            ...data,
            // Convert danceStyles to array if it's a string
            danceStyles: typeof data.danceStyles === 'string' 
              ? data.danceStyles.split(',').map(style => style.trim())
              : Array.isArray(data.danceStyles) 
                ? data.danceStyles 
                : []
          }
        }) as Instructor[]
        
        setInstructors(instructorsList)
      } catch (err) {
        console.error('Error fetching instructors:', err)
        setError('Failed to load instructors')
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Loading instructors...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Instructors
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
          Find Bachata instructors across Australia for private lessons, group workshops, or exciting collaborations.
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredInstructors.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No instructors found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredInstructors.map((instructor) => (
              <InstructorCard key={instructor.id} instructor={instructor} />
            ))
          )}
        </div>

        {/* Submit Your Instructor Card */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Submit Your Instructor Profile
              </h2>
              <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
                Are you a Bachata instructor? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-2 sm:space-y-3">
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
                  Promote your classes to the dance community
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

        <InstructorSubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
        />
      </div>
    </div>
  )
}
