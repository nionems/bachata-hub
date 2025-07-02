import { NextResponse } from 'next/server'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { Shop } from '@/types/shop'

export async function GET() {
  try {
    const shopsSnapshot = await getDocs(collection(db, 'shops'))
    const shops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Shop[]

    console.log('Admin shops API - Total shops found:', shops.length)
    console.log('Admin shops API - Shops with status:', shops.map(s => ({ id: s.id, name: s.name, status: s.status })))

    // Return all shops for admin management
    const response = NextResponse.json(shops)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    return response
  } catch (error) {
    console.error('Error fetching shops for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
} 