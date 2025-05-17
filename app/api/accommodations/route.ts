import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET() {
  try {
    const accommodationsSnapshot = await db.collection('accommodations').get()
    const accommodations = accommodationsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(accommodations)
  } catch (error) {
    console.error('Error fetching accommodations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodations' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const docRef = await db.collection('accommodations').add({
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ id: docRef.id, message: 'Accommodation created successfully' })
  } catch (error) {
    console.error('Error creating accommodation:', error)
    return NextResponse.json(
      { error: 'Failed to create accommodation' },
      { status: 500 }
    )
  }
} 