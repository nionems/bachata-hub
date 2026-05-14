import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { FieldValue } from 'firebase-admin/firestore'

// GET /api/calendar/likes — returns { [eventId]: count } for all liked calendar events
export async function GET() {
  try {
    const db = getDb()
    const snapshot = await db.collection('calendarEventLikes').get()
    const counts: Record<string, number> = {}
    snapshot.docs.forEach(doc => {
      counts[doc.id] = doc.data().count ?? 0
    })
    return NextResponse.json(counts)
  } catch (error) {
    console.error('Error fetching calendar likes:', error)
    return NextResponse.json({})
  }
}

// POST /api/calendar/likes — { eventId, action: 'like' | 'unlike' }
export async function POST(request: Request) {
  try {
    const { eventId, action } = await request.json()
    if (!eventId || (action !== 'like' && action !== 'unlike')) {
      return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
    }

    const db = getDb()
    const ref = db.collection('calendarEventLikes').doc(eventId)
    await ref.set(
      { count: FieldValue.increment(action === 'like' ? 1 : -1) },
      { merge: true }
    )
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating calendar like:', error)
    return NextResponse.json({ error: 'Failed to update like' }, { status: 500 })
  }
}
