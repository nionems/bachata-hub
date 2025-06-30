import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// Simple in-memory cache for festivals
let festivalsCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

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
  const startTime = Date.now()
  
  // Check cache first
  const now = Date.now()
  if (festivalsCache && (now - cacheTimestamp) < CACHE_DURATION) {
    console.log(`API Route (GET /api/festivals): Returning cached data. Cache age: ${now - cacheTimestamp}ms`)
    return NextResponse.json(festivalsCache)
  }
  
  try {
    console.log('API Route (GET /api/festivals): Starting fetch...')
    
    const festivalsRef = db.collection('festivals')
    const snapshot = await festivalsRef.get()
    
    console.log(`API Route (GET /api/festivals): Fetched ${snapshot.docs.length} festivals from Firestore in ${Date.now() - startTime}ms`)
    
    const festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FestivalData[]

    // Filter to only show published festivals (published: true or undefined for backward compatibility)
    const publishedFestivals = festivals.filter(festival => 
      festival.published !== false // Show if published is true or undefined
    )

    // Update cache
    festivalsCache = publishedFestivals
    cacheTimestamp = now

    console.log(`API Route (GET /api/festivals): Returning ${publishedFestivals.length} published festivals. Total time: ${Date.now() - startTime}ms`)

    return NextResponse.json(publishedFestivals)
  } catch (error) {
    console.error('Failed to fetch festivals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch festivals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json() as Partial<FestivalData>
    
    // Add timestamp and published field to the festival data
    const festivalData = {
      ...data,
      published: data.published !== undefined ? data.published : true, // Default to published
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Creating festival with data:', festivalData) // Debug log

    // Add to Firestore festivals collection
    const festivalsRef = db.collection('festivals')
    const docRef = await festivalsRef.add(festivalData)

    console.log('Festival created with ID:', docRef.id) // Debug log

    return NextResponse.json({
      id: docRef.id,
      ...festivalData
    })

  } catch (error) {
    console.error('Failed to create festival:', error)
    return NextResponse.json(
      { error: 'Failed to create festival' },
      { status: 500 }
    )
  }
} 