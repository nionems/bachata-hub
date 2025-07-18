import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'

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

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    console.log('Updating instructor:', id, 'with data:', data)
    
    const instructorRef = doc(db, 'instructors', id)
    const instructorDoc = await getDoc(instructorRef)
    
    if (!instructorDoc.exists()) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }
    
    // Only update the status field
    await updateDoc(instructorRef, {
      status: data.status,
      updatedAt: new Date().toISOString()
    })
    
    console.log('Instructor updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating instructor:', error)
    return NextResponse.json(
      { error: 'Failed to update instructor' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log('Deleting instructor:', id)
    
    const instructorRef = doc(db, 'instructors', id)
    const instructorDoc = await getDoc(instructorRef)
    
    if (!instructorDoc.exists()) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }
    
    await deleteDoc(instructorRef)
    
    console.log('Instructor deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting instructor:', error)
    return NextResponse.json(
      { error: 'Failed to delete instructor' },
      { status: 500 }
    )
  }
} 