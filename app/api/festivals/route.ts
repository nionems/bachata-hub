import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

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

export async function GET(request: Request) {
  const startTime = Date.now()
  const url = new URL(request.url)
  const clearCache = url.searchParams.get('clearCache') === 'true'
  const admin = url.searchParams.get('admin')
  
  try {
    // Check cache (unless clearing cache or admin request)
    if (!clearCache && !admin && festivalsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log('API Route (GET /api/festivals): Returning cached festivals. Time:', Date.now() - startTime, 'ms')
      return NextResponse.json(festivalsCache)
    }

    // Clear cache if requested
    if (clearCache) {
      festivalsCache = null
      cacheTimestamp = 0
      console.log('API Route (GET /api/festivals): Cache cleared')
    }

    const db = getDb();

    let festivalsRef = db.collection('festivals')
    
    // If not admin, only get published festivals
    if (!admin) {
      festivalsRef = festivalsRef.where('published', '==', true)
    }
    
    festivalsRef = festivalsRef.orderBy('name') // Pre-sort by name to reduce client-side processing
    
    const snapshot = await festivalsRef.get()
    console.log(`API Route (GET /api/festivals): Fetched ${snapshot.docs.length} festivals from Firestore in ${Date.now() - startTime}ms`)

    let festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as FestivalData[]

    // If not admin, filter to only approved festivals
    if (!admin) {
      festivals = festivals.filter(festival => festival.status === 'approved' || !festival.status)
    }

    // Log featured festivals for debugging
    const featuredFestivals = festivals.filter(f => f.featured === 'yes')
    console.log('Featured festivals from API:', featuredFestivals.map(f => ({ id: f.id, name: f.name, featured: f.featured })))

    // Update cache only for non-admin requests
    if (!admin) {
      festivalsCache = festivals
      cacheTimestamp = Date.now()
    }

    console.log(`API Route (GET /api/festivals): Returning ${festivals.length} festivals. Total time: ${Date.now() - startTime}ms`)

    return NextResponse.json(festivals)
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
    console.log('Received festival creation request');
    const data = await request.json();
    console.log('Received data:', data);

    const {
      name,
      startDate,
      endDate,
      location,
      state,
      country,
      price,
      eventLink,
      ticketLink,
      danceStyles,
      imageUrl,
      comment,
      email,
      instagramLink,
      facebookLink
    } = data;

    // Validate required fields
    if (!name || !startDate || !location || !state || !email) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const festivalData = {
      name,
      startDate,
      endDate: endDate || startDate,
      location,
      state,
      country: country || 'Australia',
      price: price || '',
      eventLink: eventLink || '',
      ticketLink: ticketLink || '',
      danceStyles: danceStyles || [],
      imageUrl: imageUrl || '',
      comment: comment || '',
      instagramLink: instagramLink || '',
      facebookLink: facebookLink || '',
      status: 'pending',
      published: false, // Start as unpublished until approved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Processed festival data:', festivalData);

    const db = getDb();

    // Add to Firestore festivals collection
    const festivalsRef = db.collection('festivals')
    const docRef = await festivalsRef.add(festivalData)

    console.log('Festival created with ID:', docRef.id);

    return NextResponse.json({
      id: docRef.id,
      ...festivalData
    })

  } catch (error) {
    console.error('Failed to create festival:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to create festival',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 