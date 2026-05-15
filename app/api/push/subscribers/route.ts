import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'

export async function GET() {
  const cookieStore = cookies()
  const adminSession = cookieStore.get('admin_session')
  if (!adminSession || adminSession.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDb()
    const snapshot = await db.collection('pushSubscriptions').get()
    return NextResponse.json({ count: snapshot.size })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch subscribers' }, { status: 500 })
  }
}
