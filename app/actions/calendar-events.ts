"use server"

import { google, calendar_v3 } from "googleapis"

// Update the getUpcomingEvents function to better handle the API key

export async function getUpcomingEvents(calendarId: string, maxResults = 10): Promise<EventWithImage[]> {
  try {
    console.log(`Fetching upcoming events for calendar ID: ${calendarId}`)

    // For public calendars, we can access them with an API key
    const calendar = google.calendar({ version: "v3" })

    // Verify API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.error("No Google API Key found in environment variables")
      return []
    }

    // Set up params with API key
    const params = {
      key: process.env.GOOGLE_API_KEY,
    }

    console.log("Using Google API Key for authentication")

    const now = new Date()
    console.log(`Current time: ${now.toISOString()}`)

    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    })

    console.log(`Found ${response.data.items?.length || 0} upcoming events`)

    const events = response.data.items || []
    const eventsWithImages: EventWithImage[] = []

    // Add image to each event
    for (const event of events) {
      const eventWithImage = { ...event, image: await getEventImage(event) } as EventWithImage
      eventsWithImages.push(eventWithImage)
    }

    return eventsWithImages
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error)
    return []
  }
}

// Map of cities to their calendar IDs
const cityCalendarMap = {
  'sydney': '4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com',
  'melbourne': '641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com',
  'brisbane': 'f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com',
  'adelaide': '6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com',
  'gold coast': 'c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com',
  'perth': 'e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com',
  'canberra': '3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com',
  'darwin': '27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com',
  'hobart': '2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com'
}

// Function to get the user's city
export async function getUserCity(): Promise<string> {
  try {
    const response = await fetch('https://ipapi.co/json/')
    const data = await response.json()
    return data.city.toLowerCase()
  } catch (error) {
    console.error('Error getting user location:', error)
    return 'sydney' // Default to Sydney if location detection fails
  }
}

// Function to get the appropriate calendar ID based on user's location
export async function getLocalCalendarId(): Promise<string> {
  const userCity = await getUserCity()
  return cityCalendarMap[userCity as keyof typeof cityCalendarMap] || cityCalendarMap.sydney
}

// Get events for the current week
export async function getWeekEvents(calendarId?: string) {
  try {
    // Use the provided calendarId or get the local calendar ID
    const targetCalendarId = calendarId || await getLocalCalendarId()

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      console.error("GOOGLE_API_KEY environment variable is not set")
      return []
    }

    console.log("Using Google API Key for authentication")
    console.log("Current time:", new Date().toISOString())
    console.log("Target calendar ID:", targetCalendarId)

    // Get the current date and end of week
    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(now.getDate() + 7) // Get events for the next 7 days
    endOfWeek.setHours(23, 59, 59, 999)
    console.log("End of week:", endOfWeek.toISOString())

    const url = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalendarId)}/events?` +
      `key=${apiKey}&` +
      `timeMin=${now.toISOString()}&` +
      `timeMax=${endOfWeek.toISOString()}&` +
      `singleEvents=true&` +
      `orderBy=startTime&` +
      `maxResults=250` // Maximum allowed by Google Calendar API

    console.log("Request URL:", url)

    try {
      console.log(`Fetching events for calendar: ${targetCalendarId}`)
      const response = await fetch(url)

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Error fetching events for calendar ${targetCalendarId}:`, errorData)
        return []
      }

      const data = await response.json()
      const events = data.items || []
      console.log(`Found ${events.length} events for the current week`)
      
      // Log each event's details
      if (events.length > 0) {
        console.log('Events found:')
        events.forEach((event: any) => {
          const startDate = event.start?.dateTime || event.start?.date
          const endDate = event.end?.dateTime || event.end?.date
          console.log('Event:', {
            id: event.id,
            summary: event.summary,
            start: startDate,
            end: endDate,
            description: event.description,
            location: event.location
          })
        })
      } else {
        console.log('No events found in the specified time range')
      }
      
      return events
    } catch (error) {
      console.error(`Error fetching events for calendar ${targetCalendarId}:`, error)
      return []
    }
  } catch (error) {
    console.error("Error in getWeekEvents:", error)
    return []
  }
}

// Make this function async to comply with Server Actions requirements
export async function getEventImage(event: any): Promise<string> {
  const title = event?.summary?.toLowerCase() || ""
  
  // First check if there's an image URL in the description
  if (event?.description) {
    // Clean the description of any HTML tags
    const cleanDescription = event.description.replace(/<[^>]*>/g, '')
    
    // Look for Google Drive URLs first
    const driveMatch = cleanDescription.match(/https:\/\/drive\.google\.com\/[^\s"']+/)
    if (driveMatch) {
      const driveUrl = driveMatch[0].trim()
      // Convert Google Drive URL to direct image URL
      const fileId = driveUrl.match(/\/d\/([^\/]+)/)?.[1] || driveUrl.match(/id=([^&]+)/)?.[1]
      if (fileId) {
        return `https://drive.google.com/uc?export=view&id=${fileId}`
      }
    }

    // Look for direct image URLs
    const urlMatch = cleanDescription.match(/(https?:\/\/[^\s"']+\.(jpg|jpeg|png|gif|webp))/i)
    if (urlMatch) {
      return urlMatch[0].trim()
    }

    // Look for [image:URL] format
    const imageMatch = cleanDescription.match(/\[image:(.*?)\]/)
    if (imageMatch && imageMatch[1]) {
      return imageMatch[1].trim()
    }
  }

  // Fallback to local images
  if (title.includes('team latin central')) {
    return '/images/placeholder.svg'
  }
  if (title.includes('sydney') && title.includes('bachata') && title.includes('festival')) {
    return '/images/SIBF2025.jpg'
  }
  if (title.includes('world') && title.includes('bachata')) {
    return '/images/world_bachata.png'
  }
  if (title.includes('suave')) {
    return '/images/suave.jpeg'
  }
  if (title.includes('ts')) {
    return '/images/ts.png'
  }
  if (title.includes('vivaz')) {
    return '/images/vivaz.webp'
  }

  return '/images/placeholder.svg'
}

// Define a custom type that extends Schema$Event to include our image property
interface EventWithImage extends calendar_v3.Schema$Event {
  image?: string;
  website?: string;
}

export async function getNearestEvent(calendarId: string): Promise<EventWithImage | null> {
  const events = await getUpcomingEvents(calendarId, 1)
  const event = events.length > 0 ? events[0] : null

  // If we have an event, add the image property
  if (event) {
    const eventWithImage = event as EventWithImage
    eventWithImage.image = await getEventImage(event)
    return eventWithImage
  }

  return null
}

// New function to get this weekend's events
export async function getWeekendEvents(calendarId: string): Promise<EventWithImage[]> {
  try {
    if (!calendarId) {
      console.warn('No calendar ID provided to getWeekendEvents');
      return [];
    }

    // For public calendars, we can access them with an API key
    const calendar = google.calendar({ version: "v3" });

    // Verify API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.warn("No Google API Key found in environment variables");
      return [];
    }

    // Set up params with API key
    const params = {
      key: process.env.GOOGLE_API_KEY,
    };

    // Get the current date and end of weekend
    const now = new Date();
    const endOfWeekend = new Date(now);
    
    // If it's already Saturday or Sunday, get events for the rest of the weekend
    if (now.getDay() === 6) { // Saturday
      endOfWeekend.setDate(now.getDate() + 1); // End of Sunday
    } else if (now.getDay() === 0) { // Sunday
      endOfWeekend.setDate(now.getDate()); // End of today
    } else {
      // If it's a weekday, get events for the upcoming weekend
      endOfWeekend.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
    }
    
    endOfWeekend.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      timeMax: endOfWeekend.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    });

    const events = response.data.items || [];
    const eventsWithImages: EventWithImage[] = [];
    
    // Add image and website to each event
    for (const event of events) {
      const eventWithImage = { ...event, image: await getEventImage(event) } as EventWithImage;

      // Try to extract website URL from description
      if (event.description) {
        const urlMatch = event.description.match(/https?:\/\/[^\s]+/);
        if (urlMatch) {
          eventWithImage.website = urlMatch[0];
        }
      }
      
      eventsWithImages.push(eventWithImage);
    }

    return eventsWithImages;
  } catch (error) {
    console.error("Error fetching weekend events:", error);
    return [];
  }
}

// New function to get filtered events
export async function getFilteredEvents(
  calendarId: string,
  filters: {
    keyword?: string
    eventType?: string
    location?: string
    startDate?: string
    endDate?: string
  },
): Promise<EventWithImage[]> {
  try {
    // For public calendars, we can access them with an API key
    const calendar = google.calendar({ version: "v3" })

    // Set up params with API key if available
    const params: any = {}
    if (process.env.GOOGLE_API_KEY) {
      params.key = process.env.GOOGLE_API_KEY
    }

    // Set up time range
    const now = new Date()
    let timeMin = now.toISOString()
    let timeMax = undefined

    // If start date is provided, use it
    if (filters.startDate) {
      const startDate = new Date(filters.startDate)
      startDate.setHours(0, 0, 0, 0)
      timeMin = startDate.toISOString()
    }

    // If end date is provided, use it
    if (filters.endDate) {
      const endDate = new Date(filters.endDate)
      endDate.setHours(23, 59, 59, 999)
      timeMax = endDate.toISOString()
    }

    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId,
      timeMin,
      timeMax,
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    })

    const events = response.data.items || []
    const eventsWithImages: EventWithImage[] = []

    // Add image and website to each event
    for (const event of events) {
      const eventWithImage = { ...event, image: await getEventImage(event) } as EventWithImage

      // Try to extract website URL from description
      if (event.description) {
        const urlMatch = event.description.match(/https?:\/\/[^\s]+/)
        if (urlMatch) {
          eventWithImage.website = urlMatch[0]
        }
      }

      // Apply filters
      let includeEvent = true

      if (filters.keyword) {
        const keyword = filters.keyword.toLowerCase()
        const title = event.summary?.toLowerCase() || ""
        const description = event.description?.toLowerCase() || ""
        includeEvent = includeEvent && (title.includes(keyword) || description.includes(keyword))
      }

      if (filters.eventType) {
        const eventType = filters.eventType.toLowerCase()
        const title = event.summary?.toLowerCase() || ""
        includeEvent = includeEvent && title.includes(eventType)
      }

      if (filters.location) {
        const location = filters.location.toLowerCase()
        const eventLocation = event.location?.toLowerCase() || ""
        includeEvent = includeEvent && eventLocation.includes(location)
      }

      if (includeEvent) {
        eventsWithImages.push(eventWithImage)
      }
    }

    return eventsWithImages
  } catch (error) {
    console.error("Error fetching filtered events:", error)
    return []
  }
}
