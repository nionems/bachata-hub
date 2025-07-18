"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, Star, MapIcon, Share2, Instagram, Facebook } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { DanceStyleFilter } from '@/components/DanceStyleFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { SchoolSubmissionForm } from "@/components/SchoolSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { SchoolViewCard } from '@/components/SchoolViewCard'
import { School } from "@/types/school"
import { LoadingSpinner } from '@/components/loading-spinner'
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { DANCE_STYLES } from "@/lib/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

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
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDanceStyle, setSelectedDanceStyle] = useState("all")
  const [availableDanceStyles, setAvailableDanceStyles] = useState<string[]>([])
  
  const { selectedState, setSelectedState, filteredItems: filteredSchools, isGeoLoading } = useStateFilter(schools, { useGeolocation: true })

  // Filter schools based on search term and dance style
  const searchFilteredSchools = filteredSchools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesDanceStyle = selectedDanceStyle === 'all' || 
      (school.danceStyles && school.danceStyles.some(style => 
        style.toLowerCase() === selectedDanceStyle.toLowerCase()
      ))
    return matchesSearch && matchesDanceStyle
  })

  useEffect(() => {
    const fetchSchools = async () => {
      setIsLoading(true)
      setError(null)
      try {
        console.log('Fetching schools from API...')
        const response = await fetch('/api/schools')
        if (!response.ok) throw new Error('Failed to fetch schools')
        const schoolsList = await response.json()
        
        console.log('Fetched schools from API:', schoolsList.length)
        console.log('Sample school data:', schoolsList[0])
        console.log('Schools with social media:', schoolsList.filter((s: School) => s.instagramUrl || s.facebookUrl).map((s: School) => ({name: s.name, instagram: s.instagramUrl, facebook: s.facebookUrl})))
        
        // Sort schools alphabetically by name
        const sortedSchools = schoolsList.sort((a: School, b: School) => 
          a.name.localeCompare(b.name)
        )
        
        setSchools(sortedSchools)
      } catch (err) {
        console.error('Error fetching schools:', err)
        setError('Failed to load schools')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

  // Extract available dance styles from schools in the selected state
  useEffect(() => {
    const styles = new Set<string>()
    
    // Filter schools by selected state first
    const stateFilteredSchools = selectedState === 'all' 
      ? schools 
      : schools.filter(school => school.state === selectedState)
    
    stateFilteredSchools.forEach(school => {
      if (school.danceStyles && Array.isArray(school.danceStyles)) {
        school.danceStyles.forEach(style => styles.add(style))
      }
    })
    setAvailableDanceStyles(Array.from(styles).sort())
  }, [schools, selectedState])

  // Auto-select Bachata if available, reset when state changes
  useEffect(() => {
    if (availableDanceStyles.includes('Bachata')) {
      setSelectedDanceStyle('Bachata')
    } else {
      setSelectedDanceStyle('all')
    }
  }, [availableDanceStyles, selectedState])

  if (isLoading) {
    return <LoadingSpinner message="Loading schools..." />
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Schools
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find Bachata schools and classes near you.
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
                placeholder="Search schools..."
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

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
          {searchFilteredSchools.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No schools found 
              {selectedState !== 'all' && ` in ${selectedState}`}
              {selectedDanceStyle !== 'All Dance Styles' && ` for ${selectedDanceStyle}`}
              {searchTerm && ` matching "${searchTerm}"`}
            </div>
          ) : (
            searchFilteredSchools.map((school) => (
              <SchoolViewCard key={school.id} school={school} />
            ))
          )}
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
    </div>
  )
}

