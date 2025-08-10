import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

// Get single instructor
export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const instructorDoc = await db.collection('instructors').doc(params.id).get()
    
    if (!instructorDoc.exists) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: instructorDoc.id,
      ...instructorDoc.data()
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
    
    const db = getDb()
    const instructorRef = db.collection('instructors').doc(id)
    const instructorDoc = await instructorRef.get()
    
    if (!instructorDoc.exists) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }
    
    // Only update the status field
    await instructorRef.update({
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
    
    const db = getDb()
    const instructorRef = db.collection('instructors').doc(id)
    const instructorDoc = await instructorRef.get()
    
    if (!instructorDoc.exists) {
      return NextResponse.json(
        { error: 'Instructor not found' },
        { status: 404 }
      )
    }
    
    await instructorRef.delete()
    
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