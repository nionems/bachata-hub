import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action } = await request.json()
    if (action !== 'going' && action !== 'notgoing') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }

    const db = getDb()
    await db.collection('events').doc(params.id).update({
      goingCount: FieldValue.increment(action === 'going' ? 1 : -1),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating going:', error)
    return NextResponse.json({ error: 'Failed to update going' }, { status: 500 })
  }
}
