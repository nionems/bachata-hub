import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, deleteDoc, getDoc, updateDoc } from 'firebase/firestore'
import { getWeekEvents } from '@/app/actions/calendar-events'

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const eventRef = doc(db, 'events', params.id)
    await deleteDoc(eventRef)
    
    return NextResponse.json({ message: 'Event deleted successfully' })
  } catch (error) {
    console.error('Failed to delete event:', error)
    return NextResponse.json(
      { error: 'Failed to delete event' },
      { status: 500 }
    )
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
  try {
    const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"
    const weekEvents = await getWeekEvents(calendarId)
    
    // Find the specific event
    const event = weekEvents.find(e => e.id === params.id || e.iCalUID === params.id)
    
    if (!event) {
      console.log('Event not found for ID:', params.id)
      return NextResponse.json({ error: 'Event not found' }, { status: 404 })
    }

    console.log('Found event:', event)
    console.log('Event description:', event.description)

    // Extract image URL from description
    let imageUrl = '/placeholder.svg'
    if (event.description) {
      const imageMatch = event.description.match(/\[image:(.*?)\]/)
      console.log('Image match:', imageMatch)
      if (imageMatch && imageMatch[1]) {
        imageUrl = convertGoogleDriveUrl(imageMatch[1].trim())
        console.log('Converted image URL:', imageUrl)
      }
    }

    // Format the event data
    const formattedEvent = {
      id: event.id || event.iCalUID,
      name: event.summary,
      date: new Date(event.start.dateTime || event.start.date).toLocaleDateString("en-AU", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      }),
      time: event.start.dateTime 
        ? new Date(event.start.dateTime).toLocaleTimeString("en-AU", {
            hour: "2-digit",
            minute: "2-digit"
          })
        : "All day",
      start: event.start.dateTime || event.start.date,
      end: event.end.dateTime || event.end.date,
      description: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
      location: event.location || "Location TBA",
      state: event.location?.split(',').pop()?.trim() || "TBA",
      address: event.location || "TBA",
      eventLink: event.htmlLink || "",
      price: "TBA",
      ticketLink: "",
      imageUrl: imageUrl,
      comment: event.description?.replace(/\[image:.*?\]/, '').trim() || "No description available",
      googleMapLink: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(event.location || '')}`
    }

    return NextResponse.json(formattedEvent)
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { error: 'Failed to fetch event details' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const eventRef = doc(db, 'events', params.id)
    
    const updateData = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    await updateDoc(eventRef, updateData)
    
    return NextResponse.json({
      id: params.id,
      ...updateData
    })
  } catch (error) {
    console.error('Failed to update event:', error)
    return NextResponse.json(
      { error: 'Failed to update event' },
      { status: 500 }
    )
  }
} 