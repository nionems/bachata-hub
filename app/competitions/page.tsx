"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, MapPin, Users, Trophy, Clock } from "lucide-react"
import Link from "next/link"
import { StateFilter } from '@/components/ui/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'

// Hardcoded competitions data
const competitionsData = [
  {
    id: "1",
    name: "Australian Bachata Championships",
    date: "June 15-16, 2024",
    location: "Sydney",
    state: "NSW",
    address: "Sydney Olympic Park",
    eventLink: "6:00 PM",
    price: "$50",
    registrationLink: "https://example.com/register",
    imageUrl: "/competitions/sydney-comp.jpg",
    comment: "Australia's premier Bachata competition featuring amateur and professional divisions.",
    googleMapLink: "https://goo.gl/maps/example"
  },
  {
    id: "2",
    name: "Melbourne Bachata Showdown",
    date: "July 20-21, 2024",
    location: "Melbourne",
    state: "VIC",
    address: "Melbourne Convention Centre",
    eventLink: "7:00 PM",
    price: "$45",
    registrationLink: "https://example.com/register",
    imageUrl: "/competitions/melbourne-comp.jpg",
    comment: "Victoria's largest Bachata competition with special guest judges.",
    googleMapLink: "https://goo.gl/maps/example"
  },
  // Add more hardcoded competitions as needed
]

interface Competition {
  id: string;
  name: string;
  state: string;
  // ... other competition properties
}

export default function CompetitionsPage() {
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredCompetitions } = useStateFilter(competitions)

  useEffect(() => {
    const fetchCompetitions = async () => {
      // ... (similar fetch logic using 'competitions' collection)
    }

    fetchCompetitions()
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Bachata Competitions
          </h1>
          <p className="text-xl text-gray-600">
            Find dance competitions across Australia
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
              {filteredCompetitions.map((competition) => (
                <Link href={`/competitions/${competition.id}`} key={competition.id}>
                  <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                    <div className="relative h-48">
                      <img
                        src={competition.imageUrl}
                        alt={competition.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardHeader>
                      <CardTitle>{competition.name}</CardTitle>
                      <CardDescription className="flex items-center gap-4">
                        <span className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {competition.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {competition.eventLink}
                        </span>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="flex items-center text-gray-600">
                          <MapPin className="h-4 w-4 mr-1" />
                          {competition.location}
                        </div>
                        <p className="text-gray-600">{competition.comment}</p>
                        <Button
                          className="w-full bg-green-600 hover:bg-green-700"
                          onClick={(e) => {
                            e.preventDefault()
                            window.open(competition.registrationLink, "_blank", "noopener,noreferrer")
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
            <div className="text-center py-12">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Past Competitions</h3>
              <p className="text-gray-600">
                Results and highlights from previous competitions will be available here soon.
              </p>
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

        {/* Add this section before the final closing div */}
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