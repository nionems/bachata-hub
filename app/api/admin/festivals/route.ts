import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

interface FestivalData {
  id: string
  name: string
  date: string
  time: string
  location: string
  state: string
  price?: string
  description?: string
  imageUrl?: string
  websiteUrl?: string
  ticketLink?: string
  googleMapLink?: string
  startDate?: string
  endDate?: string
  eventLink?: string
  comment?: string
  featured?: 'yes' | 'no'
  published?: boolean
  [key: string]: any // Allow for additional properties
}

export async function GET() {
  try {
    const db = getDb()
    const festivalsRef = db.collection('festivals')
    const snapshot = await festivalsRef.get()
    
    const festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FestivalData[]

    console.log(`Admin festivals API: Fetched ${festivals.length} festivals (all festivals including unpublished)`)
    
    // Return all festivals for admin (including unpublished ones)
    return NextResponse.json(festivals)
  } catch (error) {
    console.error('Failed to fetch festivals for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch festivals' },
      { status: 500 }
    )
  }
} 