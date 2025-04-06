import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventRef = doc(db, 'events', params.id)
    await deleteDoc(eventRef)
    
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventRef = doc(db, 'events', params.id)
    const eventSnap = await getDoc(eventRef)
    
    if (!eventSnap.exists()) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: eventSnap.id,
      ...eventSnap.data()
    })
  } catch (error) {
    console.error('Failed to fetch event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const eventRef = doc(db, 'events', params.id)
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    await updateDoc(eventRef, updateData)
    
    return NextResponse.json({
      id: params.id,
      ...updateData
    })
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
} 