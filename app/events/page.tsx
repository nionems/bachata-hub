"use client"

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Clock, Users, Info, Ticket, ExternalLink, ChevronDown, ChevronUp, X } from "lucide-react"
import { Calendar as UiCalendar } from '@/components/ui/calendar'
import Link from 'next/link'
import { StateFilter } from '@/components/StateFilter'
import { useStateFilter } from '@/hooks/useStateFilter'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase/config'
import { format } from "date-fns";
import { ContactForm } from "@/components/ContactForm"
import { EventSubmissionForm } from "@/components/EventSubmissionForm"
import CalendarMenu from "@/components/calendar-menu"
import { EventCard } from '@/components/EventCard'

interface Event {
  id: string
  name: string
  eventDate: string
  startTime: string
  endTime: string
  location: string
  city: string
  state: string
  description: string
  price?: string
  danceStyles?: string
  imageUrl?: string
  eventLink?: string
  ticketLink?: string
  comment?: string
  date?: string
  googleMapLink?: string
  isWeekly?: boolean
  recurrence?: string
  isWorkshop?: boolean
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedImage, setSelectedImage] = useState<{ url: string; title: string } | null>(null)
  const [isContactFormOpen, setIsContactFormOpen] = useState(false)
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({})
  
  const { selectedState, setSelectedState, filteredItems: filteredEvents, isGeoLoading, error: geoError } = useStateFilter(events)

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true)
      setError(null)
      try {
        const eventsCollection = collection(db, 'events')
        const eventsSnapshot = await getDocs(eventsCollection)
        const eventsList = eventsSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Event[]
        
        console.log('Fetched events from Firebase:', eventsList)
        setEvents(eventsList)
      } catch (err) {
        console.error('Error fetching events:', err)
        setError('Failed to load events')
      } finally {
        setIsLoading(false)
      }
    }

    fetchEvents()
  }, [])

  const toggleComment = (eventId: string) => {
    setExpandedComments(prev => ({
      ...prev,
      [eventId]: !prev[eventId]
    }))
  }

  if (isLoading) return <div className="text-center py-8">Loading events...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
        <div className="text-center mb-4 sm:mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Bachata Recurring Events
          </h1>
          <p className="text-base sm:text-xl text-gray-600">
            Find Bachata events near you.
          </p>
        </div>

        <div className="mb-4 sm:mb-8">
        <StateFilter
          selectedState={selectedState}
          onChange={setSelectedState}
            isLoading={isGeoLoading}
            error={geoError}
        />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredEvents.length === 0 ? (
            <div className="col-span-full text-center py-8 text-gray-500">
              No events found {selectedState !== 'all' && `in ${selectedState}`}
            </div>
          ) : (
            filteredEvents.map((event) => (
              <Card
                key={event.id}
                className="relative overflow-hidden h-80 sm:h-96 text-white cursor-pointer"
                onClick={() => event.imageUrl && setSelectedImage({ url: event.imageUrl, title: event.name })}
              >
                {/* Weekly Event Sticker */}
                {event.isWeekly && (
                  <div className="absolute top-3 right-3 z-20 bg-primary text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                    {event.recurrence && event.recurrence.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </div>
                )}

                {/* Dance Style Stickers */}
                {event.danceStyles && (
                  <div className="absolute top-12 right-3 z-20 flex flex-col gap-1">
                    {event.danceStyles.split(',').map((style, index) => (
                      <div 
                        key={index}
                        className="bg-primary/80 text-white text-xs font-semibold px-2 py-1 rounded-md shadow-lg"
                      >
                        {style.trim()}
                      </div>
                    ))}
                  </div>
                )}

                {/* Workshop Sticker */}
                {event.isWorkshop && (
                  <div className="absolute top-20 right-3 z-20 bg-yellow-500 text-black text-xs font-semibold px-2 py-1 rounded-md shadow-lg">
                    + Workshop
                  </div>
                )}

                {/* Full image background */}
                <div className="absolute inset-0 w-full h-full">
                <img
                  src={event.imageUrl}
                  alt={event.name}
                    className="w-full h-full object-cover object-center"
                />
                </div>

                {/* Dark overlay for readability */}
                <div className="absolute inset-0 bg-black bg-opacity-40 z-10" />

                {/* Bottom compact content */}
                <div className="absolute bottom-0 left-0 right-0 z-20 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-3 sm:p-4">
                  <h3 className="text-base sm:text-lg font-semibold">{event.name}</h3>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-200 mt-1">
                    <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                    {event.location}
                    {event.price && (
                      <span className="bg-yellow-500 text-black text-xs font-semibold px-2 py-0.5 rounded ml-2">
                        {event.price}
                      </span>
                    )}
                  </div>
                  {event.comment && (
                    <div className="mt-1">
                      <p className={`text-xs sm:text-sm text-gray-300 ${expandedComments[event.id] ? '' : 'line-clamp-1'}`}>
                        {event.comment}
                      </p>
                      {event.comment.length > 50 && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleComment(event.id);
                          }}
                          className="text-xs text-primary hover:text-primary/80 mt-1 flex items-center gap-1"
                        >
                          {expandedComments[event.id] ? (
                            <>
                              Show Less
                              <ChevronUp className="h-3 w-3" />
                        </>
                      ) : (
                            <>
                              Show More
                              <ChevronDown className="h-3 w-3" />
                            </>
                          )}
                        </button>
                      )}
                  </div>
                  )}
                  <div className="flex flex-col gap-1 mt-2">
                    <div className="grid grid-cols-2 gap-1">
                      {event.eventLink && (
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(event.eventLink, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>Event Link</span>
                        </Button>
                      )}
                      {event.googleMapLink && (
                        <Button
                          variant="outline"
                          className="w-full border-primary text-primary hover:bg-primary/10 text-xs h-7 sm:h-8 flex items-center justify-center gap-2"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(event.googleMapLink, '_blank');
                          }}
                        >
                          <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                          <span>View on Map</span>
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Image Modal */}
        {selectedImage && (
          <div 
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedImage(null)}
          >
            <button
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
              onClick={() => setSelectedImage(null)}
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

        {/* Calendar Section */}
        <CalendarMenu />

        {/* Submit Your Event Card */}
        <div className="mt-8 sm:mt-16 bg-gradient-to-r from-primary to-secondary rounded-xl shadow-xl overflow-hidden">
          <div className="p-4 sm:p-8 md:p-12 flex flex-col md:flex-row items-center justify-between">
            <div className="text-white mb-4 sm:mb-6 md:mb-0 md:mr-8">
              <h2 className="text-xl sm:text-3xl font-bold mb-2 sm:mb-4">
                Submit Your Event
              </h2>
              <p className="text-white/90 text-sm sm:text-lg mb-3 sm:mb-6">
                Are you organizing a Bachata event? Get featured in our directory and reach dancers across Australia!
              </p>
              <ul className="space-y-1 sm:space-y-3">
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Reach a wider audience of dance enthusiasts
                </li>
                <li className="flex items-center">
                  <svg className="w-6 h-6 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"/>
                  </svg>
                  Promote your event to the dance community
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
              <Button
                onClick={() => setIsContactFormOpen(true)}
                className="bg-white text-primary px-8 py-3 rounded-full font-semibold hover:bg-gray-50 transition-colors duration-200 text-center min-w-[200px]"
              >
                Contact Us
              </Button>
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-secondary text-white px-8 py-3 rounded-full font-semibold hover:bg-secondary/90 transition-colors duration-200 text-center"
              >
                Submit via Form
              </Button>
            </div>
          </div>
        </div>

        <ContactForm
          isOpen={isContactFormOpen}
          onClose={() => setIsContactFormOpen(false)}
        />

        <EventSubmissionForm
          isOpen={isFormOpen}
          onClose={() => setIsFormOpen(false)}
        />
      </div>
    </div>
  )
}
