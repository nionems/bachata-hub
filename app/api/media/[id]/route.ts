import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

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
    const data = await request.json()
    const mediaRef = doc(db, 'medias', params.id)
    await updateDoc(mediaRef, {
      ...data,
      updatedAt: new Date()
    })
    return NextResponse.json({ id: params.id, ...data })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json({ error: 'Failed to update media' }, { status: 500 })
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await deleteDoc(doc(db, 'medias', params.id))
    return NextResponse.json({ message: 'Media deleted successfully' })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json({ error: 'Failed to delete media' }, { status: 500 })
  }
} 
 
 
 