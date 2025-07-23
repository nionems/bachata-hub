import { NextResponse } from 'next/server'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Competition } from '@/types/competition'

export async function GET() {
  try {
    const competitionsSnapshot = await getDocs(collection(db, 'competitions'))
    const competitions = competitionsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Competition[]

    console.log('Admin competitions API - Total competitions found:', competitions.length)
    console.log('Admin competitions API - Competitions with status:', competitions.map(c => ({ id: c.id, name: c.name, status: c.status })))

    // Return all competitions for admin management
    const response = NextResponse.json(competitions)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching competitions for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    )
  }
} 