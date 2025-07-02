"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
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
  createdAt: string
  updatedAt: string
}

export default function AccommodationsDashboard() {
  const router = useRouter()
  const [accommodations, setAccommodations] = useState<Accommodation[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  useEffect(() => {
    fetchAccommodations()
  }, [])

  const fetchAccommodations = async () => {
    try {
      if (!db) {
        throw new Error('Firebase not initialized')
      }
      const snapshot = await getDocs(collection(db, 'accommodations'))
      const accommodationsList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Accommodation[]
      setAccommodations(accommodationsList)
    } catch (err) {
      console.error('Error fetching accommodations:', err)
      setError('Failed to load accommodations')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this accommodation?')) return
    if (deletingId) return // Prevent multiple deletions

    setDeletingId(id)
    try {
      const response = await fetch(`/api/accommodations/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'same-origin',
      })

      const data = await response.json()

      if (!response.ok) {
        console.error('Delete response not OK:', response.status, data)
        throw new Error(data.error || `Failed to delete accommodation (${response.status})`)
      }

      setAccommodations(prev => prev.filter(acc => acc.id !== id))
      toast.success('Accommodation deleted successfully')
    } catch (err) {
      console.error('Error deleting accommodation:', err)
      toast.error(err instanceof Error ? err.message : 'Failed to delete accommodation')
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) return <div className="text-center py-8">Loading accommodations...</div>
  if (error) return <div className="text-center py-8 text-red-500">{error}</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold">Accommodations</h1>
          <p className="text-gray-600">Manage accommodation listings</p>
        </div>
        <Button onClick={() => router.push('/admin/accommodations/new')}>
          Add New Accommodation
        </Button>
      </div>

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
                    disabled={deletingId === accommodation.id}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(accommodation.id)}
                    disabled={deletingId === accommodation.id}
                  >
                    {deletingId === accommodation.id ? (
                      <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Deleting...
                      </span>
                    ) : (
                      <>
                        <Trash2 className="w-4 h-4 mr-2" />
                        Delete
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
} 