import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accommodationRef = doc(db, 'accommodations', params.id)
    const accommodationDoc = await getDoc(accommodationRef)

    if (!accommodationDoc.exists()) {
      return NextResponse.json(
        { error: 'Accommodation not found' },
        { status: 404 }
      )
    }

    const accommodation = {
      id: accommodationDoc.id,
      ...accommodationDoc.data()
    }

    return NextResponse.json(accommodation)
  } catch (error) {
    console.error('Error fetching accommodation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodation' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const accommodationRef = doc(db, 'accommodations', params.id)

    // Update the accommodation document
    await updateDoc(accommodationRef, {
      ...data,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({ message: 'Accommodation updated successfully' })
  } catch (error) {
    console.error('Error updating accommodation:', error)
    return NextResponse.json(
      { error: 'Failed to update accommodation' },
      { status: 500 }
    )
  }
}
