import { NextResponse } from 'next/server'
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    console.log('Approving shop with ID:', id)

    // Update the shop status to approved
    const shopRef = doc(db, 'shops', id)
    await updateDoc(shopRef, {
      status: 'approved',
      updatedAt: new Date().toISOString()
    })

    console.log('Shop approved successfully')
    return NextResponse.json({ success: true, message: 'Shop approved successfully' })
  } catch (error) {
    console.error('Error approving shop:', error)
    return NextResponse.json(
      { error: 'Failed to approve shop' },
      { status: 500 }
    )
  }
} 