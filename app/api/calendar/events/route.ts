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
  stack?: string;
}

// Create a server-side function to handle Google Calendar operations
async function getCalendarEvents(calendarId: string) {
  try {
    // Validate environment variables
    const env = validateEnv();
    console.log('Environment variables validated successfully');
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
    console.log(`Using calendar ID: ${calendarId}`);

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
    console.error('Error in getCalendarEvents:', {
      message: apiError.message,
      response: apiError.response ? {
        status: apiError.response.status,
        data: apiError.response.data,
        headers: apiError.response.headers,
      } : null,
      stack: apiError.stack,
    });
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

    console.log(`Received request for calendar ID: ${calendarId}`);
    const events = await getCalendarEvents(calendarId);
    
    return NextResponse.json(events);
  } catch (error) {
    const apiError = error as GoogleApiError;
    console.error('Error in GET /api/calendar/events:', {
      message: apiError.message,
      response: apiError.response ? {
        status: apiError.response.status,
        data: apiError.response.data,
        headers: apiError.response.headers,
      } : null,
      stack: apiError.stack,
    });
    return NextResponse.json({ 
      error: 'Failed to fetch calendar events',
      details: apiError.message
    }, { status: 500 });
  }
} 