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
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-4">
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
                  <h2 className="text-xl sm:text-2xl font-bold text-primary mb-2">{instructor.name}</h2>
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


        <div className="mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-6 md:mb-0 md:mr-8">
              <h2 className="text-3xl font-bold mb-4">
                Join Our Instructor Directory
              </h2>
              <p className="text-white/90 text-lg mb-6">
                Are you a Bachata instructor? Get featured in our directory and connect with students across Australia!
              </p>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Showcase your teaching experience
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
                  Grow your teaching business
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
