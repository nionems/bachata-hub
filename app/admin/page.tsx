'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MapPin, Phone, Mail, Globe, DollarSign, Bed, Users, Edit, Trash2 } from "lucide-react"
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { toast } from 'sonner'

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
}

export default function AdminPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        if (!response.ok) {
          router.push('/admin/login')
        }
      } catch (err) {
        router.push('/admin/login')
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
      }
    }

    const fetchAccommodations = async () => {
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

    checkAuth()
    fetchSchools()
    fetchAccommodations()
  }, [router])

  const handleDeleteAccommodation = async (id: string) => {
    if (!confirm('Are you sure you want to delete this accommodation?')) return

    try {
      await deleteDoc(doc(db, 'accommodations', id))
      setAccommodations(prev => prev.filter(acc => acc.id !== id))
      toast.success('Accommodation deleted successfully')
    } catch (err) {
      console.error('Error deleting accommodation:', err)
      toast.error('Failed to delete accommodation')
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-4">Admin Dashboard</h1>
        <div className="flex gap-4">
          <Button onClick={() => router.push('/admin/schools/new')}>
            Add New School
          </Button>
          <Button onClick={() => router.push('/admin/accommodations/new')}>
            Add New Accommodation
          </Button>
        </div>
      </div>

      <div className="space-y-8">
        <section>
          <h2 className="text-2xl font-semibold mb-4">Schools Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {schools.map((school) => (
              <Card key={school.id} className="overflow-hidden">
                {school.image && (
                  <div className="relative aspect-video">
                    <Image
                      src={school.image}
                      alt={school.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{school.name}</CardTitle>
                  <CardDescription>{school.location}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-gray-600">{school.description}</p>
                  {school.website && (
                    <a 
                      href={school.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline mt-2 block"
                    >
                      Visit Website
                    </a>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mb-4">Accommodations Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {accommodations.map((accommodation) => (
              <Card key={accommodation.id} className="overflow-hidden">
                <div className="relative aspect-video">
                  <img
                    src={accommodation.imageUrl}
                    alt={accommodation.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardHeader>
                  <CardTitle>{accommodation.name}</CardTitle>
                  <CardDescription className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{accommodation.location}, {accommodation.state}</span>
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      <span>{accommodation.price}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Bed className="w-4 h-4" />
                      <span>{accommodation.rooms} rooms</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      <span>Capacity: {accommodation.capacity}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4" />
                      <span>{accommodation.contactInfo}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4" />
                      <span>{accommodation.email}</span>
                    </div>
                    {accommodation.website && (
                      <div className="flex items-center gap-2">
                        <Globe className="w-4 h-4" />
                        <a 
                          href={accommodation.website} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          Website
                        </a>
                      </div>
                    )}
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {accommodation.comment}
                    </p>
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => router.push(`/admin/accommodations/${accommodation.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteAccommodation(accommodation.id)}
                      >
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
} 