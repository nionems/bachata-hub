import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// Enhanced in-memory cache for festivals with better memory management
let festivalsCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 20 * 60 * 1000 // 20 minutes (increased for better performance)

interface FestivalData {
  id: string
  name: string
  date: string
  time: string
  location: string
  state: string
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

// Connection pool for better performance
let dbConnection: any = null
const getDbConnection = () => {
  if (!dbConnection) {
    dbConnection = getDb()
  }
  return dbConnection
}

export async function GET(request: Request) {
  const startTime = Date.now()
  const url = new URL(request.url)
  const clearCache = url.searchParams.get('clearCache') === 'true'
  const admin = url.searchParams.get('admin')
  const limit = url.searchParams.get('limit') ? parseInt(url.searchParams.get('limit')!) : undefined
  
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

    const db = getDbConnection()

    // Optimize query by selecting only necessary fields and using compound queries
    let festivalsRef: any = db.collection('festivals')
    
    // If not admin, only get published festivals
    if (!admin) {
      festivalsRef = festivalsRef.where('published', '==', true)
    }
    
    // Pre-sort by name to reduce client-side processing
    festivalsRef = festivalsRef.orderBy('name')
    
    // Add limit if specified
    if (limit) {
      festivalsRef = festivalsRef.limit(limit)
    }
    
    // Add timeout to prevent hanging queries
    const queryPromise = festivalsRef.get()
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Database query timeout')), 6000) // Reduced timeout
    )
    
    const snapshot = await Promise.race([queryPromise, timeoutPromise]) as any
    
    console.log(`API Route (GET /api/festivals): Fetched ${snapshot.docs.length} festivals from Firestore in ${Date.now() - startTime}ms`)

    // Process data more efficiently with field selection
    const rawFestivals = snapshot.docs.map((doc: any) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        location: data.location,
        state: data.state,
        country: data.country,
        imageUrl: data.imageUrl,
        eventLink: data.eventLink,
        ticketLink: data.ticketLink,
        price: data.price,
        description: data.description,
        ambassadorCode: data.ambassadorCode,
        instagramLink: data.instagramLink,
        facebookLink: data.facebookLink,
        googleMapLink: data.googleMapLink,
        featured: data.featured,
        published: data.published,
        status: data.status,
        // Ensure consistent data structure
        danceStyles: Array.isArray(data.danceStyles) ? data.danceStyles : 
                    typeof data.danceStyles === 'string' ? data.danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean) : 
                    []
      }
    }) as FestivalData[]

    // If not admin, filter to only approved festivals
    let festivals = rawFestivals
    if (!admin) {
      const beforeFilter = festivals.length
      festivals = festivals.filter(festival => festival.status === 'approved' || !festival.status)
      const afterFilter = festivals.length
      console.log(`API Route: Filtered festivals - before: ${beforeFilter}, after: ${afterFilter}`)
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
    
    // Return cached data if available, even if expired
    if (festivalsCache && !admin) {
      console.log('API Route: Returning stale cache due to error')
      return NextResponse.json(festivalsCache)
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
      eventLink,
      ticketLink,
      danceStyles,
      imageUrl,
      ambassadorCode,
      instagramLink,
      facebookLink
    } = data;

    // Validate required fields
    if (!name || !startDate || !location || !state) {
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
      eventLink: eventLink || '',
      ticketLink: ticketLink || '',
      danceStyles: danceStyles || [],
      imageUrl: imageUrl || '',
      ambassadorCode: ambassadorCode || '',
      instagramLink: instagramLink || '',
      facebookLink: facebookLink || '',
      status: 'pending',
      published: false, // Start as unpublished until approved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Processed festival data:', festivalData);

    const db = getDbConnection();

    // Add to Firestore festivals collection
    const festivalsRef = db.collection('festivals')
    const docRef = await festivalsRef.add(festivalData)

    console.log('Festival created with ID:', docRef.id);

    // Clear cache to ensure fresh data
    festivalsCache = null
    cacheTimestamp = 0

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