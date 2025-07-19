import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// Enhanced in-memory cache for competitions
let competitionsCache: any[] | null = null
let cacheTimestamp: number = 0
const CACHE_DURATION = 10 * 60 * 1000 // 10 minutes

interface CompetitionData {
  id: string
  name: string
  organizer: string
  email: string
  startDate: string
  endDate: string
  location: string
  state: string
  country: string
  address: string
  eventLink: string
  price: string
  ticketLink: string
  resultLink: string
  danceStyles: string[]
  imageUrl: string
  comment: string
  googleMapLink: string
  categories: string[]
  level: string[]
  socialLink: string
  instagramLink: string
  facebookLink: string
  status?: 'pending' | 'approved' | 'rejected'
  published?: boolean
  createdAt: string
  updatedAt: string
}

export async function GET(request: Request) {
  const startTime = Date.now()
  const url = new URL(request.url)
  const clearCache = url.searchParams.get('clearCache') === 'true'
  const admin = url.searchParams.get('admin')
  
  try {
    // Check cache (unless clearing cache or admin request)
    if (!clearCache && !admin && competitionsCache && Date.now() - cacheTimestamp < CACHE_DURATION) {
      console.log('API Route (GET /api/competitions): Returning cached competitions. Time:', Date.now() - startTime, 'ms')
      return NextResponse.json(competitionsCache)
    }

    // Clear cache if requested
    if (clearCache) {
      competitionsCache = null
      cacheTimestamp = 0
      console.log('API Route (GET /api/competitions): Cache cleared')
    }

    const db = getDb();

    let competitionsRef: any = db.collection('competitions')
    
    // If not admin, only get published competitions
    if (!admin) {
      competitionsRef = competitionsRef.where('published', '==', true)
    }
    
    competitionsRef = competitionsRef.orderBy('name') // Pre-sort by name to reduce client-side processing
    
    const snapshot = await competitionsRef.get()
    console.log(`API Route (GET /api/competitions): Fetched ${snapshot.docs.length} competitions from Firestore in ${Date.now() - startTime}ms`)

    let competitions = snapshot.docs.map((doc: any) => ({
      id: doc.id,
      ...doc.data()
    })) as CompetitionData[]

    // If not admin, filter to only approved competitions
    if (!admin) {
      const beforeFilter = competitions.length
      competitions = competitions.filter(competition => competition.status === 'approved' || !competition.status)
      const afterFilter = competitions.length
      console.log(`API Route: Filtered competitions - before: ${beforeFilter}, after: ${afterFilter}`)
      
      // Log competitions that didn't pass the filter
      const filteredOut = competitions.filter(competition => competition.status !== 'approved' && competition.status)
      if (filteredOut.length > 0) {
        console.log('Competitions filtered out due to status:', filteredOut.map(c => ({ id: c.id, name: c.name, status: c.status, published: c.published })))
      }
    }

    // Update cache only for non-admin requests
    if (!admin) {
      competitionsCache = competitions
      cacheTimestamp = Date.now()
    }

    console.log(`API Route (GET /api/competitions): Returning ${competitions.length} competitions. Total time: ${Date.now() - startTime}ms`)

    return NextResponse.json(competitions)
  } catch (error) {
    console.error('Failed to fetch competitions:', error)
    
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
        error: 'Failed to fetch competitions',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received competition creation request');
    const data = await request.json();
    console.log('Received data:', data);

    const {
      name,
      organizer,
      email,
      startDate,
      endDate,
      location,
      state,
      address,
      eventLink,
      price,
      ticketLink,
      resultLink,
      danceStyles,
      imageUrl,
      comment,
      googleMapLink,
      categories,
      level,
      socialLink,
      instagramLink,
      facebookLink
    } = data;

    // Validate required fields
    if (!name || !organizer || !email || !startDate || !location || !state) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const competitionData = {
      name,
      organizer,
      email,
      startDate,
      endDate: endDate || startDate,
      location,
      state,
      country: 'Australia', // Competitions are Australia-only
      address: address || '',
      eventLink: eventLink || '',
      price: price || '',
      ticketLink: ticketLink || '',
      resultLink: resultLink || '',
      danceStyles: danceStyles || [],
      imageUrl: imageUrl || '',
      comment: comment || '',
      googleMapLink: googleMapLink || '',
      categories: categories || [],
      level: level || [],
      socialLink: socialLink || '',
      instagramLink: instagramLink || '',
      facebookLink: facebookLink || '',
      status: 'pending',
      published: false, // Start as unpublished until approved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Processed competition data:', competitionData);

    const db = getDb();

    // Add to Firestore competitions collection
    const competitionsRef = db.collection('competitions')
    const docRef = await competitionsRef.add(competitionData)

    console.log('Competition created with ID:', docRef.id);

    return NextResponse.json({
      id: docRef.id,
      ...competitionData
    })

  } catch (error) {
    console.error('Failed to create competition:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to create competition',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 