import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, updateDoc, deleteDoc, getDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mediaDoc = await getDoc(doc(db, 'medias', params.id))
    if (!mediaDoc.exists()) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }
    return NextResponse.json({ id: mediaDoc.id, ...mediaDoc.data() })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    console.log('Updating media:', id, 'with data:', data)
    
    const mediaRef = doc(db, 'medias', id)
    const mediaDoc = await getDoc(mediaRef)
    
    if (!mediaDoc.exists()) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    // Only update the status field
    await updateDoc(mediaRef, {
      status: data.status,
      updatedAt: new Date()
    })
    
    console.log('Media updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
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
    
    console.log('Deleting media:', id)
    
    const mediaRef = doc(db, 'medias', id)
    const mediaDoc = await getDoc(mediaRef)
    
    if (!mediaDoc.exists()) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    await deleteDoc(mediaRef)
    
    console.log('Media deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
} 
 
 
 