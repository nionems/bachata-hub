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

    // Use OAuth2 for authentication
    const oauth2Client = new google.auth.OAuth2(
      env.GOOGLE_CLIENT_ID,
      env.GOOGLE_CLIENT_SECRET,
      env.GOOGLE_REDIRECT_URI
    );

    // Set credentials
    oauth2Client.setCredentials({
      refresh_token: env.GOOGLE_REFRESH_TOKEN,
    });

    // Create calendar client with OAuth2
    const calendar = google.calendar({ 
      version: "v3", 
      auth: oauth2Client 
    });

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

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic'

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