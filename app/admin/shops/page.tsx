'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'

interface Shop {
  id: string
  name: string
  location: string
  state: string
  imageUrl: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
  updatedAt: string
}

export default function ShopsPage() {
  const router = useRouter()
  const [shops, setShops] = useState<Shop[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchShops = async () => {
      try {
        const response = await fetch('/api/admin/shops')
        if (!response.ok) {
          throw new Error('Failed to fetch shops')
        }
        const data = await response.json()
        setShops(data)
      } catch (err) {
        console.error('Error fetching shops:', err)
        setError('Failed to load shops')
        toast.error('Failed to load shops')
      } finally {
        setLoading(false)
      }
    }

    fetchShops()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this shop?')) {
      return
    }

    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to delete shop')
      }

      // Remove from local state immediately
      setShops(shops.filter(shop => shop.id !== id))
      toast.success('Shop deleted successfully')
      
      // Also refresh the data to ensure consistency
      setTimeout(() => {
        window.location.reload()
      }, 1000)
    } catch (err) {
      console.error('Error deleting shop:', err)
      toast.error('Failed to delete shop')
    }
  }

  const handleApprove = async (id: string) => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'approved',
          reviewNotes: 'Approved from admin shops page',
          reviewedBy: 'admin'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve shop')
      }

      // Update the shop status in the local state
      setShops(shops.map(shop => 
        shop.id === id ? { ...shop, status: 'approved' } : shop
      ))
      toast.success('Shop approved successfully')
    } catch (err) {
      console.error('Error approving shop:', err)
      toast.error('Failed to approve shop')
    }
  }

  const handleReject = async (id: string) => {
    try {
      const response = await fetch(`/api/shops/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: 'rejected',
          reviewNotes: 'Rejected from admin shops page',
          reviewedBy: 'admin'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject shop')
      }

      // Update the shop status in the local state
      setShops(shops.map(shop => 
        shop.id === id ? { ...shop, status: 'rejected' } : shop
      ))
      toast.success('Shop rejected successfully')
    } catch (err) {
      console.error('Error rejecting shop:', err)
      toast.error('Failed to reject shop')
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">Pending</span>
      case 'approved':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">Approved</span>
      case 'rejected':
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">Rejected</span>
      default:
        return <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">{status}</span>
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Shops</h1>
        <Button onClick={() => router.push('/admin/shops/new')}>
          Add New Shop
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {shops.map((shop) => (
          <Card key={shop.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
              <CardTitle className="text-lg">{shop.name}</CardTitle>
                {getStatusBadge(shop.status)}
              </div>
            </CardHeader>
            <CardContent>
              {shop.imageUrl && (
                <img
                  src={shop.imageUrl}
                  alt={shop.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                />
              )}
              <div className="space-y-2">
                <p><strong>Location:</strong> {shop.location}</p>
                <p><strong>State:</strong> {shop.state}</p>
                <p><strong>Created:</strong> {new Date(shop.createdAt).toLocaleDateString()}</p>
                <div className="flex justify-end space-x-2 mt-4">
                  {shop.status === 'pending' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleApprove(shop.id)}
                        className="bg-green-50 text-green-700 hover:bg-green-100"
                      >
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleReject(shop.id)}
                        className="bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Reject
                      </Button>
                    </>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => router.push(`/admin/shops/${shop.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(shop.id)}
                  >
                    Delete
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