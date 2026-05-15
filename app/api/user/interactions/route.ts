import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

// GET /api/user/interactions?userId=xxx
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json({ likedEvents: [], goingEvents: [] })
    }

    const db = getDb()
    const [likedSnapshot, goingSnapshot] = await Promise.all([
      db.collection('events').where('likedBy', 'array-contains', userId).select().get(),
      db.collection('events').where('goingBy', 'array-contains', userId).select().get(),
    ])

    return NextResponse.json({
      likedEvents: likedSnapshot.docs.map(d => d.id),
      goingEvents: goingSnapshot.docs.map(d => d.id),
    })
  } catch (error) {
    console.error('Error fetching user interactions:', error)
    return NextResponse.json({ likedEvents: [], goingEvents: [] })
  }
}
