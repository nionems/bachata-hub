import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Add timestamp to the event data
    const eventData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to Firestore events collection
    const eventsRef = collection(db, 'events')
    const docRef = await addDoc(eventsRef, eventData)

    return NextResponse.json({
      id: docRef.id,
      ...eventData
    })

  } catch (error) {
    console.error('Failed to create event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const eventsRef = collection(db, 'events')
    const snapshot = await getDocs(eventsRef)
    
    const events = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(events)
  } catch (error) {
    console.error('Failed to fetch events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
} 