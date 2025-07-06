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

    const now = new Date().toISOString()

    // Try to find the item in pending_items collection first
    let docRef = doc(db, 'pending_items', id)
    let docSnap = await getDoc(docRef)
    let itemData = null
    let collectionName = 'pending_items'

    if (!docSnap.exists()) {
      // If not found in pending_items, try shops collection
      docRef = doc(db, 'shops', id)
      docSnap = await getDoc(docRef)
      collectionName = 'shops'
    }

    if (!docSnap.exists()) {
      return NextResponse.json(
        { error: 'Pending item not found' },
        { status: 404 }
      )
    }

    itemData = docSnap.data()

    if (action === 'approve') {
      if (collectionName === 'pending_items') {
        // Move from pending_items to shops collection
      const shopData = {
          name: itemData.name,
          location: itemData.location,
          state: itemData.state,
          address: itemData.address,
          contactName: itemData.contactName,
          contactEmail: itemData.contactEmail,
          contactPhone: itemData.contactPhone,
          website: itemData.website,
          instagramUrl: itemData.instagramUrl,
          facebookUrl: itemData.facebookUrl,
          price: itemData.price,
          condition: itemData.condition,
          comment: itemData.comment,
          discountCode: itemData.discountCode,
          imageUrl: itemData.imageUrl,
          googleMapLink: itemData.googleMapLink,
          info: itemData.info,
          status: 'approved',
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
      } else {
        // Item is already in shops collection, just update status
        await updateDoc(docRef, {
          status: 'approved',
          reviewedAt: now,
          reviewedBy: reviewedBy || 'admin',
          reviewNotes: reviewNotes || '',
          updatedAt: now
        })

        return NextResponse.json({ 
          message: 'Shop item approved' 
        })
      }
    } else if (action === 'reject') {
      // Update item status to rejected
      await updateDoc(docRef, {
        status: 'rejected',
        reviewedAt: now,
        reviewedBy: reviewedBy || 'admin',
        reviewNotes: reviewNotes || '',
        updatedAt: now
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