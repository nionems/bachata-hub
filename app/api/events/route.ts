import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'
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
    const eventsRef = collection(db, 'events')
    const docRef = await addDoc(eventsRef, eventData)
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

    return NextResponse.json({
      id: docRef.id,
      ...eventData
    })

  } catch (error) {
    console.error('Error creating event:', error)
    return NextResponse.json(
      { error: 'Failed to create event' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      credentials: {
        client_email: process.env.GOOGLE_CLIENT_EMAIL,
        private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      },
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    })

    const calendar = google.calendar({ version: 'v3', auth })
    
    const response = await calendar.events.list({
      calendarId: process.env.GOOGLE_CALENDAR_ID,
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items?.map(event => {
      // Extract image URL from description using regex
      const imageUrlMatch = event.description?.match(/\[image:(.*?)\]/)
      const imageUrl = imageUrlMatch ? imageUrlMatch[1] : null

      // Clean description by removing the image tag
      const cleanDescription = event.description?.replace(/\[image:.*?\]/, '').trim()

      return {
        id: event.id,
        title: event.summary,
        start: event.start?.dateTime || event.start?.date,
        end: event.end?.dateTime || event.end?.date,
        description: cleanDescription,
        location: event.location,
        imageUrl: imageUrl || '/default-event-image.jpg', // Provide a default image
      }
    })

    return NextResponse.json(events)
  } catch (error) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    )
  }
} 