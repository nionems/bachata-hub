import { NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('Rejecting shop with ID:', id)

    // Update the shop status to rejected
    const shopRef = doc(db, 'shops', id)
    await updateDoc(shopRef, {
      status: 'rejected',
      updatedAt: new Date().toISOString()
    })

    console.log('Shop rejected successfully')
    return NextResponse.json({ success: true, message: 'Shop rejected successfully' })
  } catch (error) {
    console.error('Error rejecting shop:', error)
    return NextResponse.json(
      { error: 'Failed to reject shop' },
      { status: 500 }
    )
  }
} 