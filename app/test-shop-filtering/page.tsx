'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'

interface Shop {
  id: string
  name: string
  status?: string
  condition: string
  state: string
}

export default function TestShopFiltering() {
  const [publicShops, setPublicShops] = useState<Shop[]>([])
  const [adminShops, setAdminShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(false)

  const fetchShops = async () => {
    setLoading(true)
    try {
      // Fetch public shops (should only show approved)
      const publicResponse = await fetch('/api/shops')
      const publicData = await publicResponse.json()
      setPublicShops(publicData)

      // Fetch admin shops (should show all including pending)
      const adminResponse = await fetch('/api/admin/shops')
      const adminData = await adminResponse.json()
      setAdminShops(adminData)
    } catch (error) {
      console.error('Error fetching shops:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchShops()
  }, [])

  const getStatusBadge = (status?: string) => {
    if (!status) return <Badge variant="secondary">No Status</Badge>
    switch (status) {
      case 'approved': return <Badge variant="default" className="bg-green-500">Approved</Badge>
      case 'pending': return <Badge variant="default" className="bg-yellow-500">Pending</Badge>
      case 'rejected': return <Badge variant="default" className="bg-red-500">Rejected</Badge>
      default: return <Badge variant="secondary">{status}</Badge>
    }
  }

  const pendingShops = adminShops.filter(shop => shop.status === 'pending')
  const approvedShops = adminShops.filter(shop => shop.status === 'approved')
  const rejectedShops = adminShops.filter(shop => shop.status === 'rejected')
  const noStatusShops = adminShops.filter(shop => !shop.status)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-4">Shop Filtering Test</h1>
        <Button onClick={fetchShops} disabled={loading}>
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Public API Results */}
        <Card>
          <CardHeader>
            <CardTitle>Public API (/api/shops)</CardTitle>
            <p className="text-sm text-gray-600">Should only show approved shops</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <p className="font-semibold">Total shops: {publicShops.length}</p>
            </div>
            <div className="space-y-2">
              {publicShops.map(shop => (
                <div key={shop.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{shop.name}</p>
                    <p className="text-sm text-gray-600">{shop.state} • {shop.condition}</p>
                  </div>
                  {getStatusBadge(shop.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Admin API Results */}
        <Card>
          <CardHeader>
            <CardTitle>Admin API (/api/admin/shops)</CardTitle>
            <p className="text-sm text-gray-600">Shows all shops including pending</p>
          </CardHeader>
          <CardContent>
            <div className="mb-4 space-y-2">
              <p className="font-semibold">Total shops: {adminShops.length}</p>
              <div className="flex gap-2">
                {getStatusBadge('approved')} {approvedShops.length}
                {getStatusBadge('pending')} {pendingShops.length}
                {getStatusBadge('rejected')} {rejectedShops.length}
                {getStatusBadge()} {noStatusShops.length}
              </div>
            </div>
            <div className="space-y-2">
              {adminShops.map(shop => (
                <div key={shop.id} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{shop.name}</p>
                    <p className="text-sm text-gray-600">{shop.state} • {shop.condition}</p>
                  </div>
                  {getStatusBadge(shop.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Verification */}
      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Verification</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p className={publicShops.length === approvedShops.length + noStatusShops.length ? 'text-green-600' : 'text-red-600'}>
              ✓ Public API filtering: {publicShops.length === approvedShops.length + noStatusShops.length ? 'CORRECT' : 'INCORRECT'}
            </p>
            <p className="text-sm text-gray-600">
              Public shows {publicShops.length} shops, should show {approvedShops.length + noStatusShops.length} (approved + no status)
            </p>
            <p className={pendingShops.length === 0 ? 'text-green-600' : 'text-yellow-600'}>
              {pendingShops.length === 0 ? '✓ No pending shops in database' : `⚠ ${pendingShops.length} pending shops found`}
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 