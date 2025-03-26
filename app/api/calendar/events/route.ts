import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { validateEnv } from '@/lib/env';

interface GoogleApiError {
  response?: {
    status: number;
    data: any;
    headers: any;
  };
  message: string;
}

// Create a server-side function to handle Google Calendar operations
async function getCalendarEvents(calendarId: string) {
  try {
    // Validate environment variables
    const env = validateEnv();
    let auth;

    // Use API Key for Public Calendars
    if (env.GOOGLE_API_KEY) {
      auth = env.GOOGLE_API_KEY;
      console.log('Using Google API Key for authentication');
    }
    // Use Service Account for Private Calendars
    else if (env.GOOGLE_SERVICE_ACCOUNT_EMAIL && env.GOOGLE_PRIVATE_KEY) {
      auth = new google.auth.JWT(
        env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
        undefined,
        env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, "\n"),
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
    const apiError = error as GoogleApiError;
    console.error('Error in getCalendarEvents:', apiError);
    if (apiError.response) {
      console.error('Error response:', {
        status: apiError.response.status,
        data: apiError.response.data,
        headers: apiError.response.headers,
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
      return NextResponse.json({ error: 'Calendar ID is required' }, { status: 400 });
    }

    const events = await getCalendarEvents(calendarId);
    return NextResponse.json(events);
  } catch (error) {
    const apiError = error as GoogleApiError;
    console.error('Error in GET /api/calendar/events:', apiError);
    return NextResponse.json({ error: 'Failed to fetch calendar events' }, { status: 500 });
  }
} 