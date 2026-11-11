import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { getDb } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

function toDateStr(value: any): string {
  if (!value) return ''
  if (value instanceof Timestamp) return value.toDate().toISOString().slice(0, 10)
  if (typeof value === 'string') return value.slice(0, 10)
  if (value?.seconds) return new Date(value.seconds * 1000).toISOString().slice(0, 10)
  return ''
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const adminSession = cookies().get('admin_session')
  const isAuthed =
    (cronSecret && authHeader === `Bearer ${cronSecret}`) ||
    adminSession?.value === 'true'

  if (!isAuthed) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const db = getDb()
  const todayStr = new Date().toISOString().slice(0, 10)
  const nowIso = new Date().toISOString()

  const snap = await db.collection('festivals').where('published', '==', true).get()

  const expired = snap.docs.filter(doc => {
    const d = doc.data()
    const end = toDateStr(d.endDate) || toDateStr(d.startDate)
    return end && end < todayStr
  })

  await Promise.allSettled(
    expired.map(doc =>
      doc.ref.update({
        published: false,
        unpublishedAt: nowIso,
        unpublishReason: 'Auto-unpublished: festival end date passed',
      })
    )
  )

  console.log(`[cron/unpublish-past-festivals] unpublished ${expired.length} festival(s)`)

  return NextResponse.json({
    unpublished: expired.length,
    names: expired.map(d => d.data().name),
  })
}
