"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Clock, Search } from "lucide-react"
import Link from "next/link"
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { CompetitionCard } from '@/components/CompetitionCard'
import { Competition } from '@/types/competition'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { LoadingSpinner } from '@/components/loading-spinner'
import { CompetitionSubmissionForm } from '@/components/CompetitionSubmissionForm'
import { Input } from "@/components/ui/input"

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  const [isSubmissionFormOpen, setIsSubmissionFormOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  
  const { selectedState, setSelectedState, filteredItems: filteredCompetitions } = useStateFilter(competitions, { useGeolocation: false })

  // Filter competitions based on search term
  const searchFilteredCompetitions = filteredCompetitions.filter(competition =>
    competition.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const toggleComment = (id: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [id]: !prev[id]
    }))
  }

  useEffect(() => {
    const fetchCompetitions = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const competitionsCollection = collection(db, 'competitions')
        const competitionsSnapshot = await getDocs(competitionsCollection)
        const competitionsList = competitionsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Competition[]
        
        // Sort competitions by date
        const sortedCompetitions = competitionsList.sort((a, b) => {
          const dateA = new Date(a.startDate).getTime()
          const dateB = new Date(b.startDate).getTime()
          return dateA - dateB
        })
        
        setCompetitions(sortedCompetitions)
      } catch (err) {
        console.error('Error fetching competitions:', err)
        setError('Failed to load competitions')
      } finally {
        setIsLoading(false)
      }
    }

    fetchCompetitions()
  }, [])

  if (isLoading) {
    return <LoadingSpinner message="Loading competitions..." />
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
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Competitions
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Explore dance competitions across Australia for all levels and styles.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
          <div className="flex flex-col sm:flex-row gap-0 sm:gap-4">
            <StateFilter
              selectedState={selectedState}
              onChange={setSelectedState}
            />
            <div className="flex gap-2 w-full sm:w-auto -mt-1 sm:mt-0">
              <Input
                type="text"
                placeholder="Search competitions..."
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

        <Tabs defaultValue="upcoming" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4 md:mb-8">
            <TabsTrigger value="upcoming">Upcoming Competitions</TabsTrigger>
            <TabsTrigger value="past">Past Competitions</TabsTrigger>
          </TabsList>

          <TabsContent value="upcoming" className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {searchFilteredCompetitions
                .filter(comp => comp.status === 'Upcoming')
                .map((competition) => (
                  <CompetitionCard key={competition.id} competition={competition} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="past" className="w-full">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 md:gap-6">
              {searchFilteredCompetitions
                .filter(comp => comp.status === 'Completed')
                .map((competition) => (
                  <CompetitionCard key={competition.id} competition={competition} />
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
              <Button
                onClick={() => setIsSubmissionFormOpen(true)}
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
              >
                Submit Competition
              </Button>
            </div>
          </div>
        </div>

        <CompetitionSubmissionForm
          isOpen={isSubmissionFormOpen}
          onClose={() => setIsSubmissionFormOpen(false)}
        />
      </div>
    </div>
  )
} 