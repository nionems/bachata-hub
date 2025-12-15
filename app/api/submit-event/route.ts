import { Resend } from "resend"
import { NextResponse } from "next/server"
import { google } from "googleapis"

// Initialize Resend with the new API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Add verifyResendConfig function
async function verifyResendConfig() {
  try {
    if (!process.env.RESEND_API_KEY) {
      console.error('RESEND_API_KEY is not configured');
      return false;
    }
    return true;
  } catch (error) {
    console.error('Error verifying Resend configuration:', error);
    return false;
  }
}

// Add this function to format the admin email HTML
function getAdminEmailHtml(formData: FormData) {
  const eventName = formData.get('eventName')?.toString() || '';
  const eventDate = formData.get('eventDate')?.toString() || '';
  const eventTime = formData.get('eventTime')?.toString() || '';
  const endTime = formData.get('endTime')?.toString() || '';
  const location = formData.get('location')?.toString() || '';
  const description = formData.get('description')?.toString() || '';

  // Create Google Calendar URL
  const startDateTime = `${eventDate}T${eventTime}:00`;
  const endDateTime = `${eventDate}T${endTime}:00`;
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${encodeURIComponent(startDateTime)}/${encodeURIComponent(endDateTime)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; margin-bottom: 20px;">New Event Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Event Name:</strong> ${eventName}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime} - ${endTime}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>State:</strong> ${formData.get('state')}</p>
        <p><strong>City:</strong> ${formData.get('city')}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Organizer:</strong> ${formData.get('organizerName')}</p>
        <p><strong>Organizer Email:</strong> ${formData.get('organizerEmail')}</p>
        <p><strong>Event Link:</strong> ${formData.get('eventLink')}</p>
        <p><strong>Ticket Link:</strong> ${formData.get('ticketLink')}</p>
      </div>

      <div style="margin: 30px 0; text-align: center;">
        <a href="${calendarUrl}" 
           style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;"
           target="_blank">
          Add to Google Calendar
        </a>
      </div>
    </div>
  `
}

// Add this function to format the organizer email HTML
function getOrganizerEmailHtml(formData: FormData) {
  const eventName = formData.get('eventName')?.toString() || '';
  const eventDate = formData.get('eventDate')?.toString() || '';
  const eventTime = formData.get('eventTime')?.toString() || '';
  const endTime = formData.get('endTime')?.toString() || '';
  const location = formData.get('location')?.toString() || '';
  const description = formData.get('description')?.toString() || '';

  // Create Google Calendar URL
  const startDateTime = `${eventDate}T${eventTime}:00`;
  const endDateTime = `${eventDate}T${endTime}:00`;
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${encodeURIComponent(startDateTime)}/${encodeURIComponent(endDateTime)}&location=${encodeURIComponent(location)}&details=${encodeURIComponent(description)}`;

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <title>Event Submission Received</title>
      </head>
      <body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #333; margin-bottom: 20px;">Event Submission Received</h2>
        <p style="margin-bottom: 20px;">Thank you for submitting your event to Bachata Hub. We have received your submission and will review it shortly.</p>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #333;">Event Details:</h3>
          <p><strong>Event Name:</strong> ${eventName}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTime} - ${endTime}</p>
          <p><strong>Location:</strong> ${location}</p>
        </div>

        <div style="margin: 30px 0; text-align: center;">
          <a href="${calendarUrl}" 
             style="background-color: #4285F4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold; font-size: 16px;"
             target="_blank">
            Add to Google Calendar
          </a>
        </div>

        <p style="margin-top: 20px;">We will notify you once your event has been approved and added to our calendar.</p>
      </body>
    </html>
  `
}

export async function POST(request: Request) {
  try {
    // Verify Resend configuration first
    const isResendConfigured = await verifyResendConfig();
    if (!isResendConfigured) {
      console.error('Resend configuration verification failed');
      return Response.json(
        { 
          error: 'Email service configuration error', 
          details: 'Failed to verify email service configuration. Please check your RESEND_API_KEY.' 
        },
        { status: 500 }
      );
    }

    // Validate required environment variables
    const requiredEnvVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      ADMIN_EMAIL: process.env.ADMIN_EMAIL
    }

    const missingVars = Object.entries(requiredEnvVars)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingVars.length > 0) {
      console.error('Missing required environment variables:', missingVars);
      return Response.json(
        { 
          error: 'Server configuration error', 
          details: `Missing environment variables: ${missingVars.join(', ')}. Please check your server configuration.` 
        },
        { status: 500 }
      );
    }

    console.log('Starting form submission...');
    const formData = await request.formData()
    
    // Validate required form fields
    const requiredFields = ['eventName', 'eventDate', 'eventTime', 'endTime', 'location', 'city', 'state', 'organizerName', 'organizerEmail'];
    const missingFields = requiredFields.filter(field => !formData.get(field));
    
    if (missingFields.length > 0) {
      console.error('Missing required form fields:', missingFields);
      return Response.json(
        { 
          error: 'Invalid form data', 
          details: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    console.log('Form data received:', {
      eventName: formData.get('eventName'),
      eventDate: formData.get('eventDate')
    });

    // Send emails
    const organizerEmail = formData.get('organizerEmail') as string
    const adminEmail = process.env.ADMIN_EMAIL as string

    if (!organizerEmail) {
      return Response.json(
        { 
          error: 'Invalid request', 
          details: 'Organizer email is required' 
        },
        { status: 400 }
      );
    }

    console.log('Sending email to:', {
      adminEmail
    });

    // Generate email template
    const adminEmailHtml = getAdminEmailHtml(formData)

    // Send admin email
    let adminEmailResponse;
    try {
      console.log('Sending admin email...');
      adminEmailResponse = await resend.emails.send({
        from: "Bachata Hub <onboarding@resend.dev>",
        to: "bachata.au@gmail.com", // Send to verified email for testing
        replyTo: "bachata.au@gmail.com",
        subject: `New Event Submission: ${formData.get('eventName')}`,
        html: adminEmailHtml
      });
      console.log('Admin email sent successfully:', adminEmailResponse);
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
      return Response.json(
        { 
          error: 'Failed to send email notification', 
          details: adminEmailError instanceof Error ? adminEmailError.message : 'Unknown error',
          debug: {
            adminEmail,
            adminEmailResponse
          }
        },
        { status: 500 }
      );
    }

    // Add event to Google Calendar based on state/city
    let calendarEventId = null;
    try {
      const state = formData.get('state')?.toString() || '';
      const city = formData.get('city')?.toString() || '';
      
      // Map of states/cities to calendar IDs (matching the ones in calendar-events.ts)
      const cityCalendarMap: { [key: string]: string } = {
        'NSW': '4ea35178b00a2daa33a492682e866bd67e8b83797a948a31caa8a37e2a982dce@group.calendar.google.com', // Sydney
        'VIC': '641b8d8fbee5ff9eb2402997e5990b3e52a737b134ec201748349884985c84f4@group.calendar.google.com', // Melbourne
        'QLD': city.toLowerCase().includes('gold coast') 
          ? 'c9ed91c3930331387d69631072510838ec9155b75ca697065025d24e34cde78b@group.calendar.google.com' // Gold Coast
          : 'f0b5764410b23c93087a7d3ef5ed0d0a295ad2b811d10bb772533d7517d2fdc5@group.calendar.google.com', // Brisbane
        'WA': 'e521c86aed4060431cf6de7405315790dcca0a10d4779cc333835199f3724c16@group.calendar.google.com', // Perth
        'SA': '6b95632fc6fe63530bbdd89c944d792009478636f5b2ce7ffc8718ccd500915f@group.calendar.google.com', // Adelaide
        'ACT': '3a82a9f1ed5a4e865ed9f13b24a96004fe7c4b2deb07a422f068c70753f421eb@group.calendar.google.com', // Canberra
        'NT': '27319882e504521ffd07dca62fdf7a55f835bfb4233f4c096e787fa8e8fb881b@group.calendar.google.com', // Darwin
        'TAS': '2f92a58bc97f58a3285a05a474f222d22aaed327af7431f21c2ad1a681c9607b@group.calendar.google.com', // Hobart
      };

      const calendarId = cityCalendarMap[state] || cityCalendarMap['NSW']; // Default to Sydney if state not found
      
      if (process.env.GOOGLE_CLIENT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && calendarId) {
        console.log(`Adding event to calendar: ${state} (${city}) -> ${calendarId}`);
        
        const auth = new google.auth.GoogleAuth({
          credentials: {
            client_email: process.env.GOOGLE_CLIENT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
          },
          scopes: ['https://www.googleapis.com/auth/calendar'],
        });

        const calendar = google.calendar({ version: 'v3', auth });
        
        const eventName = formData.get('eventName')?.toString() || '';
        const eventDate = formData.get('eventDate')?.toString() || '';
        const eventTime = formData.get('eventTime')?.toString() || '';
        const endTime = formData.get('endTime')?.toString() || '';
        const location = formData.get('location')?.toString() || '';
        const description = formData.get('description')?.toString() || '';
        
        // Extract Google Drive image URL from description if present
        let imageUrl = '';
        const driveMatch = description.match(/https:\/\/drive\.google\.com\/[^\s"']+/);
        if (driveMatch) {
          imageUrl = driveMatch[0].trim();
          // Convert to direct view URL if needed
          const fileId = imageUrl.match(/\/d\/([^\/]+)/)?.[1] || imageUrl.match(/id=([^&]+)/)?.[1];
          if (fileId) {
            imageUrl = `https://drive.google.com/uc?export=view&id=${fileId}`;
          }
        }
        
        // Format description to include image URL in a way that getEventImage can find it
        const formattedDescription = imageUrl 
          ? `${description}\n\n[image:${imageUrl}]`
          : description;

        // Format datetime strings
        const startDateTime = `${eventDate}T${eventTime}:00`;
        const endDateTime = `${eventDate}T${endTime}:00`;

        const calendarResponse = await calendar.events.insert({
          calendarId: calendarId,
          requestBody: {
            summary: eventName,
            description: formattedDescription,
            start: {
              dateTime: startDateTime,
              timeZone: 'Australia/Sydney',
            },
            end: {
              dateTime: endDateTime,
              timeZone: 'Australia/Sydney',
            },
            location: location,
          },
        });

        calendarEventId = calendarResponse.data.id;
        console.log('Event added to Google Calendar successfully:', calendarEventId);
      } else {
        console.warn('Google Calendar credentials not configured, skipping calendar addition');
      }
    } catch (calendarError) {
      console.error('Failed to add event to Google Calendar:', calendarError);
      // Don't fail the entire request if calendar addition fails - email was sent successfully
    }

    return Response.json({ 
      success: true,
      calendarEventId: calendarEventId,
      message: calendarEventId 
        ? 'Event submitted and added to calendar successfully!' 
        : 'Event submitted successfully! (Calendar addition may have failed)',
      debug: {
        adminEmailResponse
      }
    }, { status: 200 });
  } catch (error) {
    console.error('Error in form submission:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return Response.json(
      { 
        error: 'Failed to submit event', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}