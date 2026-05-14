import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

// POST /api/push/subscribe — save a push subscription
export async function POST(request: Request) {
  try {
    const { subscription, state } = await request.json()
    if (!subscription?.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 })
    }

    const db = getDb()
    // Use endpoint hash as document ID to avoid duplicates
    const id = Buffer.from(subscription.endpoint).toString('base64').slice(0, 64)

    await db.collection('pushSubscriptions').doc(id).set({
      subscription,
      state: state || 'all',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }, { merge: true })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error saving push subscription:', error)
    return NextResponse.json({ error: 'Failed to save subscription' }, { status: 500 })
  }
}

// DELETE /api/push/subscribe — remove a subscription
export async function DELETE(request: Request) {
  try {
    const { endpoint } = await request.json()
    const id = Buffer.from(endpoint).toString('base64').slice(0, 64)
    const db = getDb()
    await db.collection('pushSubscriptions').doc(id).delete()
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Failed to remove subscription' }, { status: 500 })
  }
}
