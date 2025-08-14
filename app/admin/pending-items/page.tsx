"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Check, X, Eye, Clock, CheckCircle, XCircle } from "lucide-react"

interface PendingItem {
  id: string
  type: string
  name: string
  location: string
  state: string
  address?: string
  contactName?: string
  contactEmail?: string
  contactPhone?: string
  website?: string
  instagramUrl?: string
  facebookUrl?: string
  price?: string
  condition?: string
  comment?: string
  discountCode?: string
  imageUrl?: string
  googleMapLink?: string
  info?: string
  // Instructor specific fields
  bio?: string
  danceStyles?: string[]
  privatePricePerHour?: string
  emailLink?: string
  facebookLink?: string
  instagramLink?: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: string
  reviewedAt?: string
  reviewedBy?: string
  reviewNotes?: string
}

export default function PendingItemsPage() {
  const [pendingItems, setPendingItems] = useState<PendingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedItem, setSelectedItem] = useState<PendingItem | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    fetchPendingItems()
  }, [])

  const fetchPendingItems = async () => {
    try {
      const response = await fetch('/api/pending-items')
      if (!response.ok) {
        throw new Error('Failed to fetch pending items')
      }
      const data = await response.json()
      setPendingItems(data)
    } catch (error) {
      console.error('Error fetching pending items:', error)
      toast.error('Failed to fetch pending items')
    } finally {
      setLoading(false)
    }
  }

  const handleReview = (item: PendingItem) => {
    setSelectedItem(item)
    setReviewNotes('')
    setReviewDialogOpen(true)
  }

  const handleApprove = async () => {
    if (!selectedItem) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/pending-items/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'approve',
          reviewNotes,
          reviewedBy: 'admin'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to approve item')
      }

      toast.success('Item approved successfully!')
      setReviewDialogOpen(false)
      fetchPendingItems() // Refresh the list
    } catch (error) {
      console.error('Error approving item:', error)
      toast.error('Failed to approve item')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedItem) return
    
    setActionLoading(true)
    try {
      const response = await fetch(`/api/pending-items/${selectedItem.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'reject',
          reviewNotes,
          reviewedBy: 'admin'
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to reject item')
      }

      toast.success('Item rejected successfully!')
      setReviewDialogOpen(false)
      fetchPendingItems() // Refresh the list
    } catch (error) {
      console.error('Error rejecting item:', error)
      toast.error('Failed to reject item')
    } finally {
      setActionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800"><Clock className="h-3 w-3 mr-1" />Pending</Badge>
      case 'approved':
        return <Badge variant="secondary" className="bg-green-100 text-green-800"><CheckCircle className="h-3 w-3 mr-1" />Approved</Badge>
      case 'rejected':
        return <Badge variant="secondary" className="bg-red-100 text-red-800"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="secondary">{status}</Badge>
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-AU', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading pending items...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Pending Items Review</h1>
        <Button onClick={fetchPendingItems} variant="outline">
          Refresh
        </Button>
      </div>

      {pendingItems.length === 0 ? (
        <Card>
          <CardContent className="flex items-center justify-center h-32">
            <div className="text-center">
              <Clock className="h-8 w-8 mx-auto mb-2 text-gray-400" />
              <p className="text-gray-500">No pending items to review</p>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-4">
          {pendingItems.map((item) => (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">{item.name}</CardTitle>
                    <p className="text-sm text-gray-600">{item.location}, {item.state}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    {getStatusBadge(item.status)}
                    {item.status === 'pending' && (
                      <Button
                        size="sm"
                        onClick={() => handleReview(item)}
                        className="flex items-center gap-1"
                      >
                        <Eye className="h-4 w-4" />
                        Review
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    {item.type === 'instructor' ? (
                      <>
                        <p><strong>Email:</strong> {item.emailLink}</p>
                        <p><strong>Bio:</strong> {item.bio || 'N/A'}</p>
                        <p><strong>Dance Styles:</strong> {Array.isArray(item.danceStyles) ? item.danceStyles.join(', ') : item.danceStyles || 'N/A'}</p>
                        <p><strong>Private Price:</strong> {item.privatePricePerHour || 'N/A'}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Contact:</strong> {item.contactName}</p>
                        <p><strong>Email:</strong> {item.contactEmail}</p>
                        <p><strong>Price:</strong> {item.price}</p>
                        <p><strong>Condition:</strong> {item.condition}</p>
                      </>
                    )}
                  </div>
                  <div>
                    <p><strong>Type:</strong> <span className="capitalize">{item.type}</span></p>
                    <p><strong>Submitted:</strong> {formatDate(item.submittedAt)}</p>
                    {item.reviewedAt && (
                      <p><strong>Reviewed:</strong> {formatDate(item.reviewedAt)}</p>
                    )}
                    {item.reviewNotes && (
                      <p><strong>Notes:</strong> {item.reviewNotes}</p>
                    )}
                  </div>
                </div>
                {(item.info || item.bio) && (
                  <div className="mt-3">
                    <p className="text-sm text-gray-600 line-clamp-2">{item.info || item.bio}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Review Dialog */}
      <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Review Item: {selectedItem?.name}</DialogTitle>
          </DialogHeader>
          
          {selectedItem && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Item Details</h3>
                  <div className="space-y-1 text-sm">
                    <p><strong>Name:</strong> {selectedItem.name}</p>
                    <p><strong>Location:</strong> {selectedItem.location}, {selectedItem.state}</p>
                    <p><strong>Type:</strong> <span className="capitalize">{selectedItem.type}</span></p>
                    {selectedItem.type === 'instructor' ? (
                      <>
                        <p><strong>Email:</strong> {selectedItem.emailLink}</p>
                        <p><strong>Bio:</strong> {selectedItem.bio || 'N/A'}</p>
                        <p><strong>Private Price:</strong> {selectedItem.privatePricePerHour || 'N/A'}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Contact:</strong> {selectedItem.contactName}</p>
                        <p><strong>Email:</strong> {selectedItem.contactEmail}</p>
                        <p><strong>Price:</strong> {selectedItem.price}</p>
                        <p><strong>Condition:</strong> {selectedItem.condition}</p>
                      </>
                    )}
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Additional Info</h3>
                  <div className="space-y-1 text-sm">
                    {selectedItem.type === 'instructor' ? (
                      <>
                        <p><strong>Website:</strong> {selectedItem.website || 'N/A'}</p>
                        <p><strong>Instagram:</strong> {selectedItem.instagramLink || 'N/A'}</p>
                        <p><strong>Facebook:</strong> {selectedItem.facebookLink || 'N/A'}</p>
                        <p><strong>Dance Styles:</strong> {Array.isArray(selectedItem.danceStyles) ? selectedItem.danceStyles.join(', ') : selectedItem.danceStyles || 'N/A'}</p>
                      </>
                    ) : (
                      <>
                        <p><strong>Website:</strong> {selectedItem.website || 'N/A'}</p>
                        <p><strong>Instagram:</strong> {selectedItem.instagramUrl || 'N/A'}</p>
                        <p><strong>Facebook:</strong> {selectedItem.facebookUrl || 'N/A'}</p>
                        <p><strong>Discount Code:</strong> {selectedItem.discountCode || 'N/A'}</p>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {selectedItem.imageUrl && (
                <div>
                  <h3 className="font-semibold mb-2">Image</h3>
                  <img 
                    src={selectedItem.imageUrl} 
                    alt={selectedItem.name}
                    className="w-32 h-32 object-cover rounded-md"
                  />
                </div>
              )}
              
              {(selectedItem.info || selectedItem.bio) && (
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-gray-600">{selectedItem.info || selectedItem.bio}</p>
                </div>
              )}
              
              <div>
                <Label htmlFor="reviewNotes">Review Notes (Optional)</Label>
                <Textarea
                  id="reviewNotes"
                  value={reviewNotes}
                  onChange={(e) => setReviewNotes(e.target.value)}
                  placeholder="Add any notes about your decision..."
                  className="mt-1"
                />
              </div>
              
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  onClick={() => setReviewDialogOpen(false)}
                  disabled={actionLoading}
                >
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleReject}
                  disabled={actionLoading}
                  className="flex items-center gap-1"
                >
                  <X className="h-4 w-4" />
                  Reject
                </Button>
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="flex items-center gap-1"
                >
                  <Check className="h-4 w-4" />
                  Approve
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 