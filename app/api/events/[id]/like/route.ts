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
      const likedBy: string[] = eventDoc.exists ? (eventDoc.data()?.likedBy ?? []) : []
      const alreadyLiked = likedBy.includes(userId)

      if (action === 'like' && !alreadyLiked) {
        if (eventDoc.exists) {
          transaction.update(eventRef, {
            likedBy: FieldValue.arrayUnion(userId),
            likesCount: FieldValue.increment(1),
          })
        } else {
          // Calendar event — create interaction doc on first like
          transaction.set(eventRef, { likedBy: [userId], likesCount: 1 }, { merge: true })
        }
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
