import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import webpush from 'web-push'

webpush.setVapidDetails(
  process.env.VAPID_EMAIL!,
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

// Called by Vercel Cron daily — sends notifications for events happening in next 48h
export async function GET(request: Request) {
  // Verify cron secret to prevent unauthorized calls
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  try {
    const db = getDb()

    // Get all push subscriptions
    const subsSnapshot = await db.collection('pushSubscriptions').get()
    if (subsSnapshot.empty) return NextResponse.json({ sent: 0 })

    // Get upcoming events in next 48 hours
    const now = new Date()
    const in48h = new Date(now.getTime() + 48 * 60 * 60 * 1000)
    const eventsSnapshot = await db.collection('events')
      .where('published', '==', true)
      .get()

    const upcomingEvents = eventsSnapshot.docs
      .map(doc => ({ id: doc.id, ...doc.data() } as any))
      .filter(event => {
        if (!event.nextDate && !event.eventDate && !event.date) return false
        const dateStr = event.nextDate || event.eventDate || event.date
        const eventDate = new Date(dateStr)
        return eventDate >= now && eventDate <= in48h
      })

    if (upcomingEvents.length === 0) return NextResponse.json({ sent: 0 })

    // Build notification message
    const eventNames = upcomingEvents.slice(0, 3).map((e: any) => e.name).join(', ')
    const title = '🎶 Bachata Hub — Events coming up!'
    const body = upcomingEvents.length === 1
      ? `${upcomingEvents[0].name} is happening soon — don't miss it!`
      : `${eventNames}${upcomingEvents.length > 3 ? ` +${upcomingEvents.length - 3} more` : ''} coming up!`

    // Send to all subscribers
    let sent = 0
    const stale: string[] = []

    await Promise.allSettled(
      subsSnapshot.docs.map(async (doc) => {
        const { subscription } = doc.data()
        try {
          await webpush.sendNotification(subscription, JSON.stringify({
            title,
            body,
            url: '/events',
          }))
          sent++
        } catch (err: any) {
          // 410 Gone = subscription expired, clean it up
          if (err.statusCode === 410 || err.statusCode === 404) {
            stale.push(doc.id)
          }
        }
      })
    )

    // Remove stale subscriptions
    await Promise.all(stale.map(id => db.collection('pushSubscriptions').doc(id).delete()))

    return NextResponse.json({ sent, stale: stale.length })
  } catch (error) {
    console.error('Error sending push notifications:', error)
    return NextResponse.json({ error: 'Failed to send notifications' }, { status: 500 })
  }
}
