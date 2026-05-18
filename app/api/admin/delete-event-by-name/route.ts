import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  const cookieStore = cookies()
  const adminSession = cookieStore.get('admin_session')
  if (!adminSession || adminSession.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const name = searchParams.get('name')
  if (!name) {
    return NextResponse.json({ error: 'name query param required' }, { status: 400 })
  }

  const db = getDb()
  const snap = await db.collection('events').get()
  const matches = snap.docs.filter(doc => {
    const n = (doc.data().name || '').toLowerCase()
    return n.includes(name.toLowerCase())
  })

  if (matches.length === 0) {
    return NextResponse.json({ message: 'No matching events found', deleted: [] })
  }

  const deleted: string[] = []
  for (const doc of matches) {
    await doc.ref.delete()
    deleted.push(`${doc.id}: ${doc.data().name}`)
  }

  return NextResponse.json({ message: `Deleted ${deleted.length} event(s)`, deleted })
}
