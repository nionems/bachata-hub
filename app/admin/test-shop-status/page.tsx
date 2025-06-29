"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

interface Shop {
  id: string
  name: string
  location: string
  state: string
  status: 'pending' | 'approved' | 'rejected'
  price: string
  condition: string
  contactName: string
  contactEmail: string
  createdAt: string
}

export default function TestShopStatusPage() {
  const [publicShops, setPublicShops] = useState<Shop[]>([])
  const [allShops, setAllShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchShops = async () => {
      setLoading(true)
      try {
        // Fetch public shops (should only show approved)
        const publicResponse = await fetch('/api/shops')
        const publicData = await publicResponse.json()
        setPublicShops(publicData)

        // Fetch all shops (including pending)
        const allResponse = await fetch('/api/admin/shops')
        const allData = await allResponse.json()
        setAllShops(allData)
      } catch (error) {
        console.error('Error fetching shops:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Shop Status Test</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Public API Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🌐 Public API (/api/shops)
              <Badge variant="secondary">{publicShops.length} shops</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              This shows what visitors see on the website (should only be approved shops)
            </p>
            {publicShops.length === 0 ? (
              <p className="text-gray-500">No shops found</p>
            ) : (
              <div className="space-y-2">
                {publicShops.map((shop) => (
                  <div key={shop.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{shop.name}</h3>
                        <p className="text-sm text-gray-600">{shop.location}, {shop.state}</p>
                        <p className="text-sm text-gray-600">Price: {shop.price} | Condition: {shop.condition}</p>
                      </div>
                      <Badge className={getStatusColor(shop.status || 'no-status')}>
                        {shop.status || 'No Status'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Admin API Results */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              🔧 Admin API (/api/admin/shops)
              <Badge variant="secondary">{allShops.length} shops</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              This shows all shops including pending ones (admin view)
            </p>
            {allShops.length === 0 ? (
              <p className="text-gray-500">No shops found</p>
            ) : (
              <div className="space-y-2">
                {allShops.map((shop) => (
                  <div key={shop.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold">{shop.name}</h3>
                        <p className="text-sm text-gray-600">{shop.location}, {shop.state}</p>
                        <p className="text-sm text-gray-600">Price: {shop.price} | Condition: {shop.condition}</p>
                        <p className="text-sm text-gray-600">Contact: {shop.contactName} ({shop.contactEmail})</p>
                      </div>
                      <Badge className={getStatusColor(shop.status || 'no-status')}>
                        {shop.status || 'No Status'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-semibold text-blue-800 mb-2">Test Results Summary:</h3>
        <ul className="text-blue-700 space-y-1">
          <li>• Public API shows {publicShops.length} shops (should only be approved)</li>
          <li>• Admin API shows {allShops.length} shops (includes all statuses)</li>
          <li>• Pending shops should NOT appear in the public API</li>
          <li>• Only approved shops should be visible on the website</li>
        </ul>
      </div>

      <div className="mt-4">
        <Button onClick={() => window.location.reload()}>
          Refresh Data
        </Button>
      </div>
    </div>
  )
} 