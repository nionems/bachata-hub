import { NextResponse } from 'next/server';
import { google } from 'googleapis';

// Create a server-side function to handle Google Calendar operations
async function getCalendarEvents(calendarId: string) {
  try {
    let auth;

    // Use API Key for Public Calendars
    if (process.env.GOOGLE_API_KEY) {
      auth = process.env.GOOGLE_API_KEY;
      console.log('Using Google API Key for authentication');
    }
    // Use Service Account for Private Calendars
    else if (process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY) {
      auth = new google.auth.JWT(
        process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
        ["https://www.googleapis.com/auth/calendar.readonly"]
      );
      console.log('Using Service Account for authentication');
    } else {
      console.warn('No Google API authentication found in environment variables');
      return [];
    }

    const calendar = google.calendar({ version: "v3", auth });

    // Get events for the next 3 months
    const now = new Date();
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(now.getMonth() + 3);

    console.log(`Fetching events from ${now.toISOString()} to ${threeMonthsFromNow.toISOString()}`);

    const response = await calendar.events.list({
      calendarId,
      timeMin: now.toISOString(),
      timeMax: threeMonthsFromNow.toISOString(),
      maxResults: 100,
      singleEvents: true,
      orderBy: "startTime",
    });

    const events = response.data.items || [];
    console.log(`Found ${events.length} events in calendar`);

    return events;
  } catch (error) {
    console.error('Error in getCalendarEvents:', error);
    if (error.response) {
      console.error('Error response:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    }
    return [];
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const calendarId = searchParams.get('calendarId');

    if (!calendarId) {
      console.warn('No calendar ID provided in request');
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    console.log(`Fetching events for calendar: ${calendarId}`);
    const events = await getCalendarEvents(calendarId);
    
    return NextResponse.json(events);
  } catch (error) {
    console.error("Error in GET handler:", error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch calendar events',
        details: error.message
      }, 
      { status: 500 }
    );
  }
} 