import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

// GET /api/schools/counts?userId=xxx
// Returns { counts: { [schoolId]: number }, likedByUser: string[] }
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    const db = getDb()
    const snapshot = await db.collection('schoolLikes').get()

    const counts: Record<string, number> = {}
    const likedByUser: string[] = []

    snapshot.docs.forEach(doc => {
      counts[doc.id] = doc.data().likesCount ?? 0
      if (userId && (doc.data().likedBy ?? []).includes(userId)) {
        likedByUser.push(doc.id)
      }
    })

    return NextResponse.json({ counts, likedByUser })
  } catch (error) {
    console.error('Error fetching school counts:', error)
    return NextResponse.json({ counts: {}, likedByUser: [] })
  }
}
