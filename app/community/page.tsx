'use client'

import { SubscribeForm } from '@/components/newsletter/SubscribeForm'
import { useEffect, useState } from 'react'
import { collection, getCountFromServer } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export default function CommunityPage() {
  const [userCount, setUserCount] = useState<number | null>(null)

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const coll = collection(db, 'users')
        const snapshot = await getCountFromServer(coll)
        setUserCount(snapshot.data().count)
      } catch (error) {
        console.error('Error fetching user count:', error)
      }
    }

    fetchUserCount()
  }, [])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2 sm:mb-4">
            Join Our Community
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-4">
          Get the best of Bachata.au minus the spam.
Be first to know about upcoming events, enjoy exclusive perks, and score chances to win dance tickets, stylish shoes, or even a limited-edition Bachata T-shirt! 🎁
          </p>
          {userCount !== null && (
            <p className="text-lg text-gray-500">
              Join <span className="font-bold text-primary text-3xl">{userCount}</span> other{userCount !== 1 ? 's' : ''} in our growing community
            </p>
          )}
        </div>
        <div className="max-w-md mx-auto">
          <SubscribeForm />
        </div>
      </div>
    </div>
  )
} 