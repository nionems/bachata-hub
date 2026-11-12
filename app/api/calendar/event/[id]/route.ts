import { NextResponse } from 'next/server'
import { getCalendarEvents } from '@/lib/calendar-cache'

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const { searchParams } = new URL(request.url)
  const force = searchParams.get('force') === '1'
  const events = await getCalendarEvents(force)
  const event = events.find(e => e.id === params.id)
  if (!event) return NextResponse.json({ error: 'Event not found' }, { status: 404 })
  return NextResponse.json(event)
}
