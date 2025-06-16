import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

export async function GET() {
  try {
    console.log('Starting GET /api/accommodations')
    
    const accommodationsRef = collection(db, 'accommodations')
    const accommodationsSnapshot = await getDocs(accommodationsRef)
    console.log('Number of accommodations found:', accommodationsSnapshot.size)

    const accommodations = accommodationsSnapshot.docs.map(doc => {
      const data = doc.data()
      console.log('Accommodation data:', { id: doc.id, ...data })
      return {
        id: doc.id,
        ...data
      }
    })

    console.log('Returning accommodations:', accommodations)
    return NextResponse.json(accommodations)
  } catch (error) {
    console.error('Error in GET /api/accommodations:', error)
    return NextResponse.json([])
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