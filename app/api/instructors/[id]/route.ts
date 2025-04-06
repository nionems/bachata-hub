import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

// Get single instructor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const instructorRef = doc(db, 'instructors', params.id)
    const instructorSnap = await getDoc(instructorRef)
    
    if (!instructorSnap.exists()) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: instructorSnap.id,
      ...instructorSnap.data()
    })
  } catch (error) {
    console.error('Failed to fetch instructor:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructor' },
      { status: 500 }
    )
  }
}

// Update instructor
export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const instructorRef = doc(db, 'instructors', params.id)
    
    // Add updated timestamp
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    await updateDoc(instructorRef, updateData)
    
    return NextResponse.json({
      id: params.id,
      ...updateData
    })
  } catch (error) {
    console.error('Failed to update instructor:', error)
    return NextResponse.json(
      { error: 'Failed to update instructor' },
      { status: 500 }
    )
  }
}

// Delete instructor
export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const instructorRef = doc(db, 'instructors', params.id)
    await deleteDoc(instructorRef)
    
    return NextResponse.json({ message: 'Instructor deleted successfully' })
  } catch (error) {
    console.error('Failed to delete instructor:', error)
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    )
  }
} 