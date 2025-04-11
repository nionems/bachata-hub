"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { SchoolSubmissionForm } from "@/components/SchoolSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

interface School {
  id: string
  name: string
  location: string
  state: string
  address: string
  website: string
  price: string
  danceStyles: string
  imageUrl: string
  comment: string
  googleMapLink: string
  googleReviewsUrl: string
  googleRating: number
  googleReviewsCount: number
}

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredSchools } = useStateFilter(schools)

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const schoolsCollection = collection(db, 'schools')
        const schoolsSnapshot = await getDocs(schoolsCollection)
        const schoolsList = schoolsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as School[]
        
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
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8">
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Schools
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find Bachata schools across Australia
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredSchools.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No schools found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredSchools.map((school) => (
              <Card
                key={school.id}
                className="relative overflow-hidden h-80 sm:h-96 text-white cursor-pointer"
                onClick={() => school.imageUrl && setSelectedImage({ url: school.imageUrl, title: school.name })}
              >
                {/* Full image background */}
                <img
                  src={school.imageUrl}
                  alt={school.name}
                  className="absolute inset-0 w-full h-full object-cover z-0"
                />

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

                {/* Bottom compact content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold">{school.name}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {school.location}
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm mt-1">
                    <Badge variant="price">Price: {school.price}</Badge>
                    {school.comment && <span className="text-gray-300">{school.comment}</span>}
                  </div>
                  <div className="flex flex-col gap-2 mt-2 sm:mt-3">
                    {school.website && (
                      <Button
                        className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                        onClick={(e) => {
                          e.stopPropagation();
                          window.open(school.website, '_blank');
                        }}
                      >
                        <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                        <span>Website</span>
                      </Button>
                    )}
                    <div className="flex gap-2">
                      {school.googleMapLink && (
                        <Button
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(school.googleMapLink, '_blank');
                          }}
                        >
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Map</span>
                        </Button>
                      )}
                      {school.googleReviewsUrl && (
                        <Button
                          variant="outline"
                          className="flex-1 border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(school.googleReviewsUrl, '_blank');
                          }}
                        >
                          <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Reviews</span>
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

        {/* Submit Your School Card */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Submit Your School
              </h2>
              <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
                Are you running a Bachata school? Get featured in our directory and reach dancers across Australia!
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
                  Promote your school to the dance community
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

        <SchoolSubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
        />
      </div>
    </div>
  )
}

function SchoolCard({ school }: { school: School }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48 w-full bg-gray-100">
        <img
          src={school.imageUrl}
          alt={school.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            console.error('Error loading image:', school.imageUrl);
            (e.target as HTMLImageElement).src = '/placeholder-school.jpg';
          }}
        />
        {school.googleRating && (
          <div className="absolute top-2 right-2 bg-white/90 px-2 py-1 rounded-full text-sm font-semibold flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-400" />
            {school.googleRating}
          </div>
        )}
      </div>
      <CardHeader className="pt-1 pb-2">
        <CardTitle className="text-center w-full text-lg">{school.name}</CardTitle>
        <CardDescription className="flex items-center gap-2 justify-center text-sm">
          <MapPin className="h-3 w-3" />
          {school.location}, {school.state}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-2">
        <div className="space-y-1">
          {school.contactInfo && (
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <Users className="h-3 w-3" />
              {school.contactInfo}
            </div>
          )}
          {Array.isArray(school.danceStyles) && school.danceStyles.length > 0 && (
            <div className="flex items-center gap-1 text-xs text-gray-500">
              <Star className="h-3 w-3" />
              {school.danceStyles.join(", ")}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-1 pt-0">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <MapIcon className="h-3 w-3" />
          {school.address}
        </div>
        <div className="flex flex-col gap-2 mt-2 w-full">
          {school.website && (
            <Button 
              className="w-full bg-primary hover:bg-primary/90 text-white text-xs h-8 flex items-center justify-center gap-2" 
              asChild
            >
              <a href={school.website} target="_blank" rel="noopener noreferrer" className="w-full">
                <ExternalLink className="h-4 w-4" />
                <span>Visit Website</span>
              </a>
            </Button>
          )}
          <div className="flex gap-2 w-full">
            {school.googleMapLink && (
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                asChild
              >
                <a href={school.googleMapLink} target="_blank" rel="noopener noreferrer" className="w-full">
                  <MapPin className="h-4 w-4" />
                  <span>Map</span>
                </a>
              </Button>
            )}
            {school.socialUrl && (
              <Button 
                variant="outline"
                className="w-full border-primary text-primary hover:bg-primary/10 text-xs h-8 flex items-center justify-center gap-2"
                asChild
              >
                <a href={school.socialUrl} target="_blank" rel="noopener noreferrer" className="w-full">
                  <Share2 className="h-4 w-4" />
                  <span>Social</span>
                </a>
              </Button>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  )
}
