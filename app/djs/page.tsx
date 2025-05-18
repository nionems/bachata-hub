"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, Instagram, Facebook, Music } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { DJSubmissionForm } from "@/components/DJSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DJCard } from '@/components/DJCard'

interface DJ {
  id: string
  name: string
  location: string
  state: string
  contact: string
  emailLink: string
  facebookLink: string
  instagramLink: string
  imageUrl: string
  comment: string
  musicStyles: string | string[]
  createdAt: string
  updatedAt: string
  musicLink: string
}

export default function DJsPage() {
  const [djs, setDJs] = useState<DJ[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  
  const { selectedState, setSelectedState, filteredItems: filteredDJs, isGeoLoading } = useStateFilter(djs)

  useEffect(() => {
    const fetchDJs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Fetching DJs...')
        const djsCollection = collection(db, 'djs')
        const djsSnapshot = await getDocs(djsCollection)
        
        if (djsSnapshot.empty) {
          console.log('No DJs found in collection')
          setDJs([])
          return
        }

        const djsList = djsSnapshot.docs.map(doc => {
          const data = doc.data()
          // Ensure all required fields are present
          return {
            id: doc.id,
            name: data.name || '',
            location: data.location || '',
            state: data.state || '',
            contact: data.contact || '',
            emailLink: data.emailLink || '',
            facebookLink: data.facebookLink || '',
            instagramLink: data.instagramLink || '',
            imageUrl: data.imageUrl || '',
            comment: data.comment || '',
            musicStyles: data.musicStyles || [],
            createdAt: data.createdAt || '',
            updatedAt: data.updatedAt || '',
            musicLink: data.musicLink || ''
          }
        }) as DJ[]
        
        console.log('Processed DJs list:', djsList)
        setDJs(djsList)
      } catch (err) {
        console.error('Error fetching DJs:', err)
        if (err instanceof Error) {
          console.error('Error details:', {
            message: err.message,
            name: err.name,
            stack: err.stack
          })
        }
        setError('Failed to load DJs')
      } finally {
        setIsLoading(false)
      }
    }

    fetchDJs()
  }, [])

  const toggleComment = (djId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [djId]: !prev[djId]
    }))
  }

  if (isLoading) {
    return <div className="text-center py-8">Loading DJs...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata DJs
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find Bachata DJs near you.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <StateFilter
            selectedState={selectedState}
            onChange={setSelectedState}
            isLoading={isGeoLoading}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {filteredDJs.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No DJs found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredDJs.map((dj) => (
              <DJCard key={dj.id} dj={dj} />
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

        {/* Submit Your DJ Card */}
        <div className="mt-12 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-6 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-2xl sm:text-3xl font-bold mb-3 sm:mb-4">
                Submit Your DJ Profile
              </h2>
              <p className="text-white/90 text-base sm:text-lg mb-4 sm:mb-6">
                Are you a Bachata DJ? Get featured in our directory and reach event organizers across Australia!
              </p>
              <ul className="space-y-2 sm:space-y-3">
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of event organizers
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your DJ services to the dance community
                </li>
                <li className="flex items-center text-sm sm:text-base">
                  <svg className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with event organizers across Australia
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

        <DJSubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
        />
      </div>
    </div>
  )
}