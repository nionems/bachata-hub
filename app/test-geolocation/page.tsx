'use client'

import { useGeolocation } from '@/hooks/useGeolocation'
import { useState, useEffect } from 'react'

export default function TestGeolocationPage() {
  const { city, state, stateFull, isLoading, error } = useGeolocation()
  const [apiTest, setApiTest] = useState<any>(null)
  const [apiLoading, setApiLoading] = useState(false)

  const testApi = async () => {
    setApiLoading(true)
    try {
      const response = await fetch('/api/geolocation')
      const data = await response.json()
      setApiTest(data)
    } catch (err) {
      setApiTest({ error: err })
    } finally {
      setApiLoading(false)
    }
  }

  useEffect(() => {
    testApi()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Geolocation Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">Hook Test (Client-side)</h2>
          {isLoading ? (
            <p className="text-gray-600">Loading location...</p>
          ) : error ? (
            <div className="text-red-600">
              <p>Error: {error}</p>
            </div>
          ) : (
            <div className="space-y-2">
              <p><strong>City:</strong> {city}</p>
              <p><strong>State:</strong> {state}</p>
              <p><strong>State Full:</strong> {stateFull}</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-4">API Test (Server-side)</h2>
          {apiLoading ? (
            <p className="text-gray-600">Loading API...</p>
          ) : apiTest ? (
            <div className="space-y-2">
              <p><strong>City:</strong> {apiTest.city}</p>
              <p><strong>Region:</strong> {apiTest.region}</p>
              <p><strong>Country:</strong> {apiTest.country_name}</p>
              <p><strong>State:</strong> {apiTest.state}</p>
              {apiTest.error && (
                <p className="text-red-600"><strong>Error:</strong> {JSON.stringify(apiTest.error)}</p>
              )}
            </div>
          ) : (
            <p className="text-gray-600">No data</p>
          )}
          <button 
            onClick={testApi}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Retest API
          </button>
        </div>
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow">
        <h2 className="text-lg font-semibold mb-4">Debug Information</h2>
        <div className="space-y-2 text-sm">
          <p><strong>User Agent:</strong> {typeof window !== 'undefined' ? window.navigator.userAgent : 'Server-side'}</p>
          <p><strong>Hostname:</strong> {typeof window !== 'undefined' ? window.location.hostname : 'Server-side'}</p>
          <p><strong>Protocol:</strong> {typeof window !== 'undefined' ? window.location.protocol : 'Server-side'}</p>
        </div>
      </div>
    </div>
  )
} 