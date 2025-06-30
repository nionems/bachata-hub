import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

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
    const festivalsRef = collection(db, 'festivals')
    const snapshot = await getDocs(festivalsRef)
    
    const festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FestivalData[]

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