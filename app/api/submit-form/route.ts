import { Resend } from "resend"
import { NextResponse } from "next/server"

// Initialize Resend with the API key
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
function getAdminEmailHtml(type: string, data: any) {
  let subject = '';
  let html = '';

  switch (type) {
    case 'contact_form':
      subject = 'New Contact Form Submission'
      html = `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `
      break;
    case 'school_submission':
      subject = 'New School Submission'
      html = `
        <h2>New School Submission</h2>
        <p><strong>School Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramUrl || 'N/A'}</p>
        <p><strong>Facebook:</strong> ${data.facebookUrl || 'N/A'}</p>
        <p><strong>Contact Info:</strong> ${data.contactInfo}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Dance Styles:</strong> ${data.danceStyles}</p>
        <p><strong>Description:</strong> ${data.description}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
      `
      break;
    case 'shop_submission':
      subject = 'New Shop Submission'
      html = `
        <h2>New Shop Submission</h2>
        <p><strong>Shop Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramLink || 'N/A'}</p>
        <p><strong>Facebook:</strong> ${data.facebookLink || 'N/A'}</p>
        <p><strong>Google Maps:</strong> ${data.googleMapLink || 'N/A'}</p>
        <p><strong>Contact Name:</strong> ${data.contactName}</p>
        <p><strong>Contact Email:</strong> ${data.contactEmail}</p>
        <p><strong>Contact Phone:</strong> ${data.contactPhone || 'N/A'}</p>
        <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Additional Information:</strong> ${data.additionalInfo || 'N/A'}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
      `
      break;
    case 'festival_submission':
      subject = 'New Festival Submission'
      html = `
        <h2>New Festival Submission</h2>
        <p><strong>Festival Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Start Date:</strong> ${data.startDate}</p>
        <p><strong>End Date:</strong> ${data.endDate}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramLink || 'N/A'}</p>
        <p><strong>Facebook:</strong> ${data.facebookLink || 'N/A'}</p>
        <p><strong>Google Maps:</strong> ${data.googleMapLink || 'N/A'}</p>
        <p><strong>Contact Name:</strong> ${data.contactName}</p>
        <p><strong>Contact Email:</strong> ${data.contactEmail}</p>
        <p><strong>Contact Phone:</strong> ${data.contactPhone || 'N/A'}</p>
        <p><strong>Additional Comments:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
      `
      break;
    case 'instructor_submission':
      subject = 'New Instructor Submission'
      html = `
        <h2>New Instructor Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Bio:</strong> ${data.bio}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Social URL:</strong> ${data.socialUrl || 'N/A'}</p>
        <p><strong>Contact Info:</strong> ${data.contactInfo}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Dance Styles:</strong> ${data.danceStyles}</p>
        <p><strong>Experience:</strong> ${data.experience}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
      `
      break;
    case 'dj_submission':
      subject = 'New DJ Submission'
      html = `
        <h2>New DJ Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Contact:</strong> ${data.contact}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Music Styles:</strong> ${data.musicStyles}</p>
        <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramLink || 'N/A'}</p>
        <p><strong>Facebook:</strong> ${data.facebookLink || 'N/A'}</p>
        <p><strong>Email Link:</strong> ${data.emailLink || 'N/A'}</p>
        <p><strong>Music Link:</strong> ${data.musicLink || 'N/A'}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
      `
      break;
    case 'competition_submission':
      subject = 'New Competition Submission'
      html = `
        <h2>New Competition Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Organizer:</strong> ${data.organizer}</p>
        <p><strong>Contact Info:</strong> ${data.contactInfo}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Start Date:</strong> ${data.startDate}</p>
        <p><strong>End Date:</strong> ${data.endDate}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Event Link:</strong> ${data.eventLink || 'N/A'}</p>
        <p><strong>Price:</strong> ${data.price || 'N/A'}</p>
        <p><strong>Ticket Link:</strong> ${data.ticketLink || 'N/A'}</p>
        <p><strong>Dance Styles:</strong> ${data.danceStyles}</p>
        <p><strong>Categories:</strong> ${data.categories.join(', ')}</p>
        <p><strong>Level:</strong> ${data.level.join(', ')}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
        <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Google Maps:</strong> ${data.googleMapLink || 'N/A'}</p>
        <p><strong>Social Link:</strong> ${data.socialLink || 'N/A'}</p>
      `
      break;
    case 'media_submission':
      subject = 'New Media Submission'
      html = `
        <h2>New Media Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Contact:</strong> ${data.contact}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramLink || 'N/A'}</p>
        <p><strong>Facebook:</strong> ${data.facebookLink || 'N/A'}</p>
        <p><strong>Email Link:</strong> ${data.emailLink || 'N/A'}</p>
        <p><strong>Media Link:</strong> ${data.mediaLink || 'N/A'}</p>
        <p><strong>Media Link 2:</strong> ${data.mediaLink2 || 'N/A'}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl}</p>
      `
      break;
    case 'accommodation_submission':
      subject = 'New Accommodation Submission'
      html = `
        <h2>New Accommodation Submission</h2>
        <p><strong>Name:</strong> ${data.name}</p>
        <p><strong>Location:</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Address:</strong> ${data.address}</p>
        <p><strong>Contact Info:</strong> ${data.contactInfo}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Price:</strong> ${data.price}</p>
        <p><strong>Rooms:</strong> ${data.rooms}</p>
        <p><strong>Capacity:</strong> ${data.capacity}</p>
        <p><strong>Image URL:</strong> ${data.imageUrl || 'N/A'}</p>
        <p><strong>Description:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Google Map Link:</strong> ${data.googleMapLink || 'N/A'}</p>
        <p><strong>Facebook Link:</strong> ${data.facebookLink || 'N/A'}</p>
        <p><strong>Instagram Link:</strong> ${data.instagramLink || 'N/A'}</p>
      `
      break;
  }

  return { subject, html };
}

export async function POST(request: Request) {
  try {
    // Verify Resend configuration first
    const isResendConfigured = await verifyResendConfig();
    if (!isResendConfigured) {
      console.error('Resend configuration verification failed');
      return NextResponse.json(
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
      return NextResponse.json(
        { 
          error: 'Server configuration error', 
          details: `Missing environment variables: ${missingVars.join(', ')}. Please check your server configuration.` 
        },
        { status: 500 }
      );
    }

    const { type, data } = await request.json()

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Invalid request', details: 'Missing type or data' },
        { status: 400 }
      );
    }

    // Generate email content
    const { subject, html } = getAdminEmailHtml(type, data);

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Bachata Hub <onboarding@resend.dev>",
      to: "bachata.au@gmail.com",
      subject: subject,
      html: html
    });

    if (emailResponse.error) {
      console.error('Failed to send email:', emailResponse.error);
      return NextResponse.json(
        { error: 'Failed to send email', details: emailResponse.error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in form submission:', error);
    return NextResponse.json(
      { 
        error: 'Failed to submit form', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
} 