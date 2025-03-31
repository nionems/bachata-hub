import { Resend } from "resend"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

// Log all environment variables (without sensitive values)
console.log("Environment variables status:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? "Set" : "Missing",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "Set" : "Missing"
})

// Initialize Resend only if API key is available
const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null

// Configure Cloudinary with environment variables
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// Log Cloudinary configuration status
console.log("Cloudinary configuration:", {
  cloudName: cloudName ? "Set" : "Missing",
  apiKey: apiKey ? "Set" : "Missing",
  apiSecret: apiSecret ? "Set" : "Missing"
})

if (cloudName && apiKey && apiSecret) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  })
  console.log("Cloudinary configured successfully")
} else {
  console.error("Cloudinary configuration is incomplete")
}

// Calendar IDs for different cities
const calendarIds = {
  sydney: "8d27a79f37a74ab7aedc5c038cc4492cd36b87a71b57fb6d7d141d04e8ffe5c2@group.calendar.google.com",
  melbourne: "ZDg5ODU5MzdkZTBhYmU5YjYwZDg4Zjg2NWJhMjA4YzAwNzc0ZDJlMTNjNDFjOWQ4NmMwMDgzODNkNGRhMzJhOUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  adelaide: "MTZiOGZlOTYwMDc5NGQ1OTAzMDkwMWE2NzlhODRhNmE3YTgxNmY0YjI5MjM3NzNiYWFmODg2ODcxYjE0YTJkZUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  brisbane: "YWFhMjIyZjZlZjBhNDNiZTUwOGUyYjVhN2EyYmNhYjIzMmZmMTlmYTlkY2UwZDE2YWViNTQ3MzczZDhkNTI0NUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t",
  perth: "NDY5ZmIzYmVkMDMwOGIxYThjY2M4ZTlkOTFmYjAyMDBlNmYzYWRlYWZkODE0YzE3NDdiYzk0MDkxZGMxMWFhNUBncm91cC5jYWxlbmRhci5nb29nbGUuY29t"
}

export async function POST(request: Request) {
  try {
    // Log the incoming request
    console.log("Received event submission request")
    
    const formData = await request.formData()
    const formDataObj = Object.fromEntries(formData)
    console.log("Form data received:", {
      ...formDataObj,
      image: formDataObj.image ? "File present" : "No file"
    })

    const {
      eventName,
      eventDate,
      eventTime,
      location,
      city,
      description,
      organizerName,
      organizerEmail,
      ticketLink,
      image,
    } = formDataObj

    // Log parsed form data
    console.log("Parsed form data:", {
      eventName,
      eventDate,
      eventTime,
      location,
      city,
      description,
      organizerName,
      organizerEmail,
      ticketLink,
      hasImage: !!image
    })

    // Validate required fields
    if (!eventName || !eventDate || !eventTime || !location || !city || !description || !organizerName || !organizerEmail) {
      console.error("Missing required fields:", {
        eventName: !!eventName,
        eventDate: !!eventDate,
        eventTime: !!eventTime,
        location: !!location,
        city: !!city,
        description: !!description,
        organizerName: !!organizerName,
        organizerEmail: !!organizerEmail
      })
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Format date and time for Google Calendar
    const formattedDate = eventDate as string
    const formattedTime = eventTime as string
    
    // Create a date object in the local timezone
    const eventDateTime = new Date(`${formattedDate}T${formattedTime}`)
    
    // Ensure the date is valid
    if (isNaN(eventDateTime.getTime())) {
      console.error("Invalid date:", formattedDate, formattedTime)
      return NextResponse.json(
        { error: "Invalid date or time format" },
        { status: 400 }
      )
    }

    // Format the date and time for the Google Calendar URL
    // Use UTC to avoid timezone issues
    const startDateTime = eventDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDateTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    console.log("Formatted date/time:", {
      originalDate: formattedDate,
      originalTime: formattedTime,
      parsedDateTime: eventDateTime.toISOString(),
      startDateTime,
      endDateTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })

    let imageUrl = null
    if (image instanceof File) {
      try {
        console.log("Processing image upload")
        // Convert File to Buffer
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        console.log("Image buffer created, size:", buffer.length)

        // Upload to Cloudinary
        const result = await new Promise((resolve, reject) => {
          if (!cloudName || !apiKey || !apiSecret) {
            console.error("Cloudinary configuration missing:", {
              cloudName: !!cloudName,
              apiKey: !!apiKey,
              apiSecret: !!apiSecret
            })
            reject(new Error("Cloudinary configuration is incomplete"))
            return
          }

          const uploadStream = cloudinary.uploader.upload_stream(
            {
              resource_type: "auto",
              folder: "bachata-events",
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error)
                reject(error)
              } else {
                console.log("Image uploaded successfully")
                resolve(result)
              }
            }
          )

          uploadStream.end(buffer)
          console.log("Upload stream started")
        })

        imageUrl = (result as any).secure_url
        console.log("Image URL:", imageUrl)
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError)
        // Continue without the image if upload fails
      }
    }

    // Get the appropriate calendar ID based on the city
    const cityKey = (city as string).toLowerCase()
    const calendarId = calendarIds[cityKey as keyof typeof calendarIds] || calendarIds.sydney
    
    // Create a rich description that includes the image
    const richDescription = `${description as string}${imageUrl ? `\n\nEvent Image:\n${imageUrl}` : ""}`
    
    // Create the Google Calendar URL with proper date formatting
    const calendarUrl = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(eventName as string)}&details=${encodeURIComponent(richDescription)}&location=${encodeURIComponent(location as string)}&dates=${startDateTime}/${endDateTime}&ctz=Australia/Sydney`

    // Send email to admin for review if Resend is configured
    if (resend) {
      try {
        console.log("Sending admin notification email")
        await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL || "your-email@example.com",
          subject: `New Event Submission: ${eventName}`,
          html: `
            <h2>New Event Submission</h2>
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                <h3 style="color: #333; margin-bottom: 15px;">Event Details</h3>
                <p><strong>Event Name:</strong> ${eventName}</p>
                <p><strong>Date:</strong> ${eventDate}</p>
                <p><strong>Time:</strong> ${eventTime}</p>
                <p><strong>Location:</strong> ${location}</p>
                <p><strong>City:</strong> ${city}</p>
                <p><strong>Description:</strong> ${description}</p>
                <p><strong>Organizer Name:</strong> ${organizerName}</p>
                <p><strong>Organizer Email:</strong> ${organizerEmail}</p>
                ${ticketLink ? `<p><strong>Ticket Link:</strong> <a href="${ticketLink}">${ticketLink}</a></p>` : ""}
              </div>

              ${imageUrl ? `
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
                  <h3 style="color: #333; margin-bottom: 15px;">Event Image</h3>
                  <img src="${imageUrl}" alt="Event Image" style="max-width: 100%; height: auto; border-radius: 4px;">
                  <p style="margin-top: 10px;"><a href="${imageUrl}" style="color: #007bff; text-decoration: none;">View Full Image</a></p>
                </div>
              ` : ""}

              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px;">
                <h3 style="color: #333; margin-bottom: 15px;">Actions</h3>
                <p>Please review this event and add it to the appropriate calendar if approved.</p>
                <div style="margin-top: 20px;">
                  <a href="${calendarUrl}" 
                     style="background-color: #4CAF50; 
                            color: white; 
                            padding: 12px 24px; 
                            text-decoration: none; 
                            border-radius: 5px; 
                            display: inline-block;
                            font-weight: bold;">
                    Add to ${city} Calendar
                  </a>
                </div>
              </div>
            </div>
          `,
        })

        console.log("Sending confirmation email to organizer")
        // Send confirmation email to the organizer
        await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: organizerEmail as string,
          subject: "Your Event Submission Received",
          html: `
            <div style="max-width: 600px; margin: 0 auto; font-family: Arial, sans-serif;">
              <h2 style="color: #333;">Thank You for Submitting Your Event!</h2>
              <p>Dear ${organizerName},</p>
              <p>We have received your event submission for "${eventName}". Our team will review it and add it to the calendar if approved.</p>
              <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="color: #333; margin-bottom: 15px;">Your Submission Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><strong>Event Name:</strong> ${eventName}</li>
                  <li style="margin-bottom: 10px;"><strong>Date:</strong> ${eventDate}</li>
                  <li style="margin-bottom: 10px;"><strong>Time:</strong> ${eventTime}</li>
                  <li style="margin-bottom: 10px;"><strong>Location:</strong> ${location}</li>
                  <li style="margin-bottom: 10px;"><strong>City:</strong> ${city}</li>
                </ul>
              </div>
              <p>We typically process submissions within 24-48 hours. If you have any questions, please don't hesitate to contact us.</p>
              <br>
              <p style="color: #666;">Best regards,<br>The Bachata Hub Team</p>
            </div>
          `,
        })
      } catch (emailError) {
        console.error("Error sending emails:", emailError)
        // Continue even if email sending fails
      }
    } else {
      console.error("Resend is not configured. Emails will not be sent.")
    }

    console.log("Event submission successful")
    return NextResponse.json({ 
      success: true,
      message: "Event submitted successfully",
      imageUrl: imageUrl || null
    })
  } catch (error) {
    console.error("Error submitting event:", error)
    // Log more details about the error
    if (error instanceof Error) {
      console.error("Error name:", error.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
    }
    // Log the request data that caused the error
    try {
      const formData = await request.formData()
      console.error("Request data:", Object.fromEntries(formData))
    } catch (e) {
      console.error("Error reading form data:", e)
    }
    return NextResponse.json(
      { 
        error: "Failed to submit event",
        details: error instanceof Error ? error.message : "Unknown error",
        stack: error instanceof Error ? error.stack : undefined
      },
      { status: 500 },
    )
  }
} 