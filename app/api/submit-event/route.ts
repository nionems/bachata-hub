import { Resend } from "resend"
import { NextResponse } from "next/server"

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

    return Response.json({ 
      success: true,
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