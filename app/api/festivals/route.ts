import { NextResponse } from 'next/server'
import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'

export const dynamic = 'force-dynamic'

// Enhanced in-memory cache for festivals
let festivalsCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes (increased from 5 minutes)

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
  try {
    // Check cache
    if (festivalsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log('API Route (GET /api/festivals): Returning cached festivals. Time:', Date.now() - startTime, 'ms')
      return NextResponse.json(festivalsCache)
    }

    // Initialize Firebase Admin if not already initialized
    let app;
    if (getApps().length === 0) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      app = getApps()[0];
    }

    const db = getFirestore(app);

    // Query only published festivals with optimized query
    const festivalsRef = db.collection('festivals')
      .where('published', '==', true)
      .orderBy('name') // Pre-sort by name to reduce client-side processing
    
    const snapshot = await festivalsRef.get()
    console.log(`API Route (GET /api/festivals): Fetched ${snapshot.docs.length} published festivals from Firestore in ${Date.now() - startTime}ms`)

    const publishedFestivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Update cache
    festivalsCache = publishedFestivals
    cacheTimestamp = Date.now()

    console.log(`API Route (GET /api/festivals): Returning ${publishedFestivals.length} published festivals. Total time: ${Date.now() - startTime}ms`)

    return NextResponse.json(publishedFestivals)
  } catch (error) {
    console.error('Failed to fetch festivals:', error)
    
    // Log more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch festivals',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
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

    // Initialize Firebase Admin if not already initialized
    let app;
    if (getApps().length === 0) {
      app = initializeApp({
        credential: cert({
          projectId: process.env.FIREBASE_PROJECT_ID,
          clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
          privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
      });
    } else {
      app = getApps()[0];
    }

    const db = getFirestore(app);

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