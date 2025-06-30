import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export const dynamic = 'force-dynamic'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const festivalRef = doc(db, 'festivals', params.id)
    await deleteDoc(festivalRef)
    
    return NextResponse.json({ message: 'Festival deleted successfully' })
  } catch (error) {
    console.error('Failed to delete festival:', error)
    return NextResponse.json(
      { error: 'Failed to delete festival' },
      { status: 500 }
    )
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const festivalRef = doc(db, 'festivals', params.id)
    const festivalSnap = await getDoc(festivalRef)
    
    if (!festivalSnap.exists()) {
      return NextResponse.json(
        { error: 'Festival not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: festivalSnap.id,
      ...festivalSnap.data()
    })
  } catch (error) {
    console.error('Failed to fetch festival:', error)
    return NextResponse.json(
      { error: 'Failed to fetch festival' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    console.log('PUT request received for festival:', params.id)
    const data = await request.json()
    console.log('Request data:', data)
    
    const festivalRef = doc(db, 'festivals', params.id)
    
    // Remove the id field from the update data since Firestore doesn't allow updating document IDs
    const { id, ...updateDataWithoutId } = data
    
    const updateData = {
      ...updateDataWithoutId,
      updatedAt: new Date().toISOString()
    }

    console.log('Update data:', updateData)
    await updateDoc(festivalRef, updateData)
    console.log('Festival updated successfully')
    
    return NextResponse.json({
      id: params.id,
      ...updateData
    })
  } catch (error) {
    console.error('Failed to update festival:', error)
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json(
      { error: 'Failed to update festival', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const festivalRef = doc(db, 'festivals', params.id)
    
    // Remove the id field from the update data since Firestore doesn't allow updating document IDs
    const { id, ...updateDataWithoutId } = data
    
    const updateData = {
      ...updateDataWithoutId,
      updatedAt: new Date().toISOString()
    }

    await updateDoc(festivalRef, updateData)
    
    return NextResponse.json({
      id: params.id,
      ...updateData
    })
  } catch (error) {
    console.error('Failed to update festival:', error)
    return NextResponse.json(
      { error: 'Failed to update festival', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 