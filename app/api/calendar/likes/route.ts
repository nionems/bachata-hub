import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// GET /api/calendar/likes?userId=xxx
// Returns { counts: { [eventId]: number }, likedByUser: string[] }
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const db = getDb()
    const snapshot = await db.collection('calendarEventLikes').get()

    const counts: Record<string, number> = {}
    const likedByUser: string[] = []

    snapshot.docs.forEach(doc => {
      counts[doc.id] = doc.data().count ?? 0
      if (userId && (doc.data().likedBy ?? []).includes(userId)) {
        likedByUser.push(doc.id)
      }
    })

    return NextResponse.json({ counts, likedByUser })
  } catch (error) {
    console.error('Error fetching calendar likes:', error)
    return NextResponse.json({ counts: {}, likedByUser: [] })
  }
}

// POST /api/calendar/likes — { eventId, action: 'like' | 'unlike', userId }
export async function POST(request: Request) {
  try {
    const { eventId, action, userId } = await request.json()
    if (!eventId || (action !== 'like' && action !== 'unlike')) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }
    if (!userId) {
      return NextResponse.json({ error: 'userId required' }, { status: 400 })
    }

    const db = getDb()
    const ref = db.collection('calendarEventLikes').doc(eventId)

    await db.runTransaction(async (transaction) => {
      const doc = await transaction.get(ref)
      const likedBy: string[] = doc.exists ? (doc.data()?.likedBy ?? []) : []
      const alreadyLiked = likedBy.includes(userId)

      if (action === 'like' && !alreadyLiked) {
        transaction.set(
          ref,
          {
            count: FieldValue.increment(1),
            likedBy: FieldValue.arrayUnion(userId),
          },
          { merge: true }
        )
      } else if (action === 'unlike' && alreadyLiked) {
        transaction.set(
          ref,
          {
            count: FieldValue.increment(-1),
            likedBy: FieldValue.arrayRemove(userId),
          },
          { merge: true }
        )
      }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating calendar like:', error)
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 })
  }
}
