"use server"

import { google, calendar_v3 } from "googleapis"

// Update the getUpcomingEvents function to better handle the API key

export async function getUpcomingEvents(calendarId: string, maxResults = 3): Promise<EventWithImage[]> {
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

// Get events for the current week
export async function getWeekEvents(calendarId?: string) {
  try {
    // Use the provided calendarId or fall back to the default
    const defaultCalendarId = "6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com"
    const targetCalendarId = calendarId || defaultCalendarId

    const apiKey = process.env.GOOGLE_API_KEY
    if (!apiKey) {
      console.error("GOOGLE_API_KEY environment variable is not set")
      return []
    }

    console.log("Using Google API Key for authentication")
    console.log("Current time:", new Date().toISOString())

    // Get the current date and end of week
    const now = new Date()
    const endOfWeek = new Date(now)
    endOfWeek.setDate(now.getDate() + 7) // Get events for the next 7 days
    endOfWeek.setHours(23, 59, 59, 999)
    console.log("End of week:", endOfWeek.toISOString())

    try {
      console.log(`Fetching events for calendar: ${targetCalendarId}`)
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(targetCalendarId)}/events?` +
        `key=${apiKey}&` +
        `timeMin=${now.toISOString()}&` +
        `timeMax=${endOfWeek.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Error fetching events for calendar ${targetCalendarId}:`, errorData)
        return []
      }

      const data = await response.json()
      console.log(`Found ${data.items?.length || 0} events for the current week`)
      return data.items || []
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
  // Check if the event title contains specific keywords
  const title = event?.summary?.toLowerCase() || ""

  if (title.includes("sydney") && title.includes("bachata") && title.includes("festival")) {
    return "/images/sydney-bachata-festival.png"
  }

  if (title.includes("world") && title.includes("bachata") && title.includes("melbourne")) {
    return "/images/world_bachata.png"
  }

  // Default image for other events
  return "/placeholder.svg?height=300&width=600"
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
