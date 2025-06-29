import { NextResponse } from 'next/server'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET() {
  try {
    const shopsSnapshot = await getDocs(collection(db, 'shops'))
    const shops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Return all shops for admin management
    return NextResponse.json(shops)
  } catch (error) {
    console.error('Error fetching shops for admin:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
} 