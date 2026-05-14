import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    if (action !== 'like' && action !== 'unlike') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const db = getDb()
    await db.collection('events').doc(params.id).update({
      likesCount: FieldValue.increment(action === 'like' ? 1 : -1),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating like:', error)
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 })
  }
}
