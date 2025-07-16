'use client'

import { useState, useEffect, } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'
import { collection, getDocs, addDoc, doc, deleteDoc } from 'firebase/firestore'
import { db } from '../../../firebase/config'
import { getWeekEvents } from '@/lib/calendar'
import { formatEvents } from '@/utils/formatEvents'
import { Calendar, MapPin, Users } from 'lucide-react'
import { toast } from 'sonner'
import { Media } from '@/types/media'
import Link from 'next/link'
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
  published?: boolean
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
  danceStyles: string[] | string
  imageUrl: string
  published: boolean
  featured?: 'yes' | 'no'
}

// Add Instructor interface
interface Instructor {
  id: string
  name: string
  location: string
  state: string
  imageUrl: string
  comment?: string
  danceStyles: string[] | string
  emailLink?: string
  facebookLink?: string
  instagramLink?: string
  privatePricePerHour?: string
  createdAt: string
  updatedAt: string
}

interface Shop {
  id: string;
  name: string;
  location: string;
  state: string;
  address: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  website: string;
  instagramUrl: string;
  facebookUrl: string;
  price: string;
  condition: string;
  comment: string;
  discountCode: string;
  imageUrl: string;
  googleMapLink: string;
  info: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
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

// Add User interface at the top with other interfaces
interface User {
  id: string
  email: string
  displayName?: string
  name?: string
  createdAt?: Date
  subscribedAt?: string
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
  const [users, setUsers] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [layout, setLayout] = useState<'grid' | 'list'>('grid')
  const [activeTab, setActiveTab] = useState('schools')
  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [shopStatusFilter, setShopStatusFilter] = useState('all')
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
        await fetchShops()
      } catch (err) {
        console.error('Error loading shops:', err)
        setError('Failed to load shops')
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

  useEffect(() => {
    if (activeTab === 'users') {
      fetchUsers()
    }
  }, [activeTab])

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
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/events')
      if (!response.ok) throw new Error('Failed to fetch events')
      const data = await response.json()
      
      // Sort events by date (earliest first)
      const sortedEvents = data.sort((a: Event, b: Event) => {
        const dateA = new Date(a.eventDate).getTime()
        const dateB = new Date(b.eventDate).getTime()
        return dateA - dateB
      })
      
      setEvents(sortedEvents)
    } catch (err) {
      setError('Failed to load events')
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const fetchFestivals = async () => {
    try {
      console.log('Fetching festivals...')
      setIsLoading(true)
      const response = await fetch('/api/admin/festivals')
      console.log('Festivals response status:', response.status)
      if (!response.ok) throw new Error('Failed to fetch festivals')
      const data = await response.json()
      console.log('Fetched festivals data:', data)
      
      // Sort festivals by start date (earliest first)
      const sortedFestivals = data.sort((a: Festival, b: Festival) => {
        const dateA = new Date(a.startDate).getTime()
        const dateB = new Date(b.startDate).getTime()
        return dateA - dateB
      })
      
      console.log('Sorted festivals:', sortedFestivals)
      setFestivals(sortedFestivals)
    } catch (err) {
      console.error('Error fetching festivals:', err)
      setError('Failed to load festivals')
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
    try {
      setIsLoading(true)
      const response = await fetch('/api/admin/shops')
      if (!response.ok) throw new Error('Failed to fetch shops')
      const data = await response.json()
      setShops(data)
    } catch (err) {
      console.error('Error fetching shops:', err)
      setError('Failed to load shops')
    } finally {
      setIsLoading(false)
    }
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
    } catch (error) {
      console.error('Error fetching competitions:', error)
      setError('Failed to load competitions')
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
        const response = await fetch(`/api/accommodations/${id}`, {
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

  const handleToggleEventPublished = async (eventId: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/events/${eventId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentPublished,
        }),
      })

      if (!response.ok) throw new Error('Failed to update event')
      
      // Refresh events list
      fetchDbEvents()
      toast.success(`Event ${!currentPublished ? 'published' : 'unpublished'} successfully`)
    } catch (err) {
      console.error('Failed to update event:', err)
      toast.error('Failed to update event')
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

  const handleTogglePublished = async (festivalId: string, currentPublished: boolean) => {
    try {
      const response = await fetch(`/api/festivals/${festivalId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          published: !currentPublished,
        }),
      })

      if (!response.ok) throw new Error('Failed to update festival')
      
      // Refresh festivals list
      fetchFestivals()
      toast.success(`Festival ${!currentPublished ? 'published' : 'unpublished'} successfully`)
    } catch (err) {
      console.error('Failed to update festival:', err)
      toast.error('Failed to update festival')
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
      await fetchShops()
    } catch (err) {
      console.error('Failed to delete shop:', err)
      setError('Failed to delete shop')
    }
  }

  const handleApproveShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to approve this shop?')) return

    try {
      const response = await fetch(`/api/shops/${shopId}/approve`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to approve shop')
      
      // Refresh shops list
      await fetchShops()
      toast.success('Shop approved successfully')
    } catch (err) {
      console.error('Failed to approve shop:', err)
      toast.error('Failed to approve shop')
    }
  }

  const handleRejectShop = async (shopId: string) => {
    if (!confirm('Are you sure you want to reject this shop?')) return

    try {
      const response = await fetch(`/api/shops/${shopId}/reject`, {
        method: 'POST',
      })

      if (!response.ok) throw new Error('Failed to reject shop')
      
      // Refresh shops list
      await fetchShops()
      toast.success('Shop rejected successfully')
    } catch (err) {
      console.error('Failed to reject shop:', err)
      toast.error('Failed to reject shop')
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

  const fetchUsers = async () => {
    try {
      setIsLoading(true)
      const usersCollection = collection(db, 'users')
      const usersSnapshot = await getDocs(usersCollection)
      const usersList = usersSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt?.toDate(),
      })) as User[]
      // Sort users alphabetically by name (displayName or name)
      const sortedUsers = usersList.sort((a, b) => {
        const nameA = (a.displayName || a.name || '').toLowerCase()
        const nameB = (b.displayName || b.name || '').toLowerCase()
        return nameA.localeCompare(nameB)
      })
      setUsers(sortedUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      setError('Failed to load users')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('Are you sure you want to delete this user?')) return

    try {
      const userRef = doc(db, 'users', userId)
      await deleteDoc(userRef)
      // Refresh the users list
      fetchUsers()
      toast.success('User deleted successfully')
    } catch (err) {
      console.error('Failed to delete user:', err)
      toast.error('Failed to delete user')
    }
  }

  const handleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([])
    } else {
      setSelectedUsers(users.map(user => user.id))
    }
  }

  const handleSelectUser = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    )
  }

  const copySelectedEmails = () => {
    const selectedEmails = users
      .filter(user => selectedUsers.includes(user.id))
      .map(user => user.email)
      .join(', ')
    
    navigator.clipboard.writeText(selectedEmails)
    toast.success('Email addresses copied to clipboard')
  }

  // Filter functions for each tab
  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.state.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredEvents = events.filter(event =>
    (event.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.city?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (event.danceStyles && typeof event.danceStyles === 'string' && event.danceStyles.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (event.danceStyles && Array.isArray(event.danceStyles) && event.danceStyles.some(style => (style?.toLowerCase() || '').includes(searchTerm.toLowerCase())))
  )

  const filteredFestivals = festivals.filter(festival =>
    (festival.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (festival.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (festival.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (festival.danceStyles && typeof festival.danceStyles === 'string' && festival.danceStyles.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (festival.danceStyles && Array.isArray(festival.danceStyles) && festival.danceStyles.some(style => (style?.toLowerCase() || '').includes(searchTerm.toLowerCase())))
  )

  const filteredInstructors = instructors.filter(instructor =>
    (instructor.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (instructor.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (instructor.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (instructor.danceStyles && typeof instructor.danceStyles === 'string' && instructor.danceStyles.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (instructor.danceStyles && Array.isArray(instructor.danceStyles) && instructor.danceStyles.some(style => (style?.toLowerCase() || '').includes(searchTerm.toLowerCase())))
  )

  const filteredDJs = djs.filter(dj =>
    (dj.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (dj.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (dj.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (dj.musicStyles?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredCompetitions = competitions.filter(competition =>
    (competition.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (competition.organizer?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (competition.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (competition.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (competition.danceStyles && typeof competition.danceStyles === 'string' && competition.danceStyles.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (competition.danceStyles && Array.isArray(competition.danceStyles) && competition.danceStyles.some(style => (style?.toLowerCase() || '').includes(searchTerm.toLowerCase())))
  )

  const filteredShops = shops.filter(shop =>
    (shop.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (shop.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (shop.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (shop.contactName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (shop.contactEmail?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (shop.status?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredAccommodations = accommodations.filter(accommodation =>
    (accommodation.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (accommodation.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (accommodation.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (accommodation.contactInfo?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (accommodation.email?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredMedia = mediaList.filter(media =>
    (media.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (media.location?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (media.state?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (media.contact?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (media.emailLink?.toLowerCase() || '').includes(searchTerm.toLowerCase())
  )

  const filteredUsers = users.filter(user =>
    (user.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.displayName?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
    (user.name?.toLowerCase() || '').includes(searchTerm.toLowerCase())
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
    { id: 'media', label: 'Media' },
    { id: 'pending-items', label: 'Pending Items' },
    { id: 'submissions', label: 'Email Submissions' },
    { id: 'users', label: 'Community Users' }
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
          <p className="text-gray-600">
            <span className="font-medium">Status:</span>{' '}
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              event.published !== false
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {event.published !== false ? 'Published' : 'Draft'}
            </span>
          </p>
          <div className="flex gap-4 mt-1">
            {event.eventLink && <a href={event.eventLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Event Link</a>}
            {event.ticketLink && <a href={event.ticketLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 text-sm hover:underline">Tickets</a>}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handleToggleEventPublished(event.id, event.published !== false)}
            className={`px-2.5 py-1 rounded text-sm font-medium ${
              event.published !== false
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {event.published !== false ? 'Unpublish' : 'Publish'}
          </button>
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
            <span className="font-medium">Styles:</span> {Array.isArray(festival.danceStyles) ? festival.danceStyles.join(', ') : festival.danceStyles}
          </p>
          <p className="text-gray-600">
            <span className="font-medium">Status:</span>{' '}
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              festival.published 
                ? 'bg-green-100 text-green-800' 
                : 'bg-gray-100 text-gray-800'
            }`}>
              {festival.published ? 'Published' : 'Draft'}
            </span>
          </p>
        </div>

        {/* Action Buttons */}
        <div className="mt-4 flex gap-2 flex-wrap">
          <button
            onClick={() => handleTogglePublished(festival.id, festival.published)}
            className={`px-2.5 py-1 rounded text-sm font-medium ${
              festival.published
                ? 'bg-orange-500 text-white hover:bg-orange-600'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {festival.published ? 'Unpublish' : 'Publish'}
          </button>
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

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match')
      return
    }

    setIsChangingPassword(true)
    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to change password')
      }

      toast.success('Password changed successfully')
      setCurrentPassword('')
      setNewPassword('')
      setConfirmPassword('')
    } catch (error) {
      console.error('Error changing password:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to change password')
    } finally {
      setIsChangingPassword(false)
    }
  }

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
        {/* Search input for all tabs */}
        <div className="w-full sm:flex-1 sm:mr-4">
          <input
            type="text"
            placeholder={`Search ${activeTab}...`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

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
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Schools Management</h2>
              <div className="text-sm text-gray-600">
                {searchTerm ? `${filteredSchools.length} of ${schools.length} schools` : `${schools.length} total schools`}
              </div>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Loading schools...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : filteredSchools.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No schools found matching "${searchTerm}".` : 'No schools found. Click "Add New School" to create one.'}
              </div>
            ) : (
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
          </div>
        )}

        {activeTab === 'events' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Events Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredEvents.length} of ${events.length} events` : `${events.length} total events`}
                </div>
              </div>
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
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No events found matching "${searchTerm}".` : 'No events found. Click "Add New Event" to create one.'}
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'festivals' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Festivals Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredFestivals.length} of ${festivals.length} festivals` : `${festivals.length} total festivals`}
                </div>
              </div>
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
            ) : filteredFestivals.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No festivals found matching "${searchTerm}".` : 'No festivals found. Click "Add New Festival" to create one.'}
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto' 
                  : 'flex flex-col gap-4'
                }
              `} style={layout === 'grid' ? { gridAutoFlow: 'dense' } : {}}>
                {filteredFestivals.map((festival) => (
                  <FestivalCard key={festival.id} festival={festival} />
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'instructors' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Instructors Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredInstructors.length} of ${instructors.length} instructors` : `${instructors.length} total instructors`}
                </div>
              </div>
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
            ) : filteredInstructors.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No instructors found matching "${searchTerm}".` : 'No instructors found. Click "Add New Instructor" to create one.'}
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto' 
                  : 'flex flex-col gap-4'
                }
              `} style={layout === 'grid' ? { gridAutoFlow: 'dense' } : {}}>
                {filteredInstructors.map((instructor) => (
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
                          <span className="font-medium">Dance Styles:</span> {Array.isArray(instructor.danceStyles) ? instructor.danceStyles.join(', ') : instructor.danceStyles}
                        </p>
                        {instructor.comment && (
                          <p className="text-gray-600">
                            <span className="font-medium">Comment:</span> {instructor.comment}
                          </p>
                        )}
                        {instructor.privatePricePerHour && (
                          <p className="text-gray-600">
                            <span className="font-medium">Price per Hour:</span> {instructor.privatePricePerHour}
                          </p>
                        )}

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
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">DJs Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredDJs.length} of ${djs.length} DJs` : `${djs.length} total DJs`}
                </div>
              </div>
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
            ) : filteredDJs.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No DJs found matching "${searchTerm}".` : 'No DJs found. Click "Add New DJ" to create one.'}
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 auto-rows-auto' 
                  : 'flex flex-col gap-4'
                }
              `} style={layout === 'grid' ? { gridAutoFlow: 'dense' } : {}}>
                {filteredDJs.map((dj) => (
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
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Competitions Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredCompetitions.length} of ${competitions.length} competitions` : `${competitions.length} total competitions`}
                </div>
              </div>
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
            ) : filteredCompetitions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No competitions found matching "${searchTerm}".` : 'No competitions found. Click "Add New Competition" to create one.'}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCompetitions.map((competition) => (
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
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Shops Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredShops.length} of ${shops.length} shops` : `${shops.length} total shops`}
                </div>
              </div>
              <div className="flex gap-2">
                <select
                  value={shopStatusFilter}
                  onChange={(e) => setShopStatusFilter(e.target.value)}
                  className="px-3 py-1.5 border rounded text-sm"
                >
                  <option value="all">All Shops</option>
                  <option value="pending">Pending Only</option>
                  <option value="approved">Approved Only</option>
                  <option value="rejected">Rejected Only</option>
                </select>
                <button
                  onClick={() => router.push('/admin/shops/new')}
                  className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
                >
                  Add New Shop
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading shops...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : filteredShops.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No shops found matching "${searchTerm}".` : 'No shops found. Click "Add New Shop" to create one.'}
              </div>
            ) : filteredShops.filter(shop => {
                if (shopStatusFilter === 'all') return true
                return shop.status === shopStatusFilter
              }).length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No {shopStatusFilter === 'all' ? '' : shopStatusFilter} shops found.
                {shopStatusFilter === 'pending' && ' All shops have been processed.'}
                {shopStatusFilter === 'approved' && ' No shops have been approved yet.'}
                {shopStatusFilter === 'rejected' && ' No shops have been rejected.'}
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {filteredShops
                  .filter(shop => {
                    if (shopStatusFilter === 'all') return true
                    return shop.status === shopStatusFilter
                  })
                  .map((shop) => (
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
                          <p className="text-gray-600">
                            <span className="font-medium">Price:</span> {shop.price}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Condition:</span> {shop.condition}
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Status:</span> 
                            <span className={`ml-1 px-2 py-1 rounded text-xs font-medium ${
                              shop.status === 'approved' ? 'bg-green-100 text-green-800' :
                              shop.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {shop.status || 'No Status'}
                            </span>
                          </p>
                          <p className="text-gray-600">
                            <span className="font-medium">Contact:</span> {shop.contactName} ({shop.contactEmail})
                          </p>
                          {shop.comment && (
                            <p className="text-gray-600">
                              <span className="font-medium">Comment:</span> {shop.comment}
                            </p>
                          )}

                          {/* Links */}
                          <div className="flex gap-4 mt-2">
                            {shop.website && (
                              <a
                                href={shop.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Website
                              </a>
                            )}
                            {shop.instagramUrl && (
                              <a
                                href={shop.instagramUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Instagram
                              </a>
                            )}
                            {shop.facebookUrl && (
                              <a
                                href={shop.facebookUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Facebook
                              </a>
                            )}
                            {shop.googleMapLink && (
                              <a
                                href={shop.googleMapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                Map
                              </a>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="mt-4 flex gap-2 flex-wrap">
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
                          {shop.status === 'pending' && (
                            <>
                              <button
                                onClick={() => handleApproveShop(shop.id)}
                                className="bg-green-500 text-white px-2.5 py-1 rounded hover:bg-green-600 text-sm"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleRejectShop(shop.id)}
                                className="bg-orange-500 text-white px-2.5 py-1 rounded hover:bg-orange-600 text-sm"
                              >
                                Reject
                              </button>
                            </>
                          )}
                          {shop.status === 'rejected' && (
                            <button
                              onClick={() => handleApproveShop(shop.id)}
                              className="bg-green-500 text-white px-2.5 py-1 rounded hover:bg-green-600 text-sm"
                            >
                              Re-approve
                            </button>
                          )}
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
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <h2 className="text-xl font-semibold">Accommodations Management</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredAccommodations.length} of ${accommodations.length} accommodations` : `${accommodations.length} total accommodations`}
                </div>
              </div>
              <button
                onClick={() => router.push('/admin/accommodations/new')}
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
              >
                Add New Accommodation
              </button>
            </div>
            {isLoading ? (
              <div className="text-center py-8">Loading accommodations...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : filteredAccommodations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No accommodations found matching "${searchTerm}".` : 'No accommodations found. Click "Add New Accommodation" to create one.'}
              </div>
            ) : (
              <div className={`
                ${layout === 'grid' 
                  ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'flex flex-col gap-4'
                }
              `}>
                {filteredAccommodations.map((accommodation) => (
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
              <div className="flex items-center gap-4">
                <h2 className="text-2xl font-bold">Media</h2>
                <div className="text-sm text-gray-600">
                  {searchTerm ? `${filteredMedia.length} of ${mediaList.length} media items` : `${mediaList.length} total media items`}
                </div>
              </div>
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
            ) : filteredMedia.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                {searchTerm ? `No media found matching "${searchTerm}".` : 'No media found. Add your first media entry!'}
              </div>
            ) : (
              <div className={`grid ${
                layout === 'grid' 
                  ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' 
                  : 'grid-cols-1 gap-4'
              }`}>
                {filteredMedia.map((media) => (
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

        {activeTab === 'pending-items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Pending Items Review</h2>
              <button
                onClick={() => router.push('/admin/pending-items')}
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
              >
                View All Pending Items
              </button>
            </div>
            <div className="text-center py-8 text-gray-500">
              Click "View All Pending Items" to review and approve/reject submitted shop items.
            </div>
          </div>
        )}

        {activeTab === 'submissions' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Email Submissions</h2>
              <button
                onClick={() => router.push('/admin/submissions')}
                className="bg-blue-500 text-white px-3 py-1.5 rounded hover:bg-blue-600 text-sm"
              >
                View All Submissions
              </button>
            </div>
            <div className="text-center py-8 text-gray-500">
              Click "View All Submissions" to review and manage email submissions.
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <div className="flex items-center gap-4">
                <div>
                  <h2 className="text-xl font-semibold">Community Users</h2>
                  <div className="text-sm text-gray-600">
                    {searchTerm ? `${filteredUsers.length} of ${users.length} users` : `${users.length} total users`}
                  </div>
                </div>
              </div>
              {selectedUsers.length > 0 && (
                <button
                  onClick={copySelectedEmails}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                >
                  Copy {selectedUsers.length} Email{selectedUsers.length !== 1 ? 's' : ''}
                </button>
              )}
            </div>

            {isLoading ? (
              <div className="text-center py-8">Loading users...</div>
            ) : error ? (
              <div className="text-red-500 text-center py-8">{error}</div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                {searchTerm ? `No users found matching "${searchTerm}".` : 'No users found in the community.'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input
                          type="checkbox"
                          checked={selectedUsers.length === filteredUsers.length}
                          onChange={handleSelectAll}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                        />
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Joined Date
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredUsers.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="checkbox"
                            checked={selectedUsers.includes(user.id)}
                            onChange={() => handleSelectUser(user.id)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {user.displayName || user.name || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 
                           user.subscribedAt ? new Date(user.subscribedAt).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleDeleteUser(user.id)}
                              className="bg-red-500 text-white px-2.5 py-1 rounded hover:bg-red-600 text-sm"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
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
              case 'pending-items':
                router.push('/admin/pending-items')
                break
              case 'submissions':
                router.push('/admin/submissions')
                break
              case 'users':
                router.push('/admin/users/new')
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

      <div className="mt-8 p-6 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold mb-4">Change Password</h2>
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <div>
            <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700">
              Current Password
            </label>
            <div className="relative mt-1">
              <input
                type={showCurrentPassword ? "text" : "password"}
                id="currentPassword"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              >
                {showCurrentPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700">
              New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              >
                {showNewPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm New Password
            </label>
            <div className="relative mt-1">
              <input
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-500"
              >
                {showConfirmPassword ? (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            disabled={isChangingPassword}
            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50"
          >
            {isChangingPassword ? 'Changing Password...' : 'Change Password'}
          </button>
        </form>
      </div>
    </div>
  )
} 