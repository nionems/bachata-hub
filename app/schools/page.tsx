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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Dance Schools</h1>
          <p className="text-gray-600 mt-1">Find dance schools in your area</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => setIsContactFormOpen(true)}
          >
            Contact Us
          </Button>
          <Button
            onClick={() => setIsSubmissionFormOpen(true)}
          >
            Add Your School
          </Button>
        </div>
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

