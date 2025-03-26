import { NextResponse } from "next/server"
import { google } from "googleapis"

export async function GET(request: Request) {
  try {
    // Your calendar ID
    const calendarId = "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com"

    // For public calendars, we can access them with an API key
    const calendar = google.calendar({ version: "v3" })

    // Verify API key is available
    if (!process.env.GOOGLE_API_KEY) {
      return NextResponse.json(
        {
          success: false,
          message: "Google API Key is not configured",
          error: {
            message: "Missing GOOGLE_API_KEY environment variable",
            code: "MISSING_API_KEY",
          },
        },
        { status: 400 },
      )
    }

    // Set up params with API key
    const params = {
      key: process.env.GOOGLE_API_KEY,
    }

    console.log("Using Google API Key for authentication")

    // Get current time
    const now = new Date()

    // Get events from Google Calendar
    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: "startTime",
      ...params,
    })

    // Return the events and some debug info
    return NextResponse.json({
      success: true,
      message: "Calendar events fetched successfully",
      count: response.data.items?.length || 0,
      events: response.data.items || [],
      debug: {
        calendarId,
        hasApiKey: true,
        apiKeyFirstChars: `${process.env.GOOGLE_API_KEY.substring(0, 5)}...`,
        timeMin: now.toISOString(),
        environment: process.env.NODE_ENV,
      },
    })
  } catch (error: any) {
    console.error("Error fetching Google Calendar events:", error)

    // Provide more detailed error information
    const errorDetails = {
      message: error.message,
      code: error.code,
      status: error.status,
      details: error.errors || [],
      hasApiKey: !!process.env.GOOGLE_API_KEY,
      apiKeyFirstChars: process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.substring(0, 5)}...` : "Not set",
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch calendar events",
        error: errorDetails,
      },
      { status: 500 },
    )
  }
}
