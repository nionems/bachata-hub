import { NextResponse } from 'next/server'
import { getCalendarEvents } from '@/lib/calendar-cache'
import type { UpcomingCalendarEvent } from '@/lib/calendar-events'

export type { UpcomingCalendarEvent }

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const force = searchParams.get('force') === '1'
  const events = await getCalendarEvents(force)
  return NextResponse.json(events)
}
