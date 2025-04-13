'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'

export default function AdminPage() {
  const [schools, setSchools] = useState<School[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

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
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {schools.map((school) => (
        <div key={school.id} className="border rounded-lg p-4 shadow">
          {school.image && (
            <div className="relative h-48 w-full mb-4">
              <Image
                src={school.image}
                alt={school.name}
                fill
                className="object-cover rounded-lg"
                unoptimized
                onError={(e) => {
                  console.error('Image failed to load:', school.image);
                  e.currentTarget.src = '/fallback-image.jpg';
                }}
              />
            </div>
          )}
          <h3 className="text-lg font-semibold">{school.name}</h3>
          <p className="text-gray-600">{school.location}</p>
          <p className="text-sm mt-2">{school.description}</p>
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
        </div>
      ))}
    </div>
  )
} 