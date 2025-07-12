import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { google } from 'googleapis'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received event data:', data) // Log the received data
    
    // Add timestamp to the event data
    const eventData = {
      ...data,
      imageUrl: data.imageUrl || '', // Ensure imageUrl is included and defaulted to empty string
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Preparing to save event data:', eventData) // Log the data being saved

    // Add to Firestore events collection
    const db = getDb()
    const docRef = await db.collection('events').add(eventData)
    console.log('Event saved to Firestore with ID:', docRef.id)

    // Add to Google Calendar if credentials are available
    if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_CALENDAR_ID) {
      const auth = new google.auth.GoogleAuth({
        credentials: {
          client_email: process.env.GOOGLE_CLIENT_EMAIL,
          private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        },
        scopes: ['https://www.googleapis.com/auth/calendar'],
      })

      const calendar = google.calendar({ version: 'v3', auth })
      
      // Format description to include image URL
      const description = data.imageUrl 
        ? `${data.description}\n\n[image:${data.imageUrl}]`
        : data.description

      await calendar.events.insert({
        calendarId: process.env.GOOGLE_CALENDAR_ID,
        requestBody: {
          summary: data.name,
          description: description,
          start: {
            dateTime: `${data.eventDate}T${data.startTime}`,
            timeZone: 'Australia/Sydney',
          },
          end: {
            dateTime: `${data.eventDate}T${data.endTime}`,
            timeZone: 'Australia/Sydney',
          },
          location: data.location,
        },
      })
      console.log('Event added to Google Calendar')
    }

    return NextResponse.json({ id: docRef.id, message: 'Event created successfully' })
  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

// Enhanced in-memory cache for events
let eventsCache: any[] | null = null
let eventsCacheTimestamp: number = 0
const EVENTS_CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

export async function GET() {
  const startTime = Date.now()
  try {
    // Check cache
    if (eventsCache && Date.now() - eventsCacheTimestamp < EVENTS_CACHE_DURATION) {
      console.log('API Route (GET /api/events): Returning cached events. Time:', Date.now() - startTime, 'ms')
      return NextResponse.json(eventsCache)
    }

    const db = getDb()
    
    // Query only published events - removed date ordering to avoid composite index requirement
    const eventsSnapshot = await db.collection('events')
      .where('published', '==', true)
      .get()
    
    const events = eventsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    // Sort events by name on the client side instead of in the query
    events.sort((a, b) => {
      const nameA = (a as any).name || ''
      const nameB = (b as any).name || ''
      return nameA.localeCompare(nameB)
    })

    // Update cache
    eventsCache = events
    eventsCacheTimestamp = Date.now()

    console.log(`API Route (GET /api/events): Returning ${events.length} published events. Total time: ${Date.now() - startTime}ms`)

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
} 