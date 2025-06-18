import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

export const revalidate = 3600 // Revalidate every hour

export async function GET() {
  try {
    const accommodationsRef = collection(db, 'accommodations')
    const accommodationsSnapshot = await getDocs(accommodationsRef)
    
    const accommodations = accommodationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(accommodations, {
      headers: {
        'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (error) {
    console.error('Error in GET /api/accommodations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Creating new accommodation:', data)

    const accommodationsRef = collection(db, 'accommodations')
    const docRef = await addDoc(accommodationsRef, {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    console.log('Accommodation created with ID:', docRef.id)
    return NextResponse.json({ id: docRef.id, message: 'Accommodation created successfully' })
  } catch (error) {
    console.error('Error in POST /api/accommodations:', error)
    return NextResponse.json(
      { error: 'Failed to create accommodation' },
      { status: 500 }
    )
  }
} 