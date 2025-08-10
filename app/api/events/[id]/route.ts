import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { getWeekEvents } from '@/app/actions/calendar-events'
import { Timestamp } from 'firebase-admin/firestore'

// Valid dance styles from constants
const VALID_DANCE_STYLES = [
  'Bachata',
  'Salsa', 
  'Kizomba',
  'Zouk',
  'Reaggeaton',
  'Heels',
  'Pole Dance',
  'Latin Beat'
]

/**
 * Clean dance styles - remove old string values and keep only valid ones
 */
function cleanDanceStyles(danceStyles: any): string[] {
  if (!danceStyles) return []
  
  if (Array.isArray(danceStyles)) {
    // Filter to only keep valid dance styles
    return danceStyles.filter((style: string) => 
      VALID_DANCE_STYLES.includes(style)
    )
  }
  
  // If it's a string, return empty array (remove old string format)
  if (typeof danceStyles === 'string') {
    return []
  }
  
  return []
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id
  console.log(`API Route (DELETE /api/events/${eventId}): Attempting to delete event from Firestore.`)
  try {
    const db = getDb()
    if (!db || typeof db.collection !== 'function') {
      throw new Error("Firestore Admin instance is not available or invalid.")
    }
    const eventDocRef = db.collection('events').doc(eventId)
    await eventDocRef.delete()
    console.log(`API Route (DELETE /api/events/${eventId}): Event deleted successfully from Firestore.`)
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error(`API Route (DELETE /api/events/${eventId}): >>> Critical Error <<<`)
    console.error("API Route (DELETE): Error:", error)
    return NextResponse.json({ error: 'Failed to delete event', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

function convertGoogleDriveUrl(url: string): string {
  // If the URL is already in the correct format, return it
  if (url.includes('uc?export=view&id=')) {
    return url
  }
  
  // For URLs in the format you provided
  if (url.includes('drive.google.com')) {
    if (url.includes('/file/d/')) {
      const fileId = url.split('/file/d/')[1].split('/')[0]
      return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
  }
  return url
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id
  console.log(`API Route (GET /api/events/${eventId}): Attempting to fetch event from Firestore.`)

  try {
    const db = getDb()
    // Check if db object is valid (Admin SDK check)
    if (!db || typeof db.collection !== 'function') {
      console.error("API Route (GET): FATAL - Firestore Admin instance is not available or invalid!")
      throw new Error("Firestore Admin instance is not available or invalid.")
    }

    const eventDocRef = db.collection('events').doc(eventId)
    const docSnap = await eventDocRef.get()

    if (!docSnap.exists) {
      console.warn(`API Route (GET /api/events/${eventId}): Event not found in Firestore.`)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    const eventData = docSnap.data()
    console.log(`API Route (GET /api/events/${eventId}): Successfully fetched event data from Firestore.`)

    // Ensure eventData exists
    if (!eventData) {
      console.warn(`API Route (GET /api/events/${eventId}): Event data is null/undefined, returning 404.`)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Check if event is published (only return published events to public)
    // Treat undefined as not published (legacy events without published field)
    if (eventData.published !== true) {
      console.warn(`API Route (GET /api/events/${eventId}): Event is not published, returning 404.`)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    // Prepare data for the response (ensure it matches the Event interface)
    // Convert Timestamps to strings if necessary, etc.
    const responseData = {
      id: docSnap.id,
      ...eventData,
      // Clean dance styles to remove old string values
      danceStyles: cleanDanceStyles(eventData.danceStyles),
      // Example: Convert Firestore Timestamp to ISO string if needed
      // createdAt: eventData.createdAt instanceof Timestamp ? eventData.createdAt.toDate().toISOString() : eventData.createdAt,
      // eventDate: eventData.eventDate instanceof Timestamp ? eventData.eventDate.toDate().toISOString() : eventData.eventDate,
    }

    return NextResponse.json(responseData)
  } catch (error) {
    console.error(`API Route (GET /api/events/${eventId}): >>> Critical Error <<<`)
    console.error("API Route (GET): Error:", error)
    if (error instanceof Error) {
      console.error("API Route (GET): Error Message:", error.message)
      console.error("API Route (GET): Error Stack:", error.stack)
    }
    return NextResponse.json({ error: 'Failed to fetch event data', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id
  console.log(`API Route (PUT /api/events/${eventId}): Attempting to update event in Firestore.`)

  try {
    const db = getDb()
    if (!db || typeof db.collection !== 'function') {
      throw new Error("Firestore Admin instance is not available or invalid.")
    }

    const eventData = await request.json() // Get data from request body
    console.log(`API Route (PUT /api/events/${eventId}): Received update data:`, eventData)

    // Remove fields that shouldn't be directly updated or don't exist
    delete eventData.id // Don't try to update the ID
    
    // Ensure imageUrl is properly handled
    if (eventData.imageUrl === undefined) {
      eventData.imageUrl = '' // Default to empty string if undefined
    }
    
    // Add updatedAt timestamp
    eventData.updatedAt = Timestamp.now()

    const eventDocRef = db.collection('events').doc(eventId)
    await eventDocRef.set(eventData, { merge: true })

    console.log(`API Route (PUT /api/events/${eventId}): Event updated successfully in Firestore.`)
    return NextResponse.json({ message: 'Event updated successfully' })
  } catch (error) {
    console.error(`API Route (PUT /api/events/${eventId}): >>> Critical Error <<<`)
    console.error("API Route (PUT): Error:", error)
    return NextResponse.json({ error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const eventId = params.id
  console.log(`API Route (PATCH /api/events/${eventId}): Attempting to update event in Firestore.`)

  try {
    const db = getDb()
    if (!db || typeof db.collection !== 'function') {
      throw new Error("Firestore Admin instance is not available or invalid.")
    }

    const eventData = await request.json()
    console.log(`API Route (PATCH /api/events/${eventId}): Received update data:`, eventData)

    // Remove the id field from the update data since Firestore doesn't allow updating document IDs
    const { id, ...updateDataWithoutId } = eventData
    
    // Add updatedAt timestamp
    const updateData = {
      ...updateDataWithoutId,
      updatedAt: Timestamp.now()
    }

    const eventDocRef = db.collection('events').doc(eventId)
    await eventDocRef.update(updateData)

    console.log(`API Route (PATCH /api/events/${eventId}): Event updated successfully in Firestore.`)
    return NextResponse.json({ message: 'Event updated successfully' })
  } catch (error) {
    console.error(`API Route (PATCH /api/events/${eventId}): >>> Critical Error <<<`)
    console.error("API Route (PATCH): Error:", error)
    return NextResponse.json({ error: 'Failed to update event', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  console.log("API Route (POST /api/events): Attempting to create event in Firestore.")
  try {
    const db = getDb()
    if (!db || typeof db.collection !== 'function') {
      throw new Error("Firestore Admin instance is not available or invalid.")
    }
    const eventData = await request.json()
    console.log(`API Route (POST /api/events): Received data for new event:`, eventData)

    // Add createdAt timestamp using Admin SDK Timestamp
    const eventDoc = {
      ...eventData,
      createdAt: Timestamp.now(),
    }

    const eventsCollectionRef = db.collection('events')
    const docRef = await eventsCollectionRef.add(eventDoc)
    console.log(`API Route (POST /api/events): New event created successfully with ID:`, docRef.id)

    return NextResponse.json({ message: 'Event created successfully', id: docRef.id }, { status: 201 })
  } catch (error) {
    console.error("API Route (POST /api/events): >>> Critical Error <<<")
    console.error("API Route (POST): Error:", error)
    return NextResponse.json({ error: 'Failed to create event', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
} 