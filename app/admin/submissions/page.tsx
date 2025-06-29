"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Check, X, Eye, Clock, CheckCircle, XCircle, Mail } from "lucide-react"

interface Submission {
  id: string
  type: string
  name: string
  location: string
  state: string
  address: string
  contactName: string
  contactEmail: string
  contactPhone: string
  website: string
  instagramUrl: string
  facebookUrl: string
  price: string
  condition: string
  comment: string
  discountCode: string
  imageUrl: string
  googleMapLink: string
  info: string
  submittedAt: string
  status: 'pending' | 'approved' | 'rejected'
}

export default function SubmissionsPage() {
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null)
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false)
  const [reviewNotes, setReviewNotes] = useState('')
  const [actionLoading, setActionLoading] = useState(false)

  useEffect(() => {
    // For now, we'll show a message that submissions come via email
    // In the future, we could store submissions in a database
    setLoading(false)
  }, [])

  const handleApprove = async () => {
    if (!selectedSubmission) return
    
    setActionLoading(true)
    try {
      // Create approval URL with all submission data
      const approvalUrl = new URL('/api/approve-shop', window.location.origin)
      approvalUrl.searchParams.set('name', selectedSubmission.name)
      approvalUrl.searchParams.set('location', selectedSubmission.location)
      approvalUrl.searchParams.set('state', selectedSubmission.state)
      approvalUrl.searchParams.set('address', selectedSubmission.address)
      approvalUrl.searchParams.set('contactName', selectedSubmission.contactName)
      approvalUrl.searchParams.set('contactEmail', selectedSubmission.contactEmail)
      approvalUrl.searchParams.set('contactPhone', selectedSubmission.contactPhone)
      approvalUrl.searchParams.set('website', selectedSubmission.website)
      approvalUrl.searchParams.set('instagramUrl', selectedSubmission.instagramUrl)
      approvalUrl.searchParams.set('facebookUrl', selectedSubmission.facebookUrl)
      approvalUrl.searchParams.set('price', selectedSubmission.price)
      approvalUrl.searchParams.set('condition', selectedSubmission.condition)
      approvalUrl.searchParams.set('comment', selectedSubmission.comment)
      approvalUrl.searchParams.set('discountCode', selectedSubmission.discountCode)
      approvalUrl.searchParams.set('imageUrl', selectedSubmission.imageUrl)
      approvalUrl.searchParams.set('googleMapLink', selectedSubmission.googleMapLink)
      approvalUrl.searchParams.set('info', selectedSubmission.info)

      // Open approval URL in new window
      window.open(approvalUrl.toString(), '_blank')
      
      toast.success('Approval page opened in new window')
      setReviewDialogOpen(false)
    } catch (error) {
      console.error('Error approving submission:', error)
      toast.error('Failed to approve submission')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async () => {
    if (!selectedSubmission) return
    
    setActionLoading(true)
    try {
      // Create rejection URL
      const rejectionUrl = new URL('/api/reject-shop', window.location.origin)
      rejectionUrl.searchParams.set('name', selectedSubmission.name)
      rejectionUrl.searchParams.set('location', selectedSubmission.location)
      rejectionUrl.searchParams.set('state', selectedSubmission.state)
      rejectionUrl.searchParams.set('contactName', selectedSubmission.contactName)
      rejectionUrl.searchParams.set('contactEmail', selectedSubmission.contactEmail)

      // Open rejection URL in new window
      window.open(rejectionUrl.toString(), '_blank')
      
      toast.success('Rejection page opened in new window')
      setReviewDialogOpen(false)
    } catch (error) {
      console.error('Error rejecting submission:', error)
      toast.error('Failed to reject submission')
    } finally {
      setActionLoading(false)
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
          <div className="text-lg">Loading submissions...</div>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-4">Email Submissions Management</h1>
        <p className="text-gray-600">
          Shop submissions are sent via email. Use the approval/rejection links in the emails to manage submissions.
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="h-5 w-5" />
            How to Manage Submissions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-800 mb-2">📧 Email-Based Approval System</h3>
            <p className="text-blue-700 mb-3">
              When someone submits a shop, you'll receive an email with:
            </p>
            <ul className="list-disc list-inside text-blue-700 space-y-1 ml-4">
              <li><strong>Complete shop details</strong> - All the information submitted</li>
              <li><strong>Approve button</strong> - Adds the shop directly to the database</li>
              <li><strong>Reject button</strong> - Records the rejection</li>
            </ul>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <h3 className="font-semibold text-green-800 mb-2">✅ Approval Process</h3>
            <p className="text-green-700">
              Clicking "Approve" will immediately add the shop to the database and make it live on the website.
              You'll see a confirmation page with the shop details.
            </p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h3 className="font-semibold text-red-800 mb-2">❌ Rejection Process</h3>
            <p className="text-red-700">
              Clicking "Reject" will record the rejection. The shop won't be added to the database.
              You can contact the submitter using their email address.
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-800 mb-2">📋 Current Status</h3>
            <p className="text-yellow-700">
              All submissions are currently managed through email. Check your email inbox for new shop submissions.
              The email address receiving submissions is: <strong>bachata.au@gmail.com</strong>
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Recent Submissions</h2>
        <div className="text-center py-8 text-gray-500">
          <Mail className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <p>Recent submissions will appear here once we implement database tracking.</p>
          <p className="text-sm mt-2">For now, all submissions are managed via email.</p>
        </div>
      </div>
    </div>
  )
} 