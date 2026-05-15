import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { cookies } from 'next/headers'
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

async function sendToAllSubscribers(title: string, body: string, url: string) {
  const db = getDb()
  const subsSnapshot = await db.collection('pushSubscriptions').get()
  if (subsSnapshot.empty) return { sent: 0, stale: 0 }

  let sent = 0
  const stale: string[] = []

  await Promise.allSettled(
    subsSnapshot.docs.map(async (doc) => {
      const { subscription } = doc.data()
      try {
        await webpush.sendNotification(subscription, JSON.stringify({ title, body, url }))
        sent++
      } catch (err: any) {
        if (err.statusCode === 410 || err.statusCode === 404) {
          stale.push(doc.id)
        }
      }
    })
  )

  await Promise.all(stale.map(id => db.collection('pushSubscriptions').doc(id).delete()))
  return { sent, stale: stale.length }
}

// Called by Vercel Cron daily — sends notifications for events happening in next 48h
export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDb()
    const now = new Date()
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    const eventsSnapshot = await db.collection('events').where('published', '==', true).get()

    const upcomingEvents = eventsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as any))
      .filter(event => {
        if (!event.nextDate && !event.eventDate && !event.date) return false
        const dateStr = event.nextDate || event.eventDate || event.date
        const eventDate = new Date(dateStr)
        return eventDate >= now && eventDate <= in48h
      })

    if (upcomingEvents.length === 0) return NextResponse.json({ sent: 0 })

    const eventNames = upcomingEvents.slice(0, 3).map((e: any) => e.name).join(', ')
    const title = '🎶 Bachata Hub — Events coming up!'
    const body = upcomingEvents.length === 1
      ? `${upcomingEvents[0].name} is happening soon — don't miss it!`
      : `${eventNames}${upcomingEvents.length > 3 ? ` +${upcomingEvents.length - 3} more` : ''} coming up!`

    const result = await sendToAllSubscribers(title, body, '/events')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error sending push notifications:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}

// Called manually from admin dashboard — admin cookie required
export async function POST(request: Request) {
  const cookieStore = cookies()
  const adminSession = cookieStore.get('admin_session')
  if (!adminSession || adminSession.value !== 'true') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const { title, body, url } = await request.json()
    if (!title || !body) {
      return NextResponse.json({ error: 'title and body are required' }, { status: 400 })
    }

    const result = await sendToAllSubscribers(title, body, url || '/')
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error sending push notification:', error)
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 })
  }
}
