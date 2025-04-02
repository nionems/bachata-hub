import { Resend } from "resend"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { google } from "googleapis"
import { z } from "zod"
import fs from "fs"
import path from "path"
import { v4 as uuidv4 } from "uuid"

// Log all environment variables (without sensitive values)
console.log("Environment variables status:", {
  RESEND_API_KEY: process.env.RESEND_API_KEY ? "Set" : "Missing",
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME ? "Set" : "Missing",
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY ? "Set" : "Missing",
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET ? "Set" : "Missing",
  ADMIN_EMAIL: process.env.ADMIN_EMAIL ? "Set" : "Missing"
})

// Initialize Resend with the new API key
const resend = new Resend("re_CTYDDUiU_Q5YKZME4bYE5XYHcNbKjimX6")

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(process.cwd(), "public", "uploads")
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true })
}

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
    
    // Extract and validate form data
    const eventName = formData.get("eventName")?.toString() || ""
    const eventDate = formData.get("eventDate")?.toString() || ""
    const eventTime = formData.get("eventTime")?.toString() || ""
    const location = formData.get("location")?.toString() || ""
    const description = formData.get("description")?.toString() || ""
    const organizerName = formData.get("organizerName")?.toString() || ""
    const organizerEmail = formData.get("organizerEmail")?.toString() || ""
    const ticketLink = formData.get("ticketLink")?.toString() || ""
    const city = formData.get("city")?.toString() || ""
    const imageFile = formData.get("image") as File | null

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
      hasImage: !!imageFile
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

    // Handle image upload
    let imageUrl = null
    if (imageFile) {
      try {
        console.log("Processing image upload")
        const buffer = Buffer.from(await imageFile.arrayBuffer())
        console.log("Image buffer created, size:", buffer.length)

        // Generate unique filename
        const fileExtension = imageFile.name.split(".").pop() || "jpg"
        const fileName = `${uuidv4()}.${fileExtension}`
        const filePath = path.join(uploadsDir, fileName)

        // Save file to public/uploads directory
        fs.writeFileSync(filePath, buffer)
        console.log("Image saved successfully:", filePath)

        // Create URL for the saved image
        imageUrl = `/uploads/${fileName}`
        console.log("Image URL created:", imageUrl)
      } catch (error) {
        console.error("Error saving image:", error)
        // Continue without image
      }
    }

    // Get the appropriate calendar ID based on the city
    const cityKey = (city as string).toLowerCase()
    const calendarId = calendarIds[cityKey as keyof typeof calendarIds] || calendarIds.sydney
    
    // Create a rich description that includes the image
    const richDescription = `${description as string}${imageUrl ? `\n\nEvent Image:\n${imageUrl}` : ""}`
    
    // Create the Google Calendar URL with proper date formatting and image
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName.toString())}&details=${encodeURIComponent(richDescription)}&location=${encodeURIComponent(location.toString())}&dates=${startDateTime}/${endDateTime}${imageUrl ? `&image=${encodeURIComponent(imageUrl)}` : ""}`

    // Send email to admin for review if Resend is configured
    if (resend) {
      try {
        console.log("Sending admin notification email")
        // Send email to admin
        const adminEmailResult = await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: "bachata.au@gmail.com",
          subject: `New Event Submission: ${eventName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">New Event Submission</h2>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #444; margin-top: 0;">Event Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><strong>Event Name:</strong> ${eventName}</li>
                  <li style="margin-bottom: 10px;"><strong>Date:</strong> ${eventDate}</li>
                  <li style="margin-bottom: 10px;"><strong>Time:</strong> ${eventTime}</li>
                  <li style="margin-bottom: 10px;"><strong>Location:</strong> ${location}</li>
                  <li style="margin-bottom: 10px;"><strong>City:</strong> ${city}</li>
                  <li style="margin-bottom: 10px;"><strong>Organizer:</strong> ${organizerName}</li>
                  <li style="margin-bottom: 10px;"><strong>Email:</strong> ${organizerEmail}</li>
                  <li style="margin-bottom: 10px;"><strong>Description:</strong> ${description}</li>
                </ul>
              </div>
              ${imageUrl ? `
                <div style="margin: 20px 0;">
                  <h3 style="color: #444;">Event Image</h3>
                  <img src="${imageUrl}" alt="Event image" style="max-width: 100%; border-radius: 5px;">
                  <p style="margin-top: 10px;">
                    <a href="${imageUrl}" target="_blank" style="color: #2196F3; text-decoration: none;">View full image</a>
                  </p>
                </div>
              ` : ''}
              <div style="margin: 20px 0;">
                <h3 style="color: #444;">Quick Actions</h3>
                <p style="margin-bottom: 15px;">
                  <a href="${calendarUrl}" 
                     style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Add to Google Calendar
                  </a>
                </p>
                <p>
                  <a href="mailto:${organizerEmail}?subject=Re: ${eventName} - Event Submission&body=Hi ${organizerName},%0A%0AThank you for submitting your event "%0A%0AEvent Details:%0A- Name: ${eventName}%0A- Date: ${eventDate}%0A- Time: ${eventTime}%0A- Location: ${location}%0A- City: ${city}%0A%0A" 
                     style="background-color: #2196F3; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
                    Reply to Organizer
                  </a>
                </p>
              </div>
              <p style="color: #666; font-size: 0.9em;">This event was submitted through the Bachata Hub website.</p>
            </div>
          `,
        })
        console.log("Admin email sent successfully:", adminEmailResult)

        // Send confirmation email to the organizer
        const organizerEmailResult = await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: organizerEmail,
          subject: `Event Submission Received: ${eventName}`,
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #333;">Event Submission Received</h2>
              <p>Dear ${organizerName},</p>
              <p>Thank you for submitting your event to Bachata Hub. We have received your submission and will review it shortly.</p>
              <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
                <h3 style="color: #444; margin-top: 0;">Your Event Details</h3>
                <ul style="list-style: none; padding: 0;">
                  <li style="margin-bottom: 10px;"><strong>Event Name:</strong> ${eventName}</li>
                  <li style="margin-bottom: 10px;"><strong>Date:</strong> ${eventDate}</li>
                  <li style="margin-bottom: 10px;"><strong>Time:</strong> ${eventTime}</li>
                  <li style="margin-bottom: 10px;"><strong>Location:</strong> ${location}</li>
                  <li style="margin-bottom: 10px;"><strong>City:</strong> ${city}</li>
                  <li style="margin-bottom: 10px;"><strong>Description:</strong> ${description}</li>
                </ul>
              </div>
              ${imageUrl ? `
                <div style="margin: 20px 0;">
                  <h3 style="color: #444;">Event Image</h3>
                  <img src="${imageUrl}" alt="Event image" style="max-width: 100%; border-radius: 5px;">
                  <p style="margin-top: 10px;">
                    <a href="${imageUrl}" target="_blank" style="color: #2196F3; text-decoration: none;">View full image</a>
                  </p>
                </div>
              ` : ''}
              <p>We will review your submission and get back to you soon.</p>
              <p style="color: #666;">Best regards,<br>The Bachata Hub Team</p>
            </div>
          `,
        })
        console.log("Organizer email sent successfully:", organizerEmailResult)
      } catch (emailError) {
        console.error("Error sending emails:", emailError)
        // Log more details about the error
        if (emailError instanceof Error) {
          console.error("Email error details:", {
            message: emailError.message,
            stack: emailError.stack,
            name: emailError.name
          })
        }
      }
    } else {
      console.error("Resend is not configured. Emails will not be sent.")
    }

    return NextResponse.json(
      { message: "Event submission successful" },
      { status: 200 }
    )
  } catch (error) {
    console.error("Error processing event submission:", error)
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    )
  }
}