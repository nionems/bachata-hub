import { db } from '@/lib/firebase'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { NextResponse } from 'next/server'

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
    console.log('Attempting to delete shop with ID:', id)
    
    const docRef = doc(db, 'shops', id)
    await deleteDoc(docRef)

    console.log('Shop deleted successfully:', id)
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
    console.log('Received update data:', body)
    
    const {
      name,
      location,
      state,
      address,
      contactName,
      contactEmail,
      contactPhone,
      comment,
      googleMapLink,
      imageUrl,
      website,
      discountCode,
      price,
      instagramUrl,
      facebookUrl,
      condition,
      info,
      status,
      reviewNotes,
      reviewedBy
    } = body

    console.log('Status being updated:', status)

    // If this is just a status update (approval/rejection), don't require all fields
    if (status && ['approved', 'rejected', 'pending'].includes(status)) {
      const updateData: any = {
        status,
        updatedAt: new Date().toISOString(),
      }

      // Add review information if provided
      if (reviewNotes) updateData.reviewNotes = reviewNotes
      if (reviewedBy) updateData.reviewedBy = reviewedBy
      if (status === 'approved' || status === 'rejected') {
        updateData.reviewedAt = new Date().toISOString()
      }

      console.log('Updating shop status with data:', updateData)

      const docRef = doc(db, 'shops', id)
      await updateDoc(docRef, updateData)

      console.log('Shop status updated successfully')
      return NextResponse.json({ message: 'Shop status updated successfully' })
    }

    // Full update requires all fields
    if (!name || !location || !state) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const updateData = {
      name,
      location,
      state,
      address,
      contactName,
      contactEmail,
      contactPhone,
      comment,
      googleMapLink,
      imageUrl,
      website,
      discountCode,
      price,
      instagramUrl,
      facebookUrl,
      condition,
      info,
      status,
      updatedAt: new Date().toISOString(),
    }

    console.log('Updating shop with data:', updateData)

    const docRef = doc(db, 'shops', id)
    await updateDoc(docRef, updateData)

    console.log('Shop updated successfully')
    return NextResponse.json({ message: 'Shop updated successfully' })
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    )
  }
} 