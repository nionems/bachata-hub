"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Calendar, MapPin, DollarSign, Users, Ticket, Hotel, CheckCircle, Info, Clock, ExternalLink, X, Music, Instagram, Facebook, Navigation, ChevronDown, ChevronUp } from "lucide-react"
import { useState, useEffect, useMemo, useCallback, Suspense } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from '@/components/StateFilter'
import { DanceStyleFilter } from '@/components/DanceStyleFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { FestivalSubmissionForm } from "@/components/FestivalSubmissionForm"
import { ContactForm } from "@/components/ContactForm"
import { ImageModal } from "@/components/ImageModal"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"
import { FestivalCard } from '@/components/FestivalCard'
import Image from "next/image"
import { GridSkeleton } from "@/components/loading-skeleton"
import { LoadingSpinner } from "@/components/loading-spinner"
import { DANCE_STYLES } from "@/lib/constants"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { PerformanceMonitor } from "@/components/PerformanceMonitor"

interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  country?: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  danceStyles: string[] | string
  imageUrl: string
  description?: string
  ambassadorCode?: string
  googleMapLink: string
  festivalLink: string
  date: string
  startTime: string
  endTime: string
  time: string
  featured?: 'yes' | 'no'
  published?: boolean
  instagramLink?: string
  facebookLink?: string
}

// Lazy load festival cards to improve initial render
const LazyFestivalCard = ({ festival, onImageClick, expandedDescriptions, toggleDescription, dateHelpers }: any) => {
  const [imageLoaded, setImageLoaded] = useState(false)
  
  return (
    <Card className="overflow-hidden bg-white shadow-lg hover:shadow-xl transition-shadow duration-300 border-2 border-yellow-300">
      <div className="relative h-48 w-full overflow-hidden rounded-t-lg">
        {!imageLoaded && (
          <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
            <div className="w-8 h-8 border-2 border-gray-300 border-t-primary rounded-full animate-spin"></div>
          </div>
        )}
        <Image
          src={festival.imageUrl}
          alt={festival.name}
          fill
          className={`object-cover transition-transform duration-300 hover:scale-105 cursor-pointer ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onClick={(e) => onImageClick(e, festival)}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute top-2 right-2">
          <Badge className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white border-0 shadow-lg">
            ⭐ Featured
          </Badge>
        </div>
        
        {/* Social Media and Map Icons on Image */}
        {(festival.instagramLink || festival.facebookLink || festival.googleMapLink) && (
          <div className="absolute bottom-2 right-2 flex gap-1">
            {festival.instagramLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(festival.instagramLink, "_blank")
                }}
              >
                <Instagram className="h-4 w-4" />
              </Button>
            )}
            {festival.facebookLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(festival.facebookLink, "_blank")
                }}
              >
                <Facebook className="h-4 w-4" />
              </Button>
            )}
            {festival.googleMapLink && (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 bg-black/50 hover:bg-black/70 text-white backdrop-blur-sm"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(festival.googleMapLink, "_blank")
                }}
              >
                <Navigation className="h-4 w-4" />
              </Button>
            )}
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-semibold mb-2">{festival.name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <Calendar className="w-4 h-4 mr-1" />
          <span>{dateHelpers.formatDate(festival.startDate)}</span>
          {festival.endDate && festival.endDate !== festival.startDate && (
            <span className="mx-1">-</span>
          )}
          {festival.endDate && festival.endDate !== festival.startDate && (
            <span>{dateHelpers.formatDate(festival.endDate)}</span>
          )}
        </div>
        {festival.description && (
          <div className="mb-2">
            <div className={`text-sm text-gray-600 ${!expandedDescriptions[festival.id] ? 'line-clamp-2' : ''}`}>
              {festival.description}
            </div>
            {festival.description.length > 100 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleDescription(festival.id);
                }}
                className="text-primary hover:text-primary/80 text-xs mt-1 flex items-center gap-1"
              >
                {expandedDescriptions[festival.id] ? (
                  <>
                    Show Less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    Read More <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            )}
          </div>
        )}
        {festival.ambassadorCode && (
          <div className="mb-2">
            <Badge variant="secondary" className="bg-green-500/20 text-green-700 hover:bg-green-500/30">
              🎫 {festival.ambassadorCode}
            </Badge>
          </div>
        )}
        <div className="flex items-center justify-between text-gray-600 text-sm space-x-2">
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-1" />
            <span className="truncate">
              {festival.location}
              {festival.country === 'Australia' ? `, ${festival.state}` : festival.state && festival.state !== 'N/A' ? `, ${festival.state}` : ''}
              {festival.country && festival.country !== 'Australia' && `, ${festival.country}`}
            </span>
          </div>
          {festival.price && (
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1" />
              <span className="truncate">{festival.price}</span>
            </div>
          )}
        </div>
        {/* Dance Style Stickers */}
        {festival.danceStyles && (
          <div className="flex flex-wrap gap-1 mt-2">
            {(Array.isArray(festival.danceStyles) ? festival.danceStyles : festival.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)).slice(0, 3).map((style: string, index: number) => (
              <div 
                key={index}
                className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm"
              >
                {style}
              </div>
            ))}
            {(Array.isArray(festival.danceStyles) ? festival.danceStyles : festival.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)).length > 3 && (
              <div className="bg-green-500 text-white text-xs font-medium px-2 py-1 rounded-full shadow-sm">
                +{(Array.isArray(festival.danceStyles) ? festival.danceStyles : festival.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)).length - 3}
              </div>
            )}
          </div>
        )}
        
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
  )
}

export default function FestivalsPage() {
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isImageModalOpen, setIsImageModalOpen] = useState(false)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [selectedDanceStyle, setSelectedDanceStyle] = useState("all")
  const [availableDanceStyles, setAvailableDanceStyles] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<'australia' | 'international'>('australia')
  const [selectedCountry, setSelectedCountry] = useState("all")
  const [availableCountries, setAvailableCountries] = useState<string[]>([])
  const [expandedDescriptions, setExpandedDescriptions] = useState<{ [key: string]: boolean }>({})
  
  const { selectedState, setSelectedState, filteredItems: filteredFestivals } = useStateFilter(festivals, { useGeolocation: false })

  // Memoize callback functions to prevent unnecessary re-renders
  const handleImageClick = useCallback((e: React.MouseEvent, festival: Festival) => {
    e.stopPropagation()
    if (festival.imageUrl) {
      setSelectedImage({
        url: festival.imageUrl,
        title: festival.name
      })
      setIsImageModalOpen(true)
    }
  }, [])

  const handleCloseModal = useCallback(() => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  }, [])

  const toggleDescription = useCallback((festivalId: string) => {
    setExpandedDescriptions(prev => ({
      ...prev,
      [festivalId]: !prev[festivalId]
    }));
  }, [])

  // Optimized data fetching with error handling and timeout
  useEffect(() => {
    const fetchFestivals = async () => {
      setIsLoading(true)
      setError(null)
      
      try {
        // Add timeout to prevent hanging requests
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout
        
        const response = await fetch('/api/festivals?clearCache=true', {
          signal: controller.signal
        })
        
        clearTimeout(timeoutId)
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        const festivalsList = await response.json()
        setFestivals(festivalsList)
        console.log('Fetched festivals:', festivalsList.length, 'festivals')
      } catch (err) {
        console.error('Error fetching festivals:', err)
        if (err instanceof Error && err.name === 'AbortError') {
          setError('Request timed out. Please try again.')
        } else {
          setError('Failed to load festivals')
        }
      } finally {
        setIsLoading(false)
      }
    }

    fetchFestivals()
  }, [])

  // Optimized useEffect with debouncing for filter processing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const styles = new Set<string>()
      const countries = new Set<string>()
      
      // Extract countries from international festivals
      festivals.forEach(festival => {
        if (festival.country && festival.country !== 'Australia') {
          countries.add(festival.country)
        }
      })
      setAvailableCountries(Array.from(countries).sort())
      
      // Extract dance styles based on current filters
      let filteredFestivals = festivals
      
      if (activeTab === 'australia') {
        filteredFestivals = selectedState === 'all' 
          ? festivals.filter(festival => festival.country === 'Australia' || !festival.country)
          : festivals.filter(festival => festival.state === selectedState && (festival.country === 'Australia' || !festival.country))
      } else {
        if (selectedCountry === 'all') {
          filteredFestivals = festivals.filter(festival => festival.country && festival.country !== 'Australia')
        } else {
          filteredFestivals = festivals.filter(festival => festival.country === selectedCountry)
        }
      }
      
      filteredFestivals.forEach(festival => {
        if (festival.danceStyles && Array.isArray(festival.danceStyles)) {
          festival.danceStyles.forEach(style => styles.add(style))
        }
      })
      
      const availableStyles = Array.from(styles).sort()
      setAvailableDanceStyles(availableStyles)
      
      // Auto-select Bachata if available
      if (availableStyles.includes('Bachata')) {
        setSelectedDanceStyle('Bachata')
      } else {
        setSelectedDanceStyle('all')
      }
    }, 100) // Debounce for 100ms to prevent excessive processing

    return () => clearTimeout(timeoutId)
  }, [festivals, selectedState, activeTab, selectedCountry])

  // Memoized helper functions to avoid recalculation
  const dateHelpers = useMemo(() => {
    const currentYear = new Date().getFullYear()
    
    const isFutureDate = (dateString: string) => {
      if (dateString.includes("To Be Announced")) {
        return true
      }
      const yearMatch = dateString.match(/\d{4}/)
      if (!yearMatch) return true
      const year = Number.parseInt(yearMatch[0])
      return year >= currentYear
    }

    const getDateSortValue = (dateString: string) => {
      if (dateString.includes("To Be Announced")) {
        return Number.POSITIVE_INFINITY
      }
      try {
        const date = new Date(dateString)
        return date.getTime()
      } catch (error) {
        return Number.POSITIVE_INFINITY
      }
    }

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
        return dateString
      }
    }

    return { isFutureDate, getDateSortValue, formatDate }
  }, [])

  // Optimized filtering and sorting with early returns
  const { upcomingFestivals, featuredFestivals, regularFestivals } = useMemo(() => {
    if (festivals.length === 0) {
      return { upcomingFestivals: [], featuredFestivals: [], regularFestivals: [] }
    }
    
    // Pre-filter by country to reduce processing
    let filtered = festivals
    if (activeTab === 'australia') {
      filtered = festivals.filter(festival => festival.country === 'Australia' || !festival.country)
    } else {
      if (selectedCountry === 'all') {
        filtered = festivals.filter(festival => festival.country && festival.country !== 'Australia')
      } else {
        filtered = festivals.filter(festival => festival.country === selectedCountry)
      }
    }
    
    // Apply remaining filters
    filtered = filtered
      .filter((festival) => dateHelpers.isFutureDate(festival.startDate))
      .filter((festival) => selectedState === "all" || festival.state === selectedState)
      .filter((festival) => {
        if (selectedDanceStyle === 'all') return true;
        
        if (Array.isArray(festival.danceStyles)) {
          return festival.danceStyles.includes(selectedDanceStyle);
        } else if (typeof festival.danceStyles === 'string') {
          return festival.danceStyles === selectedDanceStyle;
        }
        return false;
      })
      .sort((a, b) => dateHelpers.getDateSortValue(a.startDate) - dateHelpers.getDateSortValue(b.startDate));

    const featured = filtered.filter(festival => festival.featured === 'yes');
    const regular = filtered.filter(festival => festival.featured !== 'yes');

    return { upcomingFestivals: filtered, featuredFestivals: featured, regularFestivals: regular };
  }, [festivals, selectedState, selectedDanceStyle, activeTab, selectedCountry, dateHelpers]);

  if (isLoading) {
    return <LoadingSpinner message="Loading festivals..." />
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
          <p className="text-base sm:text-xl text-gray-600 mb-6">
            Discover amazing Bachata festivals around the world.
          </p>
          
          {/* Country Tabs */}
          <div className="flex justify-center mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-full p-1 shadow-lg border border-gray-200">
              <button
                onClick={() => {
                  setActiveTab('australia')
                  setSelectedState('all')
                  setSelectedCountry('all')
                  setSelectedDanceStyle('all')
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  activeTab === 'australia'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                🇦🇺 Australia
              </button>
              <button
                onClick={() => {
                  setActiveTab('international')
                  setSelectedState('all')
                  setSelectedCountry('all')
                  setSelectedDanceStyle('all')
                }}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 ${
                  activeTab === 'international'
                    ? 'bg-gradient-to-r from-primary to-secondary text-white shadow-md'
                    : 'text-gray-600 hover:text-primary hover:bg-gray-50'
                }`}
              >
                🌍 International
              </button>
            </div>
          </div>
        </div>

        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col gap-2 sm:flex-row sm:gap-4">
            {activeTab === 'australia' && (
              <StateFilter
                selectedState={selectedState}
                onChange={setSelectedState}
              />
            )}
            {activeTab === 'international' && availableCountries.length > 0 && (
              <div className="w-full sm:w-48">
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="w-full bg-white/80 border-primary/30 shadow-lg rounded-xl text-base font-semibold transition-all focus:ring-2 focus:ring-primary focus:border-primary">
                    <SelectValue placeholder="Country" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Countries</SelectItem>
                    {availableCountries.map((country) => (
                      <SelectItem key={country} value={country}>
                        {country}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
            <div className={`w-full ${activeTab === 'australia' ? 'sm:w-48' : availableCountries.length > 0 ? 'sm:w-48' : 'sm:w-64'}`}>
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
          </div>
          
          {/* Add Your Festival Button */}
          <div className="mt-4 flex justify-center">
            <Button
              onClick={() => setIsSubmissionFormOpen(true)}
              className="bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 text-white px-6 py-2 rounded-full font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              Add Your Festival
            </Button>
          </div>
        </div>

        {/* Featured Festivals Section */}
        {featuredFestivals.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-center mb-4 sm:mb-6 bg-gradient-to-r from-yellow-500 to-orange-500 bg-clip-text text-transparent">
              ⭐ Featured Festivals
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
              <Suspense fallback={<GridSkeleton count={3} />}>
                {featuredFestivals.map((festival) => (
                  <LazyFestivalCard
                    key={festival.id}
                    festival={festival}
                    onImageClick={handleImageClick}
                    expandedDescriptions={expandedDescriptions}
                    toggleDescription={toggleDescription}
                    dateHelpers={dateHelpers}
                  />
                ))}
              </Suspense>
            </div>
          </div>
        )}

        {/* Regular Festivals Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          {regularFestivals.length === 0 && featuredFestivals.length === 0 ? (
            <div className="col-span-full text-center py-6 sm:py-8 text-gray-500">
              No {activeTab === 'australia' ? 'Australian' : 'international'} festivals found 
              {selectedState !== 'all' && activeTab === 'australia' && ` in ${selectedState}`}
              {selectedCountry !== 'all' && activeTab === 'international' && ` in ${selectedCountry}`}
              {selectedDanceStyle !== 'all' && ` for ${selectedDanceStyle}`}
            </div>
          ) : (
            <Suspense fallback={<GridSkeleton count={6} />}>
              {regularFestivals.map((festival) => (
                <LazyFestivalCard
                  key={festival.id}
                  festival={festival}
                  onImageClick={handleImageClick}
                  expandedDescriptions={expandedDescriptions}
                  toggleDescription={toggleDescription}
                  dateHelpers={dateHelpers}
                />
              ))}
            </Suspense>
          )}
        </div>

        {/* Image Modal */}
        {isImageModalOpen && selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={handleCloseModal}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={handleCloseModal}
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
                Add Your Festival
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
        
        <PerformanceMonitor name="Festivals Page" />
      </div>
    </div>
  )
}
