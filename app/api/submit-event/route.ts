import { Resend } from "resend"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { z } from "zod"
import nodemailer from 'nodemailer'

// Log all environment variables (without sensitive values)
console.log("Environment variables status:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? "Set" : "Missing",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "Set" : "Missing"
})

// Initialize Resend with the new API key
const resend = new Resend(process.env.RESEND_API_KEY)

// Configure Cloudinary with environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// Log Cloudinary configuration status
console.log("Cloudinary configuration:", {
  cloudName: cloudName || "Missing",
  apiKey: apiKey || "Missing",
  apiSecret: apiSecret ? "Set" : "Missing"
})

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })
  console.log("Cloudinary configured successfully with:", {
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret ? "Set" : "Missing"
  })
} else {
  console.error("Cloudinary configuration is incomplete")
}

// Add this type for Cloudinary response
type CloudinaryResponse = {
  secure_url: string;
  // ... other cloudinary response fields
};

// Add this type for email attachments
type EmailAttachment = {
  filename: string;
  content: Buffer;
};

// Add this function near the top after the cloudinary config
async function uploadToCloudinary(file: File): Promise<CloudinaryResponse> {
  try {
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error)
            reject(error)
          } else {
            console.log('Cloudinary upload success:', result)
            resolve(result as CloudinaryResponse)
          }
        }
      )

      uploadStream.end(buffer)
    })
  } catch (error) {
    console.error('Error in uploadToCloudinary:', error)
    throw error
  }
}

// Add this function to format the admin email HTML
function getAdminEmailHtml(formData: FormData, imageUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #333; margin-bottom: 20px;">New Event Submission</h2>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <p><strong>Event Name:</strong> ${formData.get('eventName')}</p>
        <p><strong>Date:</strong> ${formData.get('eventDate')}</p>
        <p><strong>Time:</strong> ${formData.get('eventTime')} - ${formData.get('endTime')}</p>
        <p><strong>Location:</strong> ${formData.get('location')}</p>
        <p><strong>State:</strong> ${formData.get('state')}</p>
        <p><strong>City:</strong> ${formData.get('city')}</p>
        <p><strong>Description:</strong> ${formData.get('description')}</p>
        <p><strong>Organizer:</strong> ${formData.get('organizerName')}</p>
        <p><strong>Organizer Email:</strong> ${formData.get('organizerEmail')}</p>
        <p><strong>Event Link:</strong> ${formData.get('eventLink')}</p>
        <p><strong>Ticket Link:</strong> ${formData.get('ticketLink')}</p>
      </div>
      ${imageUrl ? `<img src="${imageUrl}" alt="Event image" style="max-width: 100%; border-radius: 5px; margin-top: 10px;">` : ''}
    </div>
  `
}

// Add this function to format the organizer email HTML
function getOrganizerEmailHtml(formData: FormData, imageUrl: string) {
  const eventName = formData.get('eventName')?.toString() || ''
  const eventDate = formData.get('eventDate')?.toString() || ''
  const eventTime = formData.get('eventTime')?.toString() || ''
  const endTime = formData.get('endTime')?.toString() || ''
  const location = formData.get('location')?.toString() || ''
  const description = formData.get('description')?.toString() || ''

  // Format dates for Google Calendar
  const [year, month, day] = eventDate.split('-')
  const [startHour, startMinute] = eventTime.split(':')
  const [endHour, endMinute] = endTime.split(':')
  
  // Format: YYYYMMDDTHHMMSSZ
  const start = `${year}${month}${day}T${startHour}${startMinute}00Z`
  const end = `${year}${month}${day}T${endHour}${endMinute}00Z`
  
  const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&dates=${start}/${end}&details=${encodeURIComponent(description)}&location=${encodeURIComponent(location)}`

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
          ${imageUrl ? `
            <div style="margin-top: 20px;">
              <img src="${imageUrl}" alt="Event image" style="max-width: 100%; border-radius: 5px;">
            </div>
          ` : ''}
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

// Add this function to download the image
async function downloadImage(url: string): Promise<Buffer> {
  const response = await fetch(url);
  return Buffer.from(await response.arrayBuffer());
}

// Add this function to verify Resend configuration
async function verifyResendConfig() {
  try {
    if (!process.env.RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY is not set');
    }
    
    // Test the API key by making a simple request
    const response = await resend.emails.send({
      from: "Bachata Hub <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL || '',
      subject: "Resend API Test",
      html: "<p>Testing Resend API configuration</p>"
    });
    
    console.log('Resend API test successful:', response);
    return true;
  } catch (error) {
    console.error('Resend API test failed:', error);
    return false;
  }
}

export async function POST(request: Request) {
  try {
    // Verify Resend configuration first
    const isResendConfigured = await verifyResendConfig();
    if (!isResendConfigured) {
      return Response.json(
        { 
          error: 'Email service configuration error', 
          details: 'Failed to verify email service configuration' 
        },
        { status: 500 }
      );
    }

    // Validate required environment variables
    const requiredEnvVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY,
      CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET,
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
          details: `Missing environment variables: ${missingVars.join(', ')}` 
        },
        { status: 500 }
      );
    }

    console.log('Starting form submission...');
    const formData = await request.formData()
    console.log('Form data received:', {
      eventName: formData.get('eventName'),
      eventDate: formData.get('eventDate'),
      hasImage: !!formData.get('image')
    });

    const imageFile = formData.get('image') as File | null
    let imageUrl = ''

    // Upload image to Cloudinary if provided
    if (imageFile) {
      try {
        console.log('Uploading image...');
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)

        const result = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            { resource_type: 'auto' },
            (error, result) => {
              if (error) {
                console.error('Cloudinary upload error:', error);
                reject(error);
              } else {
                console.log('Cloudinary upload success:', result);
                resolve(result);
              }
            }
          ).end(buffer)
        }) as any

        imageUrl = result.secure_url
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    }

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

    console.log('Sending emails to:', {
      organizerEmail,
      adminEmail
    });

    // Generate email templates
    const adminEmailHtml = getAdminEmailHtml(formData, imageUrl)
    const organizerEmailHtml = getOrganizerEmailHtml(formData, imageUrl)

    // Prepare image attachment if available
    let imageAttachment: EmailAttachment[] = [];
    if (imageUrl) {
      try {
        console.log('Preparing image attachment...');
        const imageBuffer = await downloadImage(imageUrl)
        imageAttachment = [{
          filename: 'event-image.jpg',
          content: imageBuffer
        }]
      } catch (attachmentError) {
        console.error('Failed to prepare image attachment:', attachmentError);
        // Continue without attachment
      }
    }

    // Send admin email
    let adminEmailResponse;
    try {
      console.log('Sending admin email...');
      adminEmailResponse = await resend.emails.send({
        from: "Bachata Hub <onboarding@resend.dev>",
        to: adminEmail,
        subject: `New Event Submission: ${formData.get('eventName')}`,
        html: adminEmailHtml,
        attachments: imageAttachment
      });
      console.log('Admin email sent successfully:', adminEmailResponse);
    } catch (adminEmailError) {
      console.error('Failed to send admin email:', adminEmailError);
      // Continue with organizer email even if admin email fails
    }

    // Send organizer confirmation email
    let organizerEmailResponse;
    try {
      console.log('Sending organizer email...');
      organizerEmailResponse = await resend.emails.send({
        from: "Bachata Hub <onboarding@resend.dev>",
        to: organizerEmail,
        subject: "Event Submission Received - Bachata Hub",
        html: organizerEmailHtml,
        attachments: imageAttachment
      });
      console.log('Organizer email sent successfully:', organizerEmailResponse);
    } catch (organizerEmailError) {
      console.error('Failed to send organizer email:', organizerEmailError);
      return Response.json(
        { 
          error: 'Failed to send confirmation email', 
          details: organizerEmailError instanceof Error ? organizerEmailError.message : 'Unknown error',
          debug: {
            organizerEmail,
            adminEmail,
            adminEmailResponse,
            organizerEmailResponse
          }
        },
        { status: 500 }
      );
    }

    return Response.json({ 
      success: true,
      debug: {
        adminEmailResponse,
        organizerEmailResponse
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