import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    console.log('Updating DJ:', id, 'with data:', data)
    
    const db = getDb()
    const djRef = db.collection('djs').doc(id)
    const djDoc = await djRef.get()
    
    if (!djDoc.exists) {
      return NextResponse.json(
        { error: 'DJ not found' },
        { status: 404 }
      )
    }
    
    // Only update the status field
    await djRef.update({
      status: data.status,
      updatedAt: new Date().toISOString()
    })
    
    console.log('DJ updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating DJ:', error)
    return NextResponse.json(
      { error: 'Failed to update DJ' },
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
    
    console.log('Deleting DJ:', id)
    
    const db = getDb()
    const djRef = db.collection('djs').doc(id)
    const djDoc = await djRef.get()
    
    if (!djDoc.exists) {
      return NextResponse.json(
        { error: 'DJ not found' },
        { status: 404 }
      )
    }
    
    await djRef.delete()
    
    console.log('DJ deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting DJ:', error)
    return NextResponse.json(
      { error: 'Failed to delete DJ' },
      { status: 500 }
    )
  }
} 