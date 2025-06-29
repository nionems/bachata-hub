import { NextResponse } from 'next/server'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const docRef = doc(db, 'pending_items', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Pending item not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: docSnap.id,
      ...docSnap.data()
    })
  } catch (error) {
    console.error('Error fetching pending item:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending item' },
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
    const { action, reviewNotes, reviewedBy } = body

    if (!action || !['approve', 'reject'].includes(action)) {
      return NextResponse.json(
        { error: 'Invalid action. Must be "approve" or "reject"' },
        { status: 400 }
      )
    }

    const docRef = doc(db, 'pending_items', id)
    const docSnap = await getDoc(docRef)

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Pending item not found' },
        { status: 404 }
      )
    }

    const pendingItem = docSnap.data()
    const now = new Date().toISOString()

    if (action === 'approve') {
      // Move to shops collection
      const shopData = {
        name: pendingItem.name,
        location: pendingItem.location,
        state: pendingItem.state,
        address: pendingItem.address,
        contactName: pendingItem.contactName,
        contactEmail: pendingItem.contactEmail,
        contactPhone: pendingItem.contactPhone,
        website: pendingItem.website,
        instagramUrl: pendingItem.instagramUrl,
        facebookUrl: pendingItem.facebookUrl,
        price: pendingItem.price,
        condition: pendingItem.condition,
        comment: pendingItem.comment,
        discountCode: pendingItem.discountCode,
        imageUrl: pendingItem.imageUrl,
        googleMapLink: pendingItem.googleMapLink,
        info: pendingItem.info,
        createdAt: now,
        updatedAt: now
      }

      // Add to shops collection
      await addDoc(collection(db, 'shops'), shopData)

      // Update pending item status
      await updateDoc(docRef, {
        status: 'approved',
        reviewedAt: now,
        reviewedBy: reviewedBy || 'admin',
        reviewNotes: reviewNotes || ''
      })

      return NextResponse.json({ 
        message: 'Shop item approved and moved to shops collection',
        shopData 
      })
    } else if (action === 'reject') {
      // Update pending item status to rejected
      await updateDoc(docRef, {
        status: 'rejected',
        reviewedAt: now,
        reviewedBy: reviewedBy || 'admin',
        reviewNotes: reviewNotes || ''
      })

      return NextResponse.json({ 
        message: 'Shop item rejected' 
      })
    }
  } catch (error) {
    console.error('Error updating pending item:', error)
    return NextResponse.json(
      { error: 'Failed to update pending item' },
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
    const docRef = doc(db, 'pending_items', id)
    await deleteDoc(docRef)

    return NextResponse.json({ message: 'Pending item deleted successfully' })
  } catch (error) {
    console.error('Error deleting pending item:', error)
    return NextResponse.json(
      { error: 'Failed to delete pending item' },
      { status: 500 }
    )
  }
} 