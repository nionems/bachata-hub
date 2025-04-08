"use client"

import { useState, useEffect } from 'react'
import { School } from '@/types/school'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, Users, Clock, MapIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedState, setSelectedState] = useState("all")
  
  const states = [
    { value: "all", label: "All States" },
    { value: "nsw", label: "New South Wales" },
    { value: "vic", label: "Victoria" },
    { value: "qld", label: "Queensland" },
    { value: "wa", label: "Western Australia" },
  ]

  useEffect(() => {
    fetchSchools()
  }, [])

  const fetchSchools = async () => {
    try {
      const response = await fetch('/api/schools')
      if (!response.ok) throw new Error('Failed to fetch schools')
      const data = await response.json()
      setSchools(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-8 text-center">Loading schools...</div>
  if (error) return <div className="p-8 text-center text-red-500">Error: {error}</div>

  const allSchools = schools.map(school => ({
    ...school,
    state: school.state?.toLowerCase() || 'unknown'
  }))

  const filteredSchools = selectedState === "all" 
    ? allSchools 
    : allSchools.filter(school => school.state === selectedState)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-4">
            Bachata Schools
          </h1>
          <p className="text-xl text-gray-600">
            Find Bachata dance schools across Australia
          </p>
        </div>

        <div className="flex justify-center flex-wrap gap-2 mb-8">
          {['All', 'NSW', 'VIC', 'QLD', 'WA', 'SA', 'TAS', 'ACT', 'NT'].map((state) => (
            <button
              key={state}
              onClick={() => setSelectedState(state)}
              className={`px-6 py-2 rounded-full transition-colors duration-200 ${
                selectedState === state
                  ? 'bg-green-600 text-white'
                  : 'bg-green-100 text-green-700 hover:bg-green-200'
              }`}
            >
              {state}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.map((school) => (
            <SchoolCard key={school.id} school={school} />
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-green-600 to-yellow-400 rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Submit Your Dance School
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you a dance school owner? Get featured in our directory and reach students across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Increase your school's visibility
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Connect with potential students
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Join Australia's dance education network
                </li>
              </ul>
            </div>
            <div className="flex flex-col space-y-4">
              <a
                href="mailto:contact@bachata.au"
                className="bg-white text-green-600 px-8 py-3 rounded-full font-semibold hover:bg-green-50 transition-colors duration-200 text-center min-w-[200px]"
              >
                Contact Us
              </a>
              <a
                href="https://forms.gle/your-google-form-link"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-yellow-400 text-green-900 px-8 py-3 rounded-full font-semibold hover:bg-yellow-500 transition-colors duration-200 text-center"
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

function SchoolCard({ school }: { school: School }) {
  return (
    <Card className="overflow-hidden">
      <div className="relative h-48">
        <img
          src={school.imageUrl}
          alt={school.name}
          className="w-full h-full object-cover"
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
      <CardHeader>
        <CardTitle>{school.name}</CardTitle>
        <CardDescription className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          {school.location}, {school.state}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{school.address}</p>
        <div className="space-y-2">
          {school.contactInfo && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="h-4 w-4" />
              {school.contactInfo}
            </div>
          )}
          {Array.isArray(school.danceStyles) && school.danceStyles.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Clock className="h-4 w-4" />
              {school.danceStyles.join(", ")}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <MapIcon className="h-4 w-4" />
          {school.address}
        </div>
        <div className="flex flex-wrap gap-2">
          {school.website && (
            <Button variant="outline" size="sm" asChild>
              <a href={school.website} target="_blank" rel="noopener noreferrer">
                Website
              </a>
            </Button>
          )}
          {school.googleReviewsUrl && (
            <Button variant="outline" size="sm" asChild>
              <a href={school.googleReviewsUrl} target="_blank" rel="noopener noreferrer">
                Reviews
              </a>
            </Button>
          )}
        </div>
      </CardFooter>
    </Card>
  )
}
