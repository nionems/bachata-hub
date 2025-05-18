'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { AlertCircle, CheckCircle } from 'lucide-react'
import { doc, setDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { useRouter } from 'next/navigation'

export function SubscribeForm() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      // Create a document in the users collection
      const userRef = doc(db, 'users', email)
      await setDoc(userRef, {
        email,
        name,
        subscribedAt: new Date().toISOString(),
        role: 'subscriber'
      })
      setSuccess(true)
      setEmail('')
      setName('')
      setLoading(false)
      // Redirect to home page after 2 seconds
      setTimeout(() => {
        router.push('/')
      }, 2000)
    } catch (error: any) {
      setError('Failed to subscribe. Please try again later.')
      console.error('Error subscribing:', error)
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="flex items-center justify-center">
        <div className="space-y-4 max-w-md w-full p-6">
          <Alert>
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Thank you for joining our community! We'll keep you updated with the latest Bachata news and events.
            </AlertDescription>
          </Alert>
          <p className="text-sm text-gray-500 text-center">
            Redirecting to home page...
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center">
      <form onSubmit={handleSubmit} className="space-y-4 max-w-md w-full p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            placeholder="Enter your name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>

        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? (
            <div className="flex items-center justify-center gap-2">
              <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
              <span>Joining...</span>
            </div>
          ) : (
            'Join the Community'
          )}
        </Button>
      </form>
    </div>
  )
}