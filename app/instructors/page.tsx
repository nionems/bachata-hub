"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { MapPin, Instagram, Facebook, Mail } from "lucide-react"
import { useState, useEffect } from "react"
import CollapsibleFilter from "@/components/collapsible-filter"
import { StateFilter } from "@/components/ui/StateFilter"
import { useStateFilter } from "@/hooks/useStateFilter"

interface Instructor {
  id: string
  name: string
  location: string
  state: string
  contact: string
  danceStyles: string
  imageUrl: string
  comment: string
  instagramLink: string
  facebookLink: string
  emailLink: string
}

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const { selectedState, setSelectedState, filteredItems: filteredInstructors } = useStateFilter(instructors)

  useEffect(() => {
    const fetchInstructors = async () => {
      try {
        const response = await fetch('/api/instructors')
        if (!response.ok) throw new Error('Failed to fetch instructors')
        const data = await response.json()
        setInstructors(data)
      } catch (err) {
        setError('Failed to load instructors')
        console.error(err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchInstructors()
  }, [])

  if (isLoading) {
    return <div className="text-center py-8">Loading instructors...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center py-8">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-yellow-500 bg-clip-text text-transparent mb-4">
            Bachata Instructors
          </h1>
          <p className="text-xl text-gray-600">
            Find Bachata instructors across Australia
          </p>
        </div>

        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
        />

        <div className="grid grid-cols-1 gap-6 sm:gap-8 lg:gap-12 mb-12">
          {filteredInstructors.map((instructor) => (
            <Card
              key={instructor.id}
              className="overflow-hidden border-0 shadow-lg"
            >
              <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
                <div className="md:col-span-1 relative">
                  <div className="h-48 sm:h-full">
                    <img
                      src={instructor.imageUrl || "/placeholder.svg"}
                      alt={instructor.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
                <div className="md:col-span-2 p-4 sm:p-6">
                  <h2 className="text-xl sm:text-2xl font-bold text-green-700 mb-2">{instructor.name}</h2>
                  <div className="flex flex-wrap gap-2 sm:gap-4 mb-3 sm:mb-4">
                    <div className="flex items-center text-gray-600 text-sm sm:text-base">
                      <MapPin className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                      <span>{instructor.location}, {instructor.state}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 text-sm sm:text-base mb-3 sm:mb-4">
                    {instructor.comment}
                  </p>

                  <div className="mb-3 sm:mb-4">
                    <h3 className="text-base sm:text-lg font-semibold mb-1 sm:mb-2">Dance Styles</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {instructor.danceStyles.split(',').map((style, index) => (
                        <span
                          key={index}
                          className="bg-gray-100 text-gray-800 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-xs sm:text-sm"
                        >
                          {style.trim()}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 sm:gap-3 mt-4 sm:mt-6">
                    {instructor.instagramLink && (
                      <a
                        href={instructor.instagramLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-pink-600 hover:bg-pink-700 text-white text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <Instagram className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Instagram
                        </Button>
                      </a>
                    )}

                    {instructor.facebookLink && (
                      <a
                        href={instructor.facebookLink}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <Facebook className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Facebook
                        </Button>
                      </a>
                    )}

                    {instructor.emailLink && (
                      <a
                        href={`mailto:${instructor.emailLink}`}
                      >
                        <Button
                          size="sm"
                          variant="outline"
                          className="border-gray-500 text-gray-600 hover:bg-gray-50 text-xs sm:text-sm h-8 sm:h-10"
                        >
                          <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
                          Contact
                        </Button>
                      </a>
                    )}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredInstructors.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No instructors found in this state.
          </div>
        )}

        <div className="bg-gradient-to-r from-green-600 to-yellow-500 rounded-lg p-4 sm:p-8 text-white text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Are you a Bachata Instructor?</h2>
          <p className="text-base sm:text-lg mb-4 sm:mb-6 max-w-2xl mx-auto">
            Join our directory to connect with students and promote your classes across Australia.
          </p>
          <Button size="sm" className="bg-white text-green-700 hover:bg-gray-100 sm:text-base">
            Join as Instructor
          </Button>
        </div>
      </div>
    </div>
  )
}
