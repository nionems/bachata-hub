import { Resend } from "resend"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { google } from "googleapis"
import { z } from "zod"
import nodemailer from 'nodemailer'
import { JWT } from 'google-auth-library'

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
    cloud_name: "dv5uzk4ka",
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
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

// Calendar IDs for different cities
const calendarIds = {
  sydney: "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com",
  melbourne: "ZDg5ODU5MzdkZTBhYmU5YjYwZDg4Zjg2NWJhMjA4YzAwNzc0ZDJlMTNjNDFjOWQ4NmMwMDgzODNkNGRhMzJhOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  adelaide: "MTZiOGZlOTYwMDc5NGQ1OTAzMDkwMWE2NzlhODRhNmE3YTgxNmY0YjI5MjM3NzNiYWFmODg2ODcxYjE0YTJkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  brisbane: "YWFhMjIyZjZlZjBhNDNiZTUwOGUyYjVhN2EyYmNhYjIzMmZmMTlmYTlkY2UwZDE2YWViNTQ3MzczZDhkNTI0NUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  perth: "NDY5ZmIzYmVkMDMwOGIxYThjY2M4ZTlkOTFmYjAyMDBlNmYzYWRlYWZkODE0YzE3NDdiYzk0MDkxZGMxMWFhNUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
}

// Update the addToGoogleSheet function
async function addToGoogleSheet(formData: FormData, imageUrl: string) {
  try {
    console.log('Starting Google Sheet update...');
    
    // Log environment variables (safely)
    console.log('Checking Google Sheets credentials:', {
      hasSheetId: !!process.env.GOOGLE_SHEET_ID,
      hasServiceAccount: !!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      hasPrivateKey: !!process.env.GOOGLE_PRIVATE_KEY
    });

    // Create JWT client
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    const sheets = google.sheets({ version: 'v4', auth: serviceAccountAuth });

    // Format the data
    const values = [[
      new Date().toLocaleString('en-AU', { timeZone: 'Australia/Sydney' }), // Timestamp
      formData.get('eventName')?.toString() || '',
      formData.get('eventDate')?.toString() || '',
      formData.get('eventTime')?.toString() || '',
      formData.get('endTime')?.toString() || '',
      formData.get('location')?.toString() || '',
      formData.get('state')?.toString() || '',
      formData.get('city')?.toString() || '',
      formData.get('description')?.toString() || '',
      formData.get('organizerName')?.toString() || '',
      formData.get('organizerEmail')?.toString() || '',
      formData.get('eventLink')?.toString() || '',
      formData.get('ticketLink')?.toString() || '',
      imageUrl || '',
      'Pending'
    ]];

    console.log('Data to be added:', values[0]); // Log the data being added

    try {
      const response = await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.GOOGLE_SHEET_ID,
        range: 'bachata_events!A:O',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
          values,
        },
      });

      console.log('Sheet update response:', response.data);
      return response.data;
    } catch (appendError) {
      console.error('Error appending to sheet:', appendError);
      // Try to get more information about the sheet
      try {
        const sheetInfo = await sheets.spreadsheets.get({
          spreadsheetId: process.env.GOOGLE_SHEET_ID
        });
        console.log('Sheet info:', sheetInfo.data);
      } catch (infoError) {
        console.error('Error getting sheet info:', infoError);
      }
      throw appendError;
    }

  } catch (error) {
    console.error('Error in addToGoogleSheet:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    throw error;
  }
}

// Add this function to format the admin email HTML
function getAdminEmailHtml(formData: FormData, imageUrl: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">New Event Submission</h2>
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
      ${imageUrl ? `<img src="${imageUrl}" alt="Event image" style="max-width: 100%; border-radius: 5px;">` : ''}
    </div>
  `
}

// Add this function to format the organizer email HTML
function getOrganizerEmailHtml(formData: FormData) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #333;">Event Submission Received</h2>
      <p>Thank you for submitting your event to Bachata Hub. We have received your submission and will review it shortly.</p>
      <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
        <h3 style="margin-top: 0;">Event Details:</h3>
        <p><strong>Event Name:</strong> ${formData.get('eventName')}</p>
        <p><strong>Date:</strong> ${formData.get('eventDate')}</p>
        <p><strong>Time:</strong> ${formData.get('eventTime')} - ${formData.get('endTime')}</p>
        <p><strong>Location:</strong> ${formData.get('location')}</p>
      </div>
      <p>We will notify you once your event has been approved and added to our calendar.</p>
    </div>
  `
}

export async function POST(request: Request) {
  try {
    console.log('Starting form submission...');
    const formData = await request.formData();
    
    // Log form data (without sensitive info)
    console.log('Form data received:', {
      eventName: formData.get('eventName'),
      eventDate: formData.get('eventDate'),
      hasImage: !!formData.get('image')
    });

    // Image upload
    let imageUrl = '';
    const imageFile = formData.get('image') as File | null;
    if (imageFile) {
      try {
        console.log('Uploading image...');
        const imageData = await uploadToCloudinary(imageFile);
        imageUrl = imageData.secure_url;
        console.log('Image uploaded:', imageUrl);
      } catch (uploadError) {
        console.error('Image upload failed:', uploadError);
        // Continue without image if upload fails
      }
    }

    // Google Sheet update
    try {
      console.log('Updating Google Sheet...');
      await addToGoogleSheet(formData, imageUrl);
    } catch (sheetError) {
      console.error('Google Sheet update failed:', sheetError);
      // Continue if sheet update fails
    }

    // Send emails
    try {
      // Generate email templates
      const adminEmailHtml = getAdminEmailHtml(formData, imageUrl);
      const organizerEmailHtml = getOrganizerEmailHtml(formData);

      // Send admin email
      console.log('Sending admin email...');
      const adminEmailResult = await resend.emails.send({
        from: "Bachata Hub <onboarding@resend.dev>",
        to: "bachata.au@gmail.com",
        subject: `New Event Submission: ${formData.get('eventName')}`,
        html: adminEmailHtml,
        attachments: imageUrl ? [{ filename: 'event-image.jpg', path: imageUrl }] : []
      });

      // Send organizer confirmation email
      console.log('Sending organizer email...');
      const organizerEmailResult = await resend.emails.send({
        from: "Bachata Hub <onboarding@resend.dev>",
        to: formData.get('organizerEmail') as string,
        subject: "Event Submission Received - Bachata Hub",
        html: organizerEmailHtml
      });

      console.log('Emails sent successfully');
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      // Continue if email sending fails
    }

    return NextResponse.json({ 
      message: 'Event submitted successfully',
      imageUrl: imageUrl || null
    });

  } catch (error) {
    console.error('Error in form submission:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { error: 'Failed to submit event', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}