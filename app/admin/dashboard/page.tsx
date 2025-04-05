'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'
import ErrorBoundary from '@/components/ErrorBoundary'

export default function AdminDashboard() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const router = useRouter()

  useEffect(() => {
    const init = async () => {
      try {
        // First check auth
        const authResponse = await fetch('/api/auth/check', {
          credentials: 'include'
        })
        
        if (!authResponse.ok) {
          router.replace('/admin/login')
          return
        }

        // Then fetch schools
        await fetchSchools()
      } catch (err) {
        router.replace('/admin/login')
      }
    }

    init()
  }, [])

  const handleLogout = async () => {
    try {
      const response = await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Logout failed')
      }

      // Redirect to login page
      router.replace('/admin/login')
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

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    school.location.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <ErrorBoundary>
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dance Schools Management</h1>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/schools/new')}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Add New School
            </button>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="mb-4">
          <input
            type="text"
            placeholder="Search schools..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 border rounded"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredSchools.map((school) => (
            <div key={school.id} className="border rounded-lg p-4">
              <h2 className="text-xl font-semibold mb-2">{school.name}</h2>
              <p className="text-gray-600 mb-2">{school.location}, {school.state}</p>
              <p className="text-gray-600 mb-2">{school.address}</p>
              <p className="text-gray-600 mb-2">{school.contactInfo}</p>
              {school.imageUrl && (
                <div className="w-full h-48 mb-4 relative">
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
          ))}
        </div>
      </div>
    </ErrorBoundary>
  )
} 