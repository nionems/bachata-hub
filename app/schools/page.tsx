"use client"

import { useState, useEffect } from 'react'
import { School } from '@/types/school'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Star, Users, Clock, MapIcon } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'

export default function SchoolsPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [filteredSchools, setFilteredSchools] = useState<School[]>([])
  const [selectedState, setSelectedState] = useState<string>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Australian states array
  const states = [
    { value: 'all', label: 'All States' },
    { value: 'NSW', label: 'New South Wales' },
    { value: 'VIC', label: 'Victoria' },
    { value: 'QLD', label: 'Queensland' },
    { value: 'WA', label: 'Western Australia' },
    { value: 'SA', label: 'South Australia' },
    { value: 'TAS', label: 'Tasmania' },
    { value: 'ACT', label: 'Australian Capital Territory' },
    { value: 'NT', label: 'Northern Territory' },
  ]

  // Fetch schools from Firestore
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
        // Initialize filtered schools with all schools
        setFilteredSchools(schoolsList)
      } catch (err) {
        console.error('Error fetching schools:', err)
        setError('Failed to load schools')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSchools()
  }, [])

  // Filter schools when state selection changes
  useEffect(() => {
    console.log('Filtering schools for state:', selectedState)
    if (selectedState === 'all') {
      setFilteredSchools(schools)
    } else {
      const filtered = schools.filter(school => 
        school.state?.toUpperCase() === selectedState.toUpperCase()
      )
      setFilteredSchools(filtered)
    }
  }, [selectedState, schools])

  // Handle state filter change
  const handleStateChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    console.log('State selected:', e.target.value)
    setSelectedState(e.target.value)
  }

  if (isLoading) return <div className="text-center py-8">Loading schools...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
            Bachata Schools
          </h1>
          <p className="text-xl text-gray-600">
            Find Bachata dance schools across Australia
          </p>
        </div>

        <div className="mb-8">
          <label htmlFor="state-filter" className="block text-sm font-medium text-gray-700 mb-2">
            Filter by State
          </label>
          <select
            id="state-filter"
            value={selectedState}
            onChange={handleStateChange}
            className="mt-1 block w-full md:w-64 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            {states.map(state => (
              <option key={state.value} value={state.value}>
                {state.label}
              </option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredSchools.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No schools found {selectedState !== 'all' && `in ${states.find(s => s.value === selectedState)?.label}`}
            </div>
          ) : (
            filteredSchools.map((school) => (
              <SchoolCard key={school.id} school={school} />
            ))
          )}
        </div>

        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Submit Your School
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you running a dance school? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance students
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your school to the dance community
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
