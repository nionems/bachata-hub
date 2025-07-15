'use client'

import { useState, FormEvent } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { toast } from 'sonner'
import { Gift, Users, Mail, User } from 'lucide-react'

interface CommunityJoinPopupProps {
  isOpen: boolean
  onClose: () => void
}

interface JoinFormData {
  name: string
  email: string
}

export function CommunityJoinPopup({ isOpen, onClose }: CommunityJoinPopupProps) {
  const [formData, setFormData] = useState<JoinFormData>({
    name: '',
    email: ''
  })

  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      console.log('Sending join form data:', formData)
      
      // Call the API endpoint to save community member
      const response = await fetch('/api/community-join', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to join community')
      }

      console.log('Community join response:', data)
      
      setSuccess(true)
      toast.success('Welcome to the community! 🎉')
      
      // Mark user as joined in localStorage so popup won't show again
      localStorage.setItem('communityJoined', 'true')
      
      setTimeout(() => {
        onClose()
        setFormData({
          name: '',
          email: ''
        })
        setSuccess(false)
      }, 3000)
    } catch (err) {
      console.error('Error in handleSubmit:', err)
      const errorMessage = err instanceof Error ? err.message : 'Failed to join community. Please try again.'
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-[500px] bg-gradient-to-br from-emerald-50 to-violet-50 rounded-xl sm:rounded-2xl border-2 border-emerald-200">
        <DialogHeader className="rounded-t-xl sm:rounded-t-2xl text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-emerald-400 to-violet-500 p-3 rounded-full">
              <Gift className="h-8 w-8 text-white" />
            </div>
          </div>
          <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-violet-600 bg-clip-text text-transparent">
            Win Dance Tickets, Shoes, or a Bachata T-Shirt! 🎁
          </DialogTitle>
          <DialogDescription className="text-base text-gray-700 mt-2">
            Enter your name & email for a chance to win.
            <br />
            <span className="font-semibold text-emerald-600">Winners announced soon — don't miss out!</span>
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-6">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700 font-medium flex items-center gap-2">
              <User className="h-4 w-4" />
              Name *
            </Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
              className="bg-white/80 backdrop-blur-sm rounded-lg border-emerald-200 focus:border-emerald-400"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700 font-medium flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Email Address *
            </Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
              required
              className="bg-white/80 backdrop-blur-sm rounded-lg border-emerald-200 focus:border-emerald-400"
              placeholder="Enter your email address"
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm bg-red-50 p-3 rounded-lg">{error}</div>
          )}

          {success && (
            <div className="text-green-600 text-sm bg-green-50 p-3 rounded-lg font-medium">
              🎉 Welcome to the community! You're now entered to win amazing prizes!
            </div>
          )}

          <div className="bg-gradient-to-r from-emerald-100 to-violet-100 p-4 rounded-lg border border-emerald-200">
            <div className="flex items-center gap-2 text-emerald-700 font-medium mb-2">
              <Users className="h-4 w-4" />
              Join the Bachata Community
            </div>
            <p className="text-sm text-gray-600">
              Connect with dancers, get event updates, and stay in the loop with the latest Bachata news!
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isLoading}
              className="border-emerald-300 text-emerald-700 hover:bg-emerald-50 rounded-lg flex-1"
            >
              Maybe Later
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-gradient-to-r from-emerald-500 to-violet-500 hover:from-emerald-600 hover:to-violet-600 text-white rounded-lg flex-1 font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isLoading ? 'Joining...' : 'Join & Enter to Win! 🎁'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
} 