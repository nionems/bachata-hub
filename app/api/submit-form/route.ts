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
async function getAdminEmailHtml(type: string, data: any) {
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
        <p><strong>Shop name / Item name:</strong> ${data.name}</p>
        <p><strong>Location (city):</strong> ${data.location}</p>
        <p><strong>State:</strong> ${data.state}</p>
        <p><strong>Address:</strong> ${data.address || 'N/A'}</p>
        <p><strong>Contact name:</strong> ${data.contactName}</p>
        <p><strong>Contact email:</strong> ${data.contactEmail}</p>
        <p><strong>Contact phone:</strong> ${data.contactPhone || 'N/A'}</p>
        <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramUrl || 'N/A'}</p>
        <p><strong>Facebook:</strong> ${data.facebookUrl || 'N/A'}</p>
        <p><strong>Price range:</strong> ${data.price}</p>
        <p><strong>Condition:</strong> ${data.condition}</p>
        <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
        <p><strong>Discount code:</strong> ${data.discountCode || 'N/A'}</p>
        <p><strong>Image URL (Google Drive):</strong> ${data.imageUrl}</p>
        <p><strong>Google map link:</strong> ${data.googleMapLink || 'N/A'}</p>
        <p><strong>Item info:</strong> ${data.info}</p>
        
        <hr style="margin: 20px 0;">
        
        <h3>Quick Actions:</h3>
        <p>Click the buttons below to approve or reject this submission:</p>
        
        <div style="margin: 20px 0;">
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/approve-shop?name=${encodeURIComponent(data.name)}&location=${encodeURIComponent(data.location)}&state=${encodeURIComponent(data.state)}&address=${encodeURIComponent(data.address || '')}&contactName=${encodeURIComponent(data.contactName)}&contactEmail=${encodeURIComponent(data.contactEmail)}&contactPhone=${encodeURIComponent(data.contactPhone || '')}&website=${encodeURIComponent(data.website || '')}&instagramUrl=${encodeURIComponent(data.instagramUrl || '')}&facebookUrl=${encodeURIComponent(data.facebookUrl || '')}&price=${encodeURIComponent(data.price)}&condition=${encodeURIComponent(data.condition)}&comment=${encodeURIComponent(data.comment || '')}&discountCode=${encodeURIComponent(data.discountCode || '')}&imageUrl=${encodeURIComponent(data.imageUrl)}&googleMapLink=${encodeURIComponent(data.googleMapLink || '')}&info=${encodeURIComponent(data.info)}" 
             style="background-color: #10B981; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-right: 10px; display: inline-block;">
            ✅ Approve & Add to Database
          </a>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/reject-shop?name=${encodeURIComponent(data.name)}&location=${encodeURIComponent(data.location)}&state=${encodeURIComponent(data.state)}&contactName=${encodeURIComponent(data.contactName)}&contactEmail=${encodeURIComponent(data.contactEmail)}" 
             style="background-color: #EF4444; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
            ❌ Reject Submission
          </a>
        </div>
        
        <p style="font-size: 12px; color: #666; margin-top: 20px;">
          Note: These links will immediately approve or reject the submission. Use with caution.
        </p>
      `

      // Also save to database with pending status
      try {
        const { collection, addDoc } = await import('firebase/firestore')
        const { db } = await import('@/lib/firebase')
        
        const shopData = {
          name: data.name,
          location: data.location,
          state: data.state,
          address: data.address || '',
          contactName: data.contactName,
          contactEmail: data.contactEmail,
          contactPhone: data.contactPhone || '',
          website: data.website || '',
          instagramUrl: data.instagramUrl || '',
          facebookUrl: data.facebookUrl || '',
          price: data.price,
          condition: data.condition,
          comment: data.comment || '',
          discountCode: data.discountCode || '',
          imageUrl: data.imageUrl,
          googleMapLink: data.googleMapLink || '',
          info: data.info,
          danceStyles: ['Bachata', 'Salsa', 'Kizomba', 'Zouk', 'Reggaeton', 'Heels', 'Pole Dance', 'Latin Beat', 'HipHop', 'Mambo', 'Dominican Bachata', 'Sensual Bachata', 'Bachata Moderna', 'Cuban Salsa', 'Chacha', 'Rumba', 'Merengue', 'Tango', 'Afrobeats', 'Taraxo', 'Choreography', 'Ballroom', 'Twerk', 'Jazz', 'Contemporary', 'Bachazouk', 'Bachata Influence', 'Other'],
          status: 'pending' as const,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }

        await addDoc(collection(db, 'shops'), shopData)
        console.log('Shop submission saved to database with pending status')
      } catch (dbError) {
        console.error('Error saving shop to database:', dbError)
        // Continue with email sending even if database save fails
      }
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
        <p><strong>Facebook:</strong> ${data.facebookLink || 'N/A'}</p>
        <p><strong>Instagram:</strong> ${data.instagramLink || 'N/A'}</p>
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

    let body;
    try {
      body = await request.json();
    } catch (e) {
      console.error('Failed to parse request body:', e);
      return NextResponse.json(
        { error: 'Invalid request', details: 'Failed to parse request body' },
        { status: 400 }
      );
    }

    const { type, data } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Invalid request', details: 'Missing type or data' },
        { status: 400 }
      );
    }

    // Generate email content
    const { subject, html } = await getAdminEmailHtml(type, data);

    if (!subject || !html) {
      return NextResponse.json(
        { error: 'Invalid submission type', details: 'Unsupported submission type' },
        { status: 400 }
      );
    }

    // Send email
    const emailResponse = await resend.emails.send({
      from: "Bachata Hub <onboarding@resend.dev>",
      to: "bachata.au@gmail.com",
      replyTo: "bachata.au@gmail.com",
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