"use server"

import { google } from "googleapis"

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
export async function getWeekEvents(calendarId: string, maxResults = 3) {
  try {
    console.log(`Fetching week events for calendar ID: ${calendarId}`)

    // For public calendars, we can access them with an API key
    const calendar = google.calendar({ version: "v3" })

    // Set up params with API key if available
    const params: any = {}
    if (process.env.GOOGLE_API_KEY) {
      params.key = process.env.GOOGLE_API_KEY
      console.log("Using Google API Key for authentication")
    } else {
      console.log("No Google API Key found")
    }

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
      ...params,
    })

    console.log(`Found ${response.data.items?.length || 0} events for the current week`)

    return response.data.items || []
  } catch (error) {
    console.error("Error fetching Google Calendar events for the week:", error)
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

export async function getNearestEvent(calendarId: string) {
  const events = await getUpcomingEvents(calendarId, 1)
  const event = events.length > 0 ? events[0] : null

  // If we have an event, add the image property
  if (event) {
    event.image = await getEventImage(event)
  }

  return event
}

// New function to get this weekend's events
export async function getWeekendEvents(calendarId: string) {
  try {
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

    // Calculate this weekend's date range
    const now = new Date()
    const today = now.getDay() // 0 = Sunday, 1 = Monday, etc.

    // Calculate days until next weekend (Friday, Saturday, Sunday)
    let daysUntilFriday = 5 - today
    if (daysUntilFriday < 0) daysUntilFriday += 7

    // If today is Friday, Saturday, or Sunday, include today
    const isWeekend = today === 5 || today === 6 || today === 0

    // Set start time to today if it's already the weekend, otherwise next Friday
    const startDate = new Date(now)
    if (isWeekend) {
      // If it's already the weekend, start from today
      startDate.setHours(0, 0, 0, 0)
    } else {
      // Otherwise, start from next Friday
      startDate.setDate(now.getDate() + daysUntilFriday)
      startDate.setHours(0, 0, 0, 0)
    }

    // End date is Sunday night
    const endDate = new Date(startDate)
    const daysUntilSunday = today === 0 ? 0 : 7 - today
    endDate.setDate(now.getDate() + daysUntilSunday)
    endDate.setHours(23, 59, 59, 999)

    const response = await calendar.events.list({
      calendarId,
      timeMin: startDate.toISOString(),
      timeMax: endDate.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    })

    const events = response.data.items || []

    // Add image to each event
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

    return events
  } catch (error) {
    console.error("Error fetching weekend Google Calendar events:", error)
    return []
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
