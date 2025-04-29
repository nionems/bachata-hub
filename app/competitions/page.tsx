"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'

interface Competition {
  id: string
  name: string
  organizer: string
  contactInfo: string
  email: string
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
  categories: string[]
  level: string[]
  status: string
  socialLink: string
  createdAt: string
  updatedAt: string
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  
  const { selectedState, setSelectedState, filteredItems: filteredCompetitions } = useStateFilter(competitions)

  const toggleComment = (id: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  useEffect(() => {
    const fetchCompetitions = async () => {
      try {
        const response = await fetch('/api/competitions')
        if (!response.ok) {
          throw new Error('Failed to fetch competitions')
        }
        const data = await response.json()
        setCompetitions(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch competitions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading competitions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()}>Try Again</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-2 md:px-4 py-4 md:py-8">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Bachata Competitions
          </h1>
          <p className="text-lg md:text-xl text-gray-600">
            Find dance competitions across Australia
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-8">
            <TabsTrigger value="upcoming">Upcoming Competitions</TabsTrigger>
            <TabsTrigger value="past">Past Competitions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {filteredCompetitions
                .filter(comp => comp.status === 'Upcoming')
                .map((competition) => (
                <Card key={competition.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <img
                      src={competition.imageUrl || '/placeholder.svg'}
                        alt={competition.name}
                      className="w-full h-full object-contain"
                      />
                    </div>
                  <CardHeader className="p-2 md:p-3">
                    <CardTitle className="truncate text-lg md:text-xl text-center">{competition.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      <span className="flex items-center justify-center">
                          <Calendar className="h-4 w-4 mr-1" />
                        {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                      <span className="flex items-center justify-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {competition.location}, {competition.state}
                        </span>
                      </CardDescription>
                    </CardHeader>
                  <CardContent className="p-2 md:p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <span className="font-semibold">Price:</span>
                        <span className="ml-2">{competition.price || 'Contact for pricing'}</span>
                      </div>
                      <div className="relative">
                        <p className={`text-gray-600 ${!expandedComments[competition.id] ? 'line-clamp-2' : ''}`}>
                          {competition.comment}
                        </p>
                        {competition.comment && competition.comment.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              toggleComment(competition.id)
                            }}
                            className="text-primary hover:text-primary/80 text-sm mt-1"
                          >
                            {expandedComments[competition.id] ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {competition.categories.map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {competition.level.map((level) => (
                          <span
                            key={level}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {level}
                          </span>
                        ))}
                        </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.eventLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          Competition Link
                        </Button>
                        <Button
                          className="flex-1 bg-secondary hover:bg-secondary/90"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.ticketLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          Results
                        </Button>
                      </div>
                      </div>
                    </CardContent>
                  </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {filteredCompetitions
                .filter(comp => comp.status === 'Completed')
                .map((competition) => (
                <Card key={competition.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative aspect-video">
                    <img
                      src={competition.imageUrl || '/placeholder.svg'}
                      alt={competition.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <CardHeader className="p-2 md:p-3">
                    <CardTitle className="truncate text-lg md:text-xl text-center">{competition.name}</CardTitle>
                    <CardDescription className="flex flex-col gap-2">
                      <span className="flex items-center justify-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                      </span>
                      <span className="flex items-center justify-center">
                        <MapPin className="h-4 w-4 mr-1" />
                        {competition.location}, {competition.state}
                      </span>
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-2 md:p-3">
                    <div className="space-y-2">
                      <div className="flex items-center justify-center">
                        <span className="font-semibold">Price:</span>
                        <span className="ml-2">{competition.price || 'Contact for pricing'}</span>
                      </div>
                      <div className="relative">
                        <p className={`text-gray-600 ${!expandedComments[competition.id] ? 'line-clamp-2' : ''}`}>
                          {competition.comment}
                        </p>
                        {competition.comment && competition.comment.length > 100 && (
                          <button
                            onClick={(e) => {
                              e.preventDefault()
                              toggleComment(competition.id)
                            }}
                            className="text-primary hover:text-primary/80 text-sm mt-1"
                          >
                            {expandedComments[competition.id] ? 'Show Less' : 'Read More'}
                          </button>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {competition.categories.map((category) => (
                          <span
                            key={category}
                            className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {competition.level.map((level) => (
                          <span
                            key={level}
                            className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                          >
                            {level}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-primary hover:bg-primary/90"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.eventLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          Competition Link
                        </Button>
                        <Button
                          className="flex-1 bg-secondary hover:bg-secondary/90"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.ticketLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          Results
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-12 bg-green-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-primary mb-4">Competition Guidelines</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">Registration Process</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Click "Register Now" on your chosen competition</li>
                <li>Fill out the registration form with your details</li>
                <li>Select your competition category</li>
                <li>Complete payment if required</li>
                <li>Receive confirmation email with details</li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Competition Rules</h3>
              <ul className="list-disc list-inside space-y-2 text-gray-600">
                <li>Arrive at least 30 minutes before start time</li>
                <li>Bring valid ID for registration</li>
                <li>Follow dress code requirements</li>
                <li>Respect judges and fellow competitors</li>
                <li>Have fun and enjoy the experience!</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Submit Your Competition
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you organizing a Bachata competition? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance competitors
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your competition to the dance community
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