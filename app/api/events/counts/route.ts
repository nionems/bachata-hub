import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

// GET /api/events/counts?ids=cal_foo,cal_bar,...
// Returns { [canonicalId]: { likesCount: number, goingCount: number } }
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const ids = (searchParams.get('ids') ?? '').split(',').map(s => s.trim()).filter(Boolean)
    if (ids.length === 0) return NextResponse.json({})

    const db = getDb()
    const refs = ids.map(id => db.collection('events').doc(id))
    const docs = await db.getAll(...refs)

    const result: Record<string, { likesCount: number; goingCount: number }> = {}
    for (const doc of docs) {
      if (doc.exists) {
        const data = doc.data()!
        result[doc.id] = {
          likesCount: data.likesCount ?? 0,
          goingCount: data.goingCount ?? 0,
        }
      }
    }

    return NextResponse.json(result)
  } catch (error) {
    console.error('Error fetching event counts:', error)
    return NextResponse.json({})
  }
}
