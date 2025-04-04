import { NextResponse } from 'next/server';
import { google } from 'googleapis';
import { OAuth2Client } from 'google-auth-library';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export async function GET() {
  try {
    // Generate the authorization URL
    const authUrl = oauth2Client.generateAuthUrl({
      access_type: 'offline',
      scope: ['https://www.googleapis.com/auth/calendar.readonly'],
      prompt: 'consent'
    });

    return NextResponse.json({ 
      success: true,
      authUrl 
    });
  } catch (error) {
    console.error('Error in Google auth:', error);
    return NextResponse.json({ 
      success: false,
      error: 'Authentication failed' 
    }, { 
      status: 500 
    });
  }
} 