import { google } from "googleapis"

export async function getGoogleCalendarEvents(calendarId: string) {
  // Ensure this function only runs on the server
  if (typeof window !== "undefined") {
    console.warn("Google Calendar API called on client-side, returning empty events.")
    return []
  }

  try {
    let auth

    // 🔹 Use API Key for Public Calendars
    if (process.env.GOOGLE_API_KEY) {
      console.log("Using Google API Key for authentication")
      auth = process.env.GOOGLE_API_KEY
    }
    // 🔹 Use Service Account for Private Calendars
    else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      console.log("Using Google Service Account for authentication")

      auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"), // Fix line breaks in .env
        ["https://www.googleapis.com/auth/calendar.readonly"]
      )
    } else {
      console.error("No Google API authentication found in environment variables")
      return getMockEvents() // Return mock events for testing
    }

    // 🔹 Initialize Google Calendar API
    const calendar = google.calendar({ version: "v3", auth })

    // 🔹 Fetch Events
    const response = await calendar.events.list({
      calendarId,
      timeMin: new Date().toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    })

    console.log(`Fetched ${response.data.items?.length || 0} events for calendar ${calendarId}`)

    return response.data.items || []
  } catch (error) {
    console.error("Error fetching Google Calendar events:", error)

    // Return mock events for local development
    return process.env.NODE_ENV === "development" ? getMockEvents() : []
  }
}

// 🔹 Mock events for local development
function getMockEvents() {
  return [
    {
      id: "1",
      summary: "Sydney Bachata Social",
      description: "Join us for a night of Bachata dancing in Sydney!",
      location: "Sydney Dance Studio, 123 Dance St, Sydney",
      start: { dateTime: "2025-06-15T19:00:00+10:00" },
      end: { dateTime: "2025-06-15T23:00:00+10:00" },
      htmlLink: "https://calendar.google.com",
    },
    {
      id: "2",
      summary: "Melbourne Bachata Workshop",
      description: "Learn advanced Bachata techniques with our guest instructor.",
      location: "Melbourne Latin Dance, 456 Rhythm Ave, Melbourne",
      start: { dateTime: "2025-06-22T14:00:00+10:00" },
      end: { dateTime: "2025-06-22T16:00:00+10:00" },
      htmlLink: "https://calendar.google.com",
    },
    {
      id: "3",
      summary: "Brisbane Bachata Festival",
      description: "A weekend of Bachata workshops, performances, and social dancing.",
      location: "Brisbane Convention Center, Brisbane",
      start: { date: "2025-07-10" },
      end: { date: "2025-07-12" },
      htmlLink: "https://calendar.google.com",
    },
  ]
}
