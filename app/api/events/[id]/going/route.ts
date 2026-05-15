import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action, userId } = await request.json()
    if (action !== 'going' && action !== 'notgoing') {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const db = getDb()
    const eventRef = db.collection('events').doc(params.id)

    await db.runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef)
      if (!eventDoc.exists) throw new Error('Event not found')

      const goingBy: string[] = eventDoc.data()?.goingBy ?? []
      const alreadyGoing = goingBy.includes(userId)

      if (action === 'going' && !alreadyGoing) {
        transaction.update(eventRef, {
          goingBy: FieldValue.arrayUnion(userId),
          goingCount: FieldValue.increment(1),
        })
      } else if (action === 'notgoing' && alreadyGoing) {
        transaction.update(eventRef, {
          goingBy: FieldValue.arrayRemove(userId),
          goingCount: FieldValue.increment(-1),
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating going:', error)
    return NextResponse.json({ error: 'Failed to update going' }, { status: 500 })
  }
}
