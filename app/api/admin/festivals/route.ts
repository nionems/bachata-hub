import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    const festivalsRef = collection(db, 'festivals')
    const snapshot = await getDocs(festivalsRef)
    
    const festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

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