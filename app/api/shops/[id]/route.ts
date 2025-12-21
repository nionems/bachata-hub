import { getDb } from '@/lib/firebase-admin'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
    const db = getDb()
    const docSnap = await db.collection('shops').doc(id).get()

    if (!docSnap.exists) {
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
    console.log('Attempting to delete shop with ID:', id)
    
    const db = getDb()
    await db.collection('shops').doc(id).delete()

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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const resolvedParams = params instanceof Promise ? await params : params
    const { id } = resolvedParams
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

    // Check if this is ONLY a status update (has status but no other fields)
    // If name is present, it's a full update, not just a status update
    const isStatusOnlyUpdate = status && ['approved', 'rejected', 'pending'].includes(status) && !name

    // If this is just a status update (approval/rejection), don't require all fields
    if (isStatusOnlyUpdate) {
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

      const db = getDb()
      await db.collection('shops').doc(id).update(updateData)

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

    const db = getDb()
    await db.collection('shops').doc(id).update(updateData)

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