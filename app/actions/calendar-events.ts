"use server"

import { google, calendar_v3 } from "googleapis"

// Update the getUpcomingEvents function to better handle the API key

export async function getUpcomingEvents(calendarId: string, maxResults = 3) {
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

    return response.data.items || []
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error)
    return []
  }
}

// Get events for the current week
export async function getWeekEvents() {
  try {
    // Use the new calendar from bachata.au@gmail.com
    const calendarId = "6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com"

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
      console.log(`Fetching events for calendar: ${calendarId}`)
      const response = await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?` +
        `key=${apiKey}&` +
        `timeMin=${now.toISOString()}&` +
        `timeMax=${endOfWeek.toISOString()}&` +
        `singleEvents=true&` +
        `orderBy=startTime`
      )

      if (!response.ok) {
        const errorData = await response.json()
        console.error(`Error fetching events for calendar ${calendarId}:`, errorData)
        return []
      }

      const data = await response.json()
      console.log(`Found ${data.items?.length || 0} events for the current week`)
      return data.items || []
    } catch (error) {
      console.error(`Error fetching events for calendar ${calendarId}:`, error)
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
export async function getWeekendEvents(calendarId: string) {
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

    const now = new Date();
    const weekendStart = new Date(now);
    weekendStart.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
    weekendStart.setHours(0, 0, 0, 0);

    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 2); // Sunday
    weekendEnd.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId,
      timeMin: weekendStart.toISOString(),
      timeMax: weekendEnd.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    });

    return response.data.items || [];
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
) {
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
      maxResults: 100, // Get more events to filter client-side
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    })

    let events = response.data.items || []

    // Add image and website to each event
    for (const event of events) {
      event.image = await getEventImage(event)

      // Try to extract website URL from description
      if (event.description) {
        const urlMatch = event.description.match(/https?:\/\/[^\s]+/)
        if (urlMatch) {
          event.website = urlMatch[0]
        }
      }
    }

    // Apply keyword filter
    if (filters.keyword) {
      const keyword = filters.keyword.toLowerCase()
      events = events.filter(
        (event) =>
          (event.summary && event.summary.toLowerCase().includes(keyword)) ||
          (event.description && event.description.toLowerCase().includes(keyword)) ||
          (event.location && event.location.toLowerCase().includes(keyword)),
      )
    }

    // Apply event type filter
    if (filters.eventType && filters.eventType !== "all") {
      const eventType = filters.eventType.toLowerCase()
      events = events.filter((event) => {
        const title = (event.summary || "").toLowerCase()
        const description = (event.description || "").toLowerCase()

        switch (eventType) {
          case "social":
            return title.includes("social") || title.includes("dance") || description.includes("social dance")
          case "workshop":
            return title.includes("workshop") || description.includes("workshop")
          case "festival":
            return title.includes("festival") || description.includes("festival")
          case "class":
            return (
              title.includes("class") ||
              title.includes("lesson") ||
              description.includes("class") ||
              description.includes("lesson")
            )
          default:
            return true
        }
      })
    }

    // Apply location filter
    if (filters.location) {
      const location = filters.location.toLowerCase()
      events = events.filter((event) => event.location && event.location.toLowerCase().includes(location))
    }

    return events
  } catch (error) {
    console.error("Error fetching filtered Google Calendar events:", error)
    return []
  }
}
