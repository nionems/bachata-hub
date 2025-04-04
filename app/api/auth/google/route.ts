import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

export async function GET() {
  try {
    const auth = new google.auth.GoogleAuth({
      scopes: ['https://www.googleapis.com/auth/calendar.readonly'],
    });

    const client = await auth.getClient() as OAuth2Client;
    const calendar = google.calendar({ version: 'v3', auth: client });

    // You can now use the calendar client for server-side operations
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in Google auth:', error);
    return NextResponse.json({ error: 'Authentication failed' }, { status: 500 });
  }
} 