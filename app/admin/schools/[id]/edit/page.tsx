'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { School } from '@/types/school'

export default function EditSchool({ params }: { params: { id: string } }) {
  const [school, setSchool] = useState<School | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    fetchSchool()
  }, [params.id])

  const fetchSchool = async () => {
    try {
      const response = await fetch(`/api/schools/${params.id}`)
      if (!response.ok) throw new Error('Failed to fetch school')
      const data = await response.json()
      setSchool(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!school) return

    try {
      const response = await fetch(`/api/schools/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(school),
      })
      if (!response.ok) throw new Error('Failed to update school')
      router.push('/admin/dashboard')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update school')
    }
  }

  if (isLoading) return <div className="p-4">Loading...</div>
  if (error) return <div className="p-4 text-red-500">Error: {error}</div>
  if (!school) return <div className="p-4">School not found</div>

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Edit School</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={school.name}
            onChange={(e) => setSchool({ ...school, name: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Location</label>
          <input
            type="text"
            value={school.location}
            onChange={(e) => setSchool({ ...school, location: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Contact Info</label>
          <input
            type="text"
            value={school.contactInfo}
            onChange={(e) => setSchool({ ...school, contactInfo: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Instructors (comma-separated)</label>
          <input
            type="text"
            value={school.instructors.join(', ')}
            onChange={(e) => setSchool({ ...school, instructors: e.target.value.split(',').map(i => i.trim()) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Website</label>
          <input
            type="url"
            value={school.website}
            onChange={(e) => setSchool({ ...school, website: e.target.value })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Dance Styles (comma-separated)</label>
          <input
            type="text"
            value={school.danceStyles.join(', ')}
            onChange={(e) => setSchool({ ...school, danceStyles: e.target.value.split(',').map(s => s.trim()) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div className="flex gap-4">
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Save Changes
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/dashboard')}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
} 