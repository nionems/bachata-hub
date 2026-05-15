import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

export async function POST(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { action, userId } = await request.json()
    if (action !== 'like' && action !== 'unlike') {
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

      const likedBy: string[] = eventDoc.data()?.likedBy ?? []
      const alreadyLiked = likedBy.includes(userId)

      if (action === 'like' && !alreadyLiked) {
        transaction.update(eventRef, {
          likedBy: FieldValue.arrayUnion(userId),
          likesCount: FieldValue.increment(1),
        })
      } else if (action === 'unlike' && alreadyLiked) {
        transaction.update(eventRef, {
          likedBy: FieldValue.arrayRemove(userId),
          likesCount: FieldValue.increment(-1),
        })
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating like:', error)
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 })
  }
}
