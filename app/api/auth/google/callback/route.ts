import { NextRequest, NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

// Force dynamic rendering for this route
export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get('code');
    
    if (!code) {
      throw new Error('No code provided');
    }

    // Exchange the code for tokens
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Create a calendar client
    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });

    // Get the user's calendar events
    const response = await calendar.events.list({
      calendarId: 'primary',
      timeMin: new Date().toISOString(),
      maxResults: 10,
      singleEvents: true,
      orderBy: 'startTime',
    });

    return NextResponse.json({
      success: true,
      events: response.data.items
    });
  } catch (error) {
    console.error('Error in Google callback:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to process Google callback'
    }, {
      status: 500
    });
  }
} 