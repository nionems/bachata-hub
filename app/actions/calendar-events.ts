"use server"

import { google } from "googleapis"

// Define a custom type that extends Schema$Event
type EventWithImage = google.calendar_v3.Schema$Event & {
  image?: string
}

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

    // Add images to events
    const eventsWithImages = await Promise.all(
      (response.data.items || []).map(async (event) => {
        const eventWithImage = event as EventWithImage
        eventWithImage.image = await getEventImage(event)
        return eventWithImage
      })
    )

    return eventsWithImages
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error)
    return []
  }
}

// Get events for the current week
export async function getWeekEvents(calendarId: string, maxResults = 3): Promise<EventWithImage[]> {
  try {
    console.log(`Fetching week events for calendar ID: ${calendarId}`)

    // For public calendars, we can access them with an API key
    const calendar = google.calendar({ version: "v3" })

    // Verify API key is available
    if (!process.env.GOOGLE_API_KEY) {
      console.warn("No Google API Key found in environment variables")
      return []
    }

    console.log("Using Google API Key for authentication")

    const now = new Date()
    console.log(`Current time: ${now.toISOString()}`)

    // Calculate the end of the week (Sunday)
    const endOfWeek = new Date(now)
    const daysUntilEndOfWeek = 7 - now.getDay()
    endOfWeek.setDate(now.getDate() + daysUntilEndOfWeek)
    endOfWeek.setHours(23, 59, 59, 999)
    console.log(`End of week: ${endOfWeek.toISOString()}`)

    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      timeMax: endOfWeek.toISOString(),
      maxResults,
      singleEvents: true,
      orderBy: "startTime",
      key: process.env.GOOGLE_API_KEY
    })

    console.log(`Found ${response.data.items?.length || 0} events for the current week`)

    // Add images to events
    const eventsWithImages = await Promise.all(
      (response.data.items || []).map(async (event) => {
        const eventWithImage = event as EventWithImage
        eventWithImage.image = await getEventImage(event)
        return eventWithImage
      })
    )

    return eventsWithImages
  } catch (error: any) {
    console.error("Error fetching Google Calendar events for the week:", error)
    if (error.response?.data?.error) {
      console.error("API Error details:", error.response.data.error)
    }
    return []
  }
}

// Make this function async to comply with Server Actions requirements
export async function getEventImage(event: google.calendar_v3.Schema$Event): Promise<string> {
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

export async function getNearestEvent(calendarId: string): Promise<EventWithImage | null> {
  const events = await getUpcomingEvents(calendarId, 1)
  const event = events.length > 0 ? events[0] : null

  // If we have an event, add the image property
  if (event) {
    event.image = await getEventImage(event)
  }

  return event
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

    const now = new Date();
    const weekendStart = new Date(now);
    weekendStart.setDate(now.getDate() + (6 - now.getDay())); // Next Saturday
    weekendStart.setHours(0, 0, 0, 0);

    const weekendEnd = new Date(weekendStart);
    weekendEnd.setDate(weekendStart.getDate() + 1); // Next Sunday
    weekendEnd.setHours(23, 59, 59, 999);

    const response = await calendar.events.list({
      calendarId,
      timeMin: weekendStart.toISOString(),
      timeMax: weekendEnd.toISOString(),
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    });

    // Add images to events
    const eventsWithImages = await Promise.all(
      (response.data.items || []).map(async (event) => {
        const eventWithImage = event as EventWithImage
        eventWithImage.image = await getEventImage(event)
        return eventWithImage
      })
    )

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
