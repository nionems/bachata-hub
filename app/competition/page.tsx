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

export default function CompetitionPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredCompetitions } = useStateFilter(competitions)

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
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Bachata Competitions
          </h1>
          <p className="text-xl text-gray-600">n
          Explore dance competitions across Australia for all levels and styles.
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="upcoming">Upcoming Competitions</TabsTrigger>
            <TabsTrigger value="past">Past Competitions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">Upcoming Competitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCompetitions
                .filter(comp => comp.status === 'Upcoming')
                .map((competition) => (
                <Link href={`/competition/${competition.id}`} key={competition.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={competition.imageUrl || '/placeholder.svg'}
                        alt={competition.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{competition.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {competition.danceStyles}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {competition.location}, {competition.state}
                        </div>
                        <p className="text-gray-600">{competition.comment}</p>
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
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.eventLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          Register Now
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="w-full">
            <h2 className="text-2xl font-bold text-primary mb-4">Past Competitions</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredCompetitions
                .filter(comp => comp.status === 'Completed')
                .map((competition) => (
                <Link href={`/competition/${competition.id}`} key={competition.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={competition.imageUrl || '/placeholder.svg'}
                        alt={competition.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{competition.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {competition.danceStyles}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {competition.location}, {competition.state}
                        </div>
                        <p className="text-gray-600">{competition.comment}</p>
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
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.eventLink, "_blank", "noopener,noreferrer")
                          }}
                        >
                          View Results
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
} 