'use client'

import { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'
import { collection, getDocs, addDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { getWeekEvents } from '@/lib/calendar'
import { formatEvents } from '@/utils/formatEvents'
import { Calendar, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Media } from '@/types/media'
import { Link } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import MediaForm from '@/components/MediaForm'
import { MediaCard } from '@/components/MediaCard'



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
  musicLink: string
}

// Add Competition interface
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

// Add Accommodation interface
interface Accommodation {
  id: string
  name: string
  location: string
  state: string
  address: string
  contactInfo: string
  email: string
  website: string
  price: string
  rooms: string
  capacity: string
  imageUrl: string
  comment: string
  googleMapLink: string
  createdAt: string
  updatedAt: string
}

export default function AdminDashboard() {
  const [schools, setSchools] = useState<School[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [festivals, setFestivals] = useState<Festival[]>([])
  const [instructors, setInstructors] = useState<Instructor[]>([])
  const [djs, setDJs] = useState<DJ[]>([])
  const [shops, setShops] = useState<Shop[]>([])
  const [competitions, setCompetitions] = useState<Competition[]>([])
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [mediaList, setMediaList] = useState<Media[]>([])
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

  useEffect(() => {
    if (activeTab === 'competitions') {
      fetchCompetitions()
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'accommodations') {
      fetchAccommodations()
    }
  }, [activeTab])

  useEffect(() => {
    const fetchData = async () => {
      try {
        // ... existing fetch calls ...

        // Fetch media
        const mediaCollection = collection(db, 'medias')
        const mediaSnapshot = await getDocs(mediaCollection)
        const mediaList = mediaSnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Media[]
        setMediaList(mediaList)
      } catch (error) {
        console.error('Error fetching data:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
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

  const fetchCompetitions = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/competitions')
      if (!response.ok) throw new Error('Failed to fetch competitions')
      const data = await response.json()
      setCompetitions(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load competitions')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchAccommodations = async () => {
    setIsLoading(true)
    setError(null)
    try {
      console.log('Starting to fetch accommodations...')
      const response = await fetch('/api/accommodations')
      console.log('API Response status:', response.status)
      
      if (!response.ok) {
        console.error('API Response not OK:', response.status, response.statusText)
        throw new Error('Failed to fetch accommodations')
      }
      
      const data = await response.json()
      console.log('Fetched accommodations data:', data)
      console.log('Number of accommodations:', data.length)
      
      if (!Array.isArray(data)) {
        console.error('Received data is not an array:', data)
        throw new Error('Invalid data format received')
      }
      
      setAccommodations(data)
      console.log('Accommodations state updated')
    } catch (err) {
      console.error('Error in fetchAccommodations:', err)
      setError('Failed to load accommodations: ' + (err instanceof Error ? err.message : 'Unknown error'))
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this accommodation?')) {
      try {
        const response = await fetch(`/api/accommodations?id=${id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Failed to delete accommodation');
        }

        setAccommodations(accommodations.filter(acc => acc.id !== id));
        toast.success('Accommodation deleted successfully');
      } catch (error) {
        console.error('Error deleting accommodation:', error);
        toast.error('Failed to delete accommodation');
      }
    }
  };

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

  const handleDeleteCompetition = async (competitionId: string) => {
    if (!confirm('Are you sure you want to delete this competition?')) return

    try {
      const response = await fetch(`/api/competitions/${competitionId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete competition')
      
      // Refresh competitions list
      fetchCompetitions()
    } catch (err) {
      console.error('Failed to delete competition:', err)
      setError('Failed to delete competition')
    }
  }

  const handleDeleteSchool = async (schoolId: string) => {
    if (!confirm('Are you sure you want to delete this school?')) return

    try {
      const response = await fetch(`/api/schools/${schoolId}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete school')
      
      // Refresh schools list
      fetchSchools()
      toast.success('School deleted successfully')
    } catch (err) {
      console.error('Failed to delete school:', err)
      toast.error('Failed to delete school')
    }
  }

  const fetchMedia = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/media')
      if (!response.ok) throw new Error('Failed to fetch media')
      const data = await response.json()
      setMediaList(data)
    } catch (err) {
      console.error('Error fetching media:', err)
      setError('Failed to load media')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'media') {
      fetchMedia()
    }
  }, [activeTab])

  const handleDeleteMedia = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this media?')) {
      try {
        const response = await fetch(`/api/media/${id}`, {
          method: 'DELETE',
        })

        if (!response.ok) throw new Error('Failed to delete media')
        
        setMediaList(mediaList.filter(media => media.id !== id))
        toast.success('Media deleted successfully')
      } catch (error) {
        console.error('Error deleting media:', error)
        toast.error('Failed to delete media')
      }
    }
  }

  const addTestMedia = async () => {
    try {
      const testMedia = {
        name: "Test Media",
        location: "New York",
        state: "NY",
        contact: "test@example.com",
        imageUrl: "/placeholder-media.jpg",
        comment: "This is a test media entry",
        instagramLink: "https://instagram.com/test",
        facebookLink: "https://facebook.com/test",
        emailLink: "test@example.com",
        mediaLink: "https://example.com/test",
        createdAt: new Date(),
        updatedAt: new Date()
      }

      const mediaCollection = collection(db, 'medias')
      const docRef = await addDoc(mediaCollection, testMedia)
      console.log('Test media added with ID:', docRef.id)
      toast.success('Test media added successfully')
      fetchMedia() // Refresh the media list
    } catch (error) {
      console.error('Error adding test media:', error)
      toast.error('Failed to add test media')
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
    { id: 'shops', label: 'Shops' },
    { id: 'accommodations', label: 'Accommodations' },
    { id: 'media', label: 'Media' }
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
            className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteEvent(event.id)}
            className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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
            className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
          >
            Edit
          </button>
          <button
            onClick={() => handleDeleteFestival(festival.id)}
            className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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
        
        {/* Mobile-friendly tab navigation */}
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex flex-wrap gap-2 sm:gap-8" aria-label="Tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`
                  whitespace-nowrap py-2 sm:py-4 px-2 sm:px-1 border-b-2 font-medium text-sm
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

      {/* Mobile-friendly search and layout controls */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        {activeTab === 'schools' && (
          <div className="w-full sm:flex-1 sm:mr-4">
             <input
               type="text"
               placeholder="Search schools..."
               value={searchTerm}
               onChange={(e) => setSearchTerm(e.target.value)}
               className="w-full p-2 border rounded"
             />
           </div>
        )}

        <div className="flex items-center gap-2 bg-gray-100 p-2 rounded-lg w-full sm:w-auto justify-center sm:justify-end">
          <button
            onClick={() => setLayout('grid')}
            className={`p-2 rounded flex-1 sm:flex-none ${
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
            className={`p-2 rounded flex-1 sm:flex-none ${
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
                      className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSchool(school.id)}
                      className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
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
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
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
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
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
                          className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteInstructor(instructor.id)}
                          className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
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
                          className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteDJ(dj.id)}
                          className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Competitions Management</h2>
              <button
                onClick={() => router.push('/admin/competitions/new')}
                className="bg-green-600 text-white px-3 py-1.5 rounded hover:bg-green-700 text-sm"
              >
                Add New Competition
              </button>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading competitions...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : competitions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No competitions found. Click "Add New Competition" to create one.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {competitions.map((competition) => (
                  <div
                    key={competition.id}
                    className="bg-white rounded-lg shadow-md overflow-hidden"
                  >
                    <div className="relative h-48">
                      <img
                        src={competition.imageUrl || '/placeholder.svg'}
                        alt={competition.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-semibold mb-2">{competition.name}</h3>
                      <div className="space-y-2 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-2" />
                          {new Date(competition.startDate).toLocaleDateString()} - {new Date(competition.endDate).toLocaleDateString()}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-2" />
                          {competition.location}, {competition.state}
                        </div>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2" />
                          {competition.organizer}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(competition.categories || []).map((category) => (
                            <span
                              key={category}
                              className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs"
                            >
                              {category}
                            </span>
                          ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {(competition.level || []).map((level) => (
                            <span
                              key={level}
                              className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                            >
                              {level}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center">
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            competition.status === 'Upcoming' ? 'bg-yellow-100 text-yellow-800' :
                            competition.status === 'Ongoing' ? 'bg-green-100 text-green-800' :
                            competition.status === 'Completed' ? 'bg-gray-100 text-gray-800' :
                            'bg-red-100 text-red-800'
                          }`}>
                            {competition.status}
                          </span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/competitions/${competition.id}/edit`)}
                          className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteCompetition(competition.id)}
                          className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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

        {activeTab === 'shops' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Shops Management</h2>
              <button
                onClick={() => router.push('/admin/shops/new')}
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
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
                          className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteShop(shop.id)}
                          className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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
            {isLoading ? (
              <div className="text-center py-8">Loading accommodations...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : accommodations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No accommodations found. Click "Add New Accommodation" to create one.
          </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {accommodations.map((accommodation) => (
                  <div
                    key={accommodation.id}
                    className={`bg-white rounded-lg shadow overflow-hidden ${
                      layout === 'grid' ? 'flex flex-col' : 'flex flex-row'
                    }`}
                  >
                    {/* Image */}
                    <div className={`relative ${
                      layout === 'grid' ? 'w-full h-48' : 'w-32 h-32 flex-shrink-0'
                    }`}>
                      <img
                        src={accommodation.imageUrl || '/placeholder-accommodation.jpg'}
                        alt={accommodation.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Content */}
                    <div className="p-4 flex-1">
                      <h3 className="text-xl font-semibold mb-2">{accommodation.name}</h3>
                      <div className="space-y-2">
                        <p className="text-gray-600">
                          <span className="font-medium">Location:</span> {accommodation.location}, {accommodation.state}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Address:</span> {accommodation.address}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Price:</span> {accommodation.price}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Rooms:</span> {accommodation.rooms}
                        </p>
                        <p className="text-gray-600">
                          <span className="font-medium">Capacity:</span> {accommodation.capacity}
                        </p>
                        {accommodation.comment && (
                          <p className="text-gray-600">
                            <span className="font-medium">Comment:</span> {accommodation.comment}
                          </p>
                        )}

                        {/* Contact Info */}
                        <div className="space-y-1">
                          <p className="text-gray-600">
                            <span className="font-medium">Contact:</span> {accommodation.contactInfo}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Email:</span> {accommodation.email}
                          </p>
                          {accommodation.website && (
                            <a
                              href={accommodation.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-700"
                            >
                              Website
                            </a>
                          )}
                        </div>
      </div>

                      {/* Action Buttons */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => router.push(`/admin/accommodations/${accommodation.id}/edit`)}
                          className="bg-yellow-500 text-white px-2.5 py-1 rounded hover:bg-yellow-600 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(accommodation.id)}
                          className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
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

        {activeTab === 'media' && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Media</h2>
              <div className="flex gap-2">
                <button
                  onClick={addTestMedia}
                  className="bg-green-500 text-white px-3 py-1.5 rounded hover:bg-green-600 text-sm"
                >
                  Add Test Media
                </button>
                <button
                  onClick={() => router.push('/admin/media/new')}
                  className="bg-primary text-white px-3 py-1.5 rounded hover:bg-primary/90 text-sm"
                >
                  Add New Media
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : error ? (
              <div className="text-red-500 text-center">{error}</div>
            ) : mediaList.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No media found. Add your first media entry!
              </div>
            ) : (
              <div className={`grid ${
                layout === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'grid-cols-1 gap-4'
              }`}>
                {mediaList.map((media) => (
                  <MediaCard
                    key={media.id}
                    media={media}
                    layout={layout}
                    onDelete={handleDeleteMedia}
                    isAdmin={true}
                  />
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile-friendly floating action button */}
      <div className="fixed bottom-4 right-4 sm:bottom-8 sm:right-8">
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
              case 'shops':
                router.push('/admin/shops/new')
                break
              case 'accommodations':
                router.push('/admin/accommodations/new')
                break
              case 'media':
                router.push('/admin/media/new')
                break
            }
          }}
          className="bg-blue-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full shadow-lg hover:bg-blue-600 flex items-center gap-2 text-sm sm:text-base"
        >
          <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          <span className="hidden sm:inline">Add New {activeTab.slice(0, -1)}</span>
          <span className="sm:hidden">Add</span>
        </button>
      </div>
    </div>
  )
} 