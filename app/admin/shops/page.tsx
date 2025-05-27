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
        const response = await fetch('/api/shops')
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

      setShops(shops.filter(shop => shop.id !== id))
      toast.success('Shop deleted successfully')
    } catch (err) {
      console.error('Error deleting shop:', err)
      toast.error('Failed to delete shop')
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
              <CardTitle className="text-lg">{shop.name}</CardTitle>
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
                  <Button
                    variant="outline"
                    onClick={() => router.push(`/admin/shops/${shop.id}/edit`)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
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