import { db, storage } from '../../../../firebase/config'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage'
import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const docRef = doc(db, 'shops', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Shop not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data()
    })
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
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
    const docRef = doc(db, 'shops', id)
    await deleteDoc(docRef)

    return NextResponse.json({ message: 'Shop deleted successfully' })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return NextResponse.json(
      { error: 'Failed to delete shop' },
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
    const body = await request.json()
    const {
      name,
      location,
      state,
      address,
      comment,
      googleReviewLink,
      imageUrl,
      websiteLink,
      discountCode
    } = body

    if (!name || !location || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'shops', id)
    await updateDoc(docRef, {
      name,
      location,
      state,
      address,
      comment,
      googleReviewLink,
      imageUrl,
      websiteLink,
      discountCode,
      updatedAt: new Date().toISOString(),
    })

    return NextResponse.json({ message: 'Shop updated successfully' })
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    )
  }
} 