"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, Instagram, Facebook, Music, Search } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { DanceStyleFilter } from '@/components/DanceStyleFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { DJSubmissionForm } from "@/components/DJSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { DJCard } from '@/components/DJCard'
import { GridSkeleton } from '@/components/loading-skeleton'
import { toast } from '@/components/ui/use-toast'
import { Dj } from '@/types/dj'
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function DJsPage() {
  const [djs, setDJs] = useState<Dj[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDanceStyle, setSelectedDanceStyle] = useState("all")
  const [availableDanceStyles, setAvailableDanceStyles] = useState<string[]>([])
  
  const { selectedState, setSelectedState, filteredItems: filteredDJs, isGeoLoading } = useStateFilter(djs, { useGeolocation: true })

  // Filter DJs based on search term and dance style
  const searchFilteredDJs = filteredDJs.filter(dj => {
    const matchesSearch = dj.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDanceStyle = selectedDanceStyle === 'all' || 
      (dj.danceStyles && dj.danceStyles.some(style => 
        style.toLowerCase() === selectedDanceStyle.toLowerCase()
      ))
    return matchesSearch && matchesDanceStyle
  })

  useEffect(() => {
    const fetchDJs = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const response = await fetch('/api/djs')
        if (!response.ok) {
          throw new Error('Failed to fetch DJs')
        }
        const djsList = await response.json() as Dj[]
        
        // Sort DJs alphabetically by name
        const sortedDJs = djsList.sort((a, b) => 
          a.name.localeCompare(b.name)
        )
        
        setDJs(sortedDJs)
      } catch (err) {
        console.error('Error fetching DJs:', err)
        setError('Failed to load DJs')
        toast({
          title: "Error",
          description: "Failed to load DJs. Please try again later.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchDJs()
  }, [])

  // Extract available dance styles from DJs in the selected state
  useEffect(() => {
    const styles = new Set<string>()
    
    // Filter DJs by selected state first
    const stateFilteredDJs = selectedState === 'all' 
      ? djs 
      : djs.filter(dj => dj.state === selectedState)
    
    stateFilteredDJs.forEach(dj => {
      if (dj.danceStyles && Array.isArray(dj.danceStyles)) {
        dj.danceStyles.forEach(style => styles.add(style))
      }
    })
    setAvailableDanceStyles(Array.from(styles).sort())
  }, [djs, selectedState])

  // Auto-select Bachata if available, reset when state changes
  useEffect(() => {
    if (availableDanceStyles.includes('Bachata')) {
      setSelectedDanceStyle('Bachata')
    } else {
      setSelectedDanceStyle('all')
    }
  }, [availableDanceStyles, selectedState])

  const toggleComment = (djId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [djId]: !prev[djId]
    }))
  }

  if (isLoading) {
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
            <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
              <StateFilter
                selectedState={selectedState}
                onChange={setSelectedState}
                isLoading={isGeoLoading}
              />
              <div className="flex gap-2 w-full sm:w-auto -mt-1 sm:mt-0">
                <Input
                  type="text"
                  placeholder="Search DJs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full sm:w-[200px] bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-md"
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSearchTerm("")}
                  className="shrink-0 border-gray-200 hover:bg-gray-50 hover:text-primary rounded-md"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
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
          <h2 className="text-2xl font-bold text-red-500 mb-4">Error Loading DJs</h2>
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
            Bachata DJs
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find Bachata DJs near you.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            <StateFilter
              selectedState={selectedState}
              onChange={setSelectedState}
              isLoading={isGeoLoading}
            />
            <div className="w-full sm:w-48">
              <Select value={selectedDanceStyle} onValueChange={setSelectedDanceStyle}>
                <SelectTrigger className="w-full bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
                  <SelectValue placeholder="Dance Style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Dance Styles</SelectItem>
                  {availableDanceStyles.map((style) => (
                    <SelectItem key={style} value={style}>
                      {style}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2 w-full sm:w-auto -mt-1 sm:mt-0">
              <Input
                type="text"
                placeholder="Search DJs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full sm:w-[200px] bg-white border-gray-200 focus:border-primary focus:ring-primary rounded-md"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => setSearchTerm("")}
                className="shrink-0 border-gray-200 hover:bg-gray-50 hover:text-primary rounded-md"
              >
                <Search className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          {/* Add Your DJ Button */}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setIsSubmissionFormOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary text-white px-6 py-3 rounded-full font-semibold hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Add Your DJ
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {searchFilteredDJs.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No DJs found 
              {selectedState !== 'all' && ` in ${selectedState}`}
              {selectedDanceStyle !== 'All Dance Styles' && ` for ${selectedDanceStyle}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          ) : (
            searchFilteredDJs.map((dj) => (
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