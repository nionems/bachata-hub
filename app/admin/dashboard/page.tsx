'use client'

import { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { getWeekEvents } from '@/lib/calendar'
import { formatEvents } from '@/utils/formatEvents'



// Add Event type
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
}

// Add Festival interface
interface Festival {
  id: string
  name: string
  startDate: string
  endDate: string
  location: string
  state: string
  price: string
  danceStyles: string
  imageUrl: string
}

// Add Instructor interface
interface Instructor {
  id: string
  name: string
  location: string
  state: string
  contact: string
  danceStyles: string
  imageUrl: string
  instagramLink?: string
  facebookLink?: string
  emailLink?: string
}

interface Shop {
  id: string;
  name: string;
  location: string;
  state: string;
  address: string;
  googleReviewLink: string;
  websiteLink: string;
  imageUrl: string;
  comment: string;
}

// Add DJ interface
interface DJ {
  id: string
  name: string
  location: string
  state: string
  contact: string
  musicStyles: string
  imageUrl: string
  comment: string
  instagramLink: string
  facebookLink: string
  emailLink: string
}

export default function AdminDashboard() {
  const [schools, setSchools] = useState<School[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [djs, setDJs] = useState<DJ[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('schools')
  const router = useRouter()

  // useEffect(() => {
  //   checkAuth()
  // }, [checkAuth])

  

  useEffect(() => {
    if (activeTab === 'schools') {
      fetchSchools()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'events') {
      fetchDbEvents()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'festivals') {
      fetchFestivals()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'instructors') {
      fetchInstructors()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'djs') {
      fetchDJs()
    }
  }, [activeTab])

  useEffect(() => {
    const loadShops = async () => {
      try {
        const shopsData = await fetchShops()
        setShops(shopsData)
      } catch (error) {
        console.error('Error fetching shops:', error)
      }
    }
    loadShops()
  }, [])

  // const checkAuth = async () => {
  //   try {
  //     const response = await fetch('/api/auth/check', {
  //       credentials: 'include'
  //     })
      
  //     if (!response.ok) {
  //       router.replace('/admin/login')
  //       return
  //     }

  //     // Only fetch schools if authenticated
  //     fetchSchools()
  //   } catch (err) {
  //     router.replace('/admin/login')
  //   }
  // }
  

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Force a complete page reload and redirect
      window.location.href = '/admin/login'
    } catch (err) {
      console.error('Logout failed:', err)
      setError('Failed to logout. Please try again.')
    }
  }

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

  const fetchDbEvents = async () => {
    setIsLoading(true);
    setError(null);
    console.log("Admin Dashboard: Attempting to fetch events from Firestore...");

    try {
      // Use the client SDK 'db' instance
      const eventsCollectionRef = collection(db, 'events');
      // Optional: Add ordering, e.g., orderBy('eventDate', 'asc')
      // const q = query(eventsCollectionRef, orderBy('eventDate', 'asc'));
      // const eventsSnapshot = await getDocs(q);
      const eventsSnapshot = await getDocs(eventsCollectionRef);

      const fetchedEvents = eventsSnapshot.docs.map(doc => {
        const data = doc.data();
        // Convert Firestore Timestamps to string/Date if necessary for the Event interface
        // Example: Assuming eventDate is stored as a string 'YYYY-MM-DD'
        return {
          id: doc.id,
          ...data,
          // Ensure data matches the Event interface structure
          eventDate: data.eventDate, // Adjust if stored as Timestamp
          startTime: data.startTime, // Adjust if stored as Timestamp
          endTime: data.endTime,     // Adjust if stored as Timestamp
        } as Event; // Assert type
      });

      console.log(`Admin Dashboard: Successfully fetched ${fetchedEvents.length} events from Firestore.`);
      setEvents(fetchedEvents);

    } catch (err) {
      console.error("Admin Dashboard: >>> Error caught fetching Firestore events <<<");
      console.error("Admin Dashboard: Error details:", err);
      setError(`Failed to fetch events from database. ${err instanceof Error ? `Details: ${err.message}` : 'Unknown error'}`);
      setEvents([]); // Clear events on error
    } finally {
      setIsLoading(false);
      console.log("Admin Dashboard: fetchDbEvents execution finished.");
    }
  };

  const fetchFestivals = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/festivals')
      if (!response.ok) throw new Error('Failed to fetch festivals')
      const data = await response.json()
      setFestivals(data)
    } catch (err) {
      setError('Failed to load festivals')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchInstructors = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/instructors')
      if (!response.ok) throw new Error('Failed to fetch instructors')
      const data = await response.json()
      console.log('Fetched instructors:', data) // Debug log
      setInstructors(data)
    } catch (err) {
      console.error('Error fetching instructors:', err)
      setError('Failed to load instructors')
    } finally {
      setIsLoading(false)
    }
  }

  const fetchShops = async () => {
    const shopsCollection = collection(db, 'shops')
    const shopsSnapshot = await getDocs(shopsCollection)
    return shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Shop[]
  }

  const fetchDJs = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/djs')
      if (!response.ok) throw new Error('Failed to fetch DJs')
      const data = await response.json()
      setDJs(data)
    } catch (err) {
      console.error('Error fetching DJs:', err)
      setError('Failed to load DJs')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string, schoolName: string) => {
    // Show confirmation dialog
    const isConfirmed = window.confirm(`Are you sure you want to delete "${schoolName}"? This action cannot be undone.`)
    
    if (!isConfirmed) {
      return // User cancelled the deletion
    }

    try {
      const response = await fetch(`/api/schools/${id}`, {
        method: 'DELETE',
      })
      
      if (!response.ok) {
        throw new Error('Failed to delete school')
      }

      // Remove the school from the state
      setSchools(schools.filter(school => school.id !== id))
      
      // Show success message
      alert(`"${schoolName}" has been successfully deleted.`)
    } catch (err) {
      console.error('Delete failed:', err)
      setError('Failed to delete school. Please try again.')
    }
  }

  const handleDeleteEvent = async (eventId: string) => {
    if (!confirm('Are you sure you want to delete this event?')) return

    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete event')
      
      // Refresh events list
      fetchDbEvents()
    } catch (err) {
      console.error('Failed to delete event:', err)
      setError('Failed to delete event')
    }
  }

  const handleDeleteFestival = async (festivalId: string) => {
    if (!confirm('Are you sure you want to delete this festival?')) return

    try {
      const response = await fetch(`/api/festivals/${festivalId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete festival')
      
      // Refresh festivals list
      fetchFestivals()
    } catch (err) {
      console.error('Failed to delete festival:', err)
      setError('Failed to delete festival')
    }
  }

  const handleDeleteInstructor = async (instructorId: string) => {
    if (!confirm('Are you sure you want to delete this instructor?')) return

    try {
      const response = await fetch(`/api/instructors/${instructorId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete instructor')
      fetchInstructors()
    } catch (err) {
      console.error('Failed to delete instructor:', err)
      setError('Failed to delete instructor')
    }
  }

  const handleDeleteShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to delete this shop?')) return

    try {
      const response = await fetch(`/api/shops/${shopId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete shop')
      
      // Refresh shops list
      const updatedShops = await fetchShops()
      setShops(updatedShops)
    } catch (err) {
      console.error('Failed to delete shop:', err)
      setError('Failed to delete shop')
    }
  }

  const handleDeleteDJ = async (djId: string) => {
    if (!confirm('Are you sure you want to delete this DJ?')) return

    try {
      const response = await fetch(`/api/djs/${djId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete DJ')
      fetchDJs()
    } catch (err) {
      console.error('Failed to delete DJ:', err)
      setError('Failed to delete DJ')
    }
  }

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const tabs = [
    { id: 'schools', label: 'Schools' },
    { id: 'events', label: 'Events' },
    { id: 'festivals', label: 'Festivals' },
    { id: 'instructors', label: 'Instructors' },
    { id: 'djs', label: 'DJs' },
    { id: 'competitions', label: 'Competitions' },
    { id: 'shop', label: 'Shop' },
    { id: 'accommodations', label: 'Accommodations' }
  ]

  const EventCard = ({ event }: { event: Event }) => (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${
      layout === 'grid' ? 'flex flex-col' : 'flex flex-row'
    }`}>
      {/* Image */}
      <div className={`relative ${
        layout === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
      }`}>
        <img
          src={event.imageUrl || '/placeholder-event.jpg'}
          alt={event.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <h3 className="text-xl font-semibold mb-2">{event.name}</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Date:</span> {event.eventDate}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Time:</span> {event.startTime} - {event.endTime}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {event.location}, {event.city}, {event.state}
          </p>
          {event.price && (
            <p className="text-gray-600">
              <span className="font-medium">Price:</span> {event.price}
            </p>
          )}
          {event.danceStyles && (
             <p className="text-gray-600">
               <span className="font-medium">Styles:</span> {event.danceStyles}
             </p>
          )}
          <div className="flex gap-4 mt-1">
            {event.eventLink && <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Event Link</a>}
            {event.ticketLink && <a href={event.ticketLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Tickets</a>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push(`/admin/events/${event.id}/edit`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteEvent(event.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )

  const FestivalCard = ({ festival }: { festival: Festival }) => (
    <div className={`bg-white rounded-lg shadow overflow-hidden ${
      layout === 'grid' ? 'flex flex-col' : 'flex flex-row'
    }`}>
      {/* Image */}
      <div className={`relative ${
        layout === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
      }`}>
        <img
          src={festival.imageUrl || '/placeholder-festival.jpg'}
          alt={festival.name}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4 flex-1">
        <h3 className="text-xl font-semibold mb-2">{festival.name}</h3>
        <div className="space-y-2">
          <p className="text-gray-600">
            <span className="font-medium">Dates:</span>{' '}
            {new Date(festival.startDate).toLocaleDateString()} - {new Date(festival.endDate).toLocaleDateString()}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Location:</span> {festival.location}, {festival.state}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Price:</span> ${festival.price}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Styles:</span> {festival.danceStyles}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={() => router.push(`/admin/festivals/${festival.id}/edit`)}
            className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteFestival(festival.id)}
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  )

  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (isLoading) return <div className="p-4">Loading...</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm
                  ${activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="flex justify-between items-center mb-6">
        {activeTab === 'schools' && (
           <div className="flex-1 mr-4">
             <input
               type="text"
               placeholder="Search schools..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full p-2 border rounded"
             />
           </div>
        )}

        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg flex-shrink-0">
          <button
            onClick={() => setLayout('grid')}
            className={`p-2 rounded ${
              layout === 'grid' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200'
            }`}
            aria-label="Grid view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
            </svg>
          </button>
          <button
            onClick={() => setLayout('list')}
            className={`p-2 rounded ${
              layout === 'list' 
                ? 'bg-white shadow-sm' 
                : 'hover:bg-gray-200'
            }`}
            aria-label="List view"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="mt-4">
        {activeTab === 'schools' && (
          <div className={`
            ${layout === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4' 
              : 'flex flex-col gap-4'
            }
          `}>
            {filteredSchools.map((school) => (
              <div 
                key={school.id} 
                className={`border rounded-lg ${
                  layout === 'grid' 
                    ? 'p-4' 
                    : 'p-4 flex gap-4'
                }`}
              >
                {/* Image Container */}
                {school.imageUrl && (
                  <div className={`
                    relative rounded overflow-hidden
                    ${layout === 'grid'
                      ? 'w-full h-48 mb-4'
                      : 'w-32 h-32 flex-shrink-0'  // Smaller fixed size for list view
                    }
                  `}>
                    <img
                      src={school.imageUrl}
                      alt={school.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        console.error('Error loading image:', school.imageUrl);
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  </div>
                )}

                {/* Content Container */}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold mb-2">{school.name}</h2>
                  <p className="text-gray-600 mb-2">{school.location}, {school.state}</p>
                  <p className="text-gray-600 mb-2">{school.address}</p>
                  <p className="text-gray-600 mb-2">{school.contactInfo}</p>
                  
                  {typeof school.googleRating === 'number' && (
                    <div className="flex items-center mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((value) => {
                          const rating = school.googleRating as number
                          return (
                            <span
                              key={value}
                              className={`text-xl ${
                                value <= rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            >
                              ★
                            </span>
                          )
                        })}
                      </div>
                      <span className="ml-2 text-sm text-gray-500">
                        ({school.googleRating} from {school.googleReviewsCount || 0} reviews)
                      </span>
                      {school.googleReviewsUrl && (
                        <a
                          href={school.googleReviewsUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="ml-2 text-sm text-blue-500 hover:text-blue-700"
                        >
                          View on Google
                        </a>
                      )}
                    </div>
                  )}

                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => router.push(`/admin/schools/${school.id}/edit`)}
                      className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(school.id, school.name)}
                      className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Events Management</h2>
              <button
                onClick={() => router.push('/admin/events/new')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Event
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading events...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : events.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No events found. Click "Add New Event" to create one.
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'festivals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Festivals Management</h2>
              <button
                onClick={() => router.push('/admin/festivals/new')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Festival
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading festivals...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : festivals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No festivals found. Click "Add New Festival" to create one.
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {festivals.map((festival) => (
                  <FestivalCard key={festival.id} festival={festival} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'instructors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Instructors Management</h2>
              <button
                onClick={() => router.push('/admin/instructors/new')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Instructor
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading instructors...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : instructors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No instructors found. Click "Add New Instructor" to create one.
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {instructors.map((instructor) => (
                  <div
                    key={instructor.id}
                    className={`bg-white rounded-lg shadow overflow-hidden ${
                      layout === 'grid' ? 'flex flex-col' : 'flex flex-row'
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${
                      layout === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
                    }`}>
                      <img
                        src={instructor.imageUrl || '/placeholder-instructor.jpg'}
                        alt={instructor.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3 className="text-xl font-semibold mb-2">{instructor.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {instructor.location}, {instructor.state}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Dance Styles:</span> {instructor.danceStyles}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Contact:</span> {instructor.contact}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-2">
                          {instructor.instagramLink && (
                            <a
                              href={instructor.instagramLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-700"
                            >
                              Instagram
                            </a>
                          )}
                          {instructor.facebookLink && (
                            <a
                              href={instructor.facebookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Facebook
                            </a>
                          )}
                          {instructor.emailLink && (
                            <a
                              href={`mailto:${instructor.emailLink}`}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/instructors/${instructor.id}/edit`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(instructor.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'djs' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">DJs Management</h2>
              <button
                onClick={() => router.push('/admin/djs/new')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New DJ
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading DJs...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : djs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No DJs found. Click "Add New DJ" to create one.
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {djs.map((dj) => (
                  <div
                    key={dj.id}
                    className={`bg-white rounded-lg shadow overflow-hidden ${
                      layout === 'grid' ? 'flex flex-col' : 'flex flex-row'
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${
                      layout === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
                    }`}>
                      <img
                        src={dj.imageUrl || '/placeholder-dj.jpg'}
                        alt={dj.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3 className="text-xl font-semibold mb-2">{dj.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {dj.location}, {dj.state}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Music Styles:</span> {dj.musicStyles}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Contact:</span> {dj.contact}
                        </p>

                        {/* Social Links */}
                        <div className="flex gap-4 mt-2">
                          {dj.instagramLink && (
                            <a
                              href={dj.instagramLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-pink-600 hover:text-pink-700"
                            >
                              Instagram
                            </a>
                          )}
                          {dj.facebookLink && (
                            <a
                              href={dj.facebookLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Facebook
                            </a>
                          )}
                          {dj.emailLink && (
                            <a
                              href={`mailto:${dj.emailLink}`}
                              className="text-gray-600 hover:text-gray-700"
                            >
                              Email
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/djs/${dj.id}/edit`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDJ(dj.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'competitions' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Competitions Management</h2>
            {/* Competitions content will go here */}
          </div>
        )}

        {activeTab === 'shop' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Shops Management</h2>
              <button
                onClick={() => router.push('/admin/shops/new')}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Add New Shop
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading shops...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : shops.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No shops found. Click "Add New Shop" to create one.
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {shops.map((shop) => (
                  <div
                    key={shop.id}
                    className={`bg-white rounded-lg shadow overflow-hidden ${
                      layout === 'grid' ? 'flex flex-col' : 'flex flex-row'
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${
                      layout === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
                    }`}>
                      <img
                        src={shop.imageUrl || '/placeholder-shop.jpg'}
                        alt={shop.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3 className="text-xl font-semibold mb-2">{shop.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {shop.location}, {shop.state}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Address:</span> {shop.address}
                        </p>
                        {shop.comment && (
                          <p className="text-gray-600">
                            <span className="font-medium">Comment:</span> {shop.comment}
                          </p>
                        )}

                        {/* Links */}
                        <div className="flex gap-4 mt-2">
                          {shop.websiteLink && (
                            <a
                              href={shop.websiteLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Website
                            </a>
                          )}
                          {shop.googleReviewLink && (
                            <a
                              href={shop.googleReviewLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Reviews
                            </a>
                          )}
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/shops/${shop.id}/edit`)}
                          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'accommodations' && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Accommodations Management</h2>
            {/* Accommodations content will go here */}
          </div>
        )}
      </div>

      <div className="fixed bottom-8 right-8">
        <button
          onClick={() => {
            switch(activeTab) {
              case 'schools':
                router.push('/admin/schools/new')
                break
              case 'events':
                router.push('/admin/events/new')
                break
              case 'festivals':
                router.push('/admin/festivals/new')
                break
              case 'instructors':
                router.push('/admin/instructors/new')
                break
              case 'djs':
                router.push('/admin/djs/new')
                break
              case 'competitions':
                router.push('/admin/competitions/new')
                break
              case 'shop':
                router.push('/admin/shops/new')
                break
              case 'accommodations':
                router.push('/admin/accommodations/new')
                break
            }
          }}
          className="bg-blue-500 text-white px-6 py-3 rounded-full shadow-lg hover:bg-blue-600 flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New {activeTab.slice(0, -1)}
        </button>
      </div>
    </div>
  )
} 