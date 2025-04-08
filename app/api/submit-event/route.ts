import { Resend } from "resend"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"
import { google } from "googleapis"
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
const resend = new Resend("re_CTYDDUiU_Q5YKZME4bYE5XYHcNbKjimX6")

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
    const endTime = formData.get("endTime")?.toString() || ""
    const location = formData.get("location")?.toString() || ""
    const state = formData.get("state")?.toString() || ""
    const city = formData.get("city")?.toString() || ""
    const description = formData.get("description")?.toString() || ""
    const organizerName = formData.get("organizerName")?.toString() || ""
    const organizerEmail = formData.get("organizerEmail")?.toString() || ""
    const ticketLink = formData.get("ticketLink")?.toString() || ""
    const eventLink = formData.get("eventLink")?.toString() || ""
    const imageFile = formData.get("image") as File | null

    // Log parsed form data
    console.log("Parsed form data:", {
      eventName,
      eventDate,
      eventTime,
      endTime,
      location,
      city,
      description,
      organizerName,
      organizerEmail,
      ticketLink,
      eventLink,
      hasImage: !!imageFile
    })

    // Validate required fields
    if (!eventName || !eventDate || !eventTime || !endTime || !location || !city || !description || !organizerName || !organizerEmail) {
      console.error("Missing required fields:", {
        eventName: !!eventName,
        eventDate: !!eventDate,
        eventTime: !!eventTime,
        endTime: !!endTime,
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

    // Create start and end date objects
    const startDateTime = new Date(`${formattedDate}T${formattedTime}`)
    const endDateTime = new Date(`${formattedDate}T${endTime}`)
    
    // Format for Google Calendar URL
    const startDateTimeStr = startDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDateTimeStr = endDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    console.log("Formatted date/time:", {
      originalDate: formattedDate,
      originalTime: formattedTime,
      parsedDateTime: eventDateTime.toISOString(),
      startDateTime,
      endDateTime,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    })

    let imageUrl = null
    if (imageFile) {
      try {
        console.log("Processing image upload")
        // Convert File to Buffer
        const bytes = await imageFile.arrayBuffer()
        const buffer = Buffer.from(bytes)
        console.log("Image buffer created, size:", buffer.length)

        // Upload to Cloudinary with timeout
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
              timeout: 30000, // 30 second timeout
            },
            (error, result) => {
              if (error) {
                console.error("Cloudinary upload error:", error)
                // Don't reject, just log the error and continue without the image
                console.log("Continuing without image upload")
                resolve(null)
              } else {
                console.log("Image uploaded successfully:", result)
                resolve(result)
              }
            }
          )

          uploadStream.end(buffer)
          console.log("Upload stream started")
        })

        if (result) {
          imageUrl = (result as any).secure_url
          console.log("Image URL:", imageUrl)
        } else {
          console.log("No image URL available due to upload failure")
        }
      } catch (uploadError) {
        console.error("Error uploading image:", uploadError)
        // Continue without the image if upload fails
        console.log("Continuing without image due to upload error")
      }
    }

    // Get the appropriate calendar ID based on the city
    const cityKey = (city as string).toLowerCase()
    const calendarId = calendarIds[cityKey as keyof typeof calendarIds] || calendarIds.sydney
    
    // Create a rich description that includes the image
    const richDescription = `${description}

[image:${imageUrl}]

Organizer: ${organizerName}
Contact: ${organizerEmail}
${eventLink ? `Event Link: ${eventLink}` : ''}
${ticketLink ? `Tickets: ${ticketLink}` : ''}`

    // Create the Google Calendar URL with proper date formatting and image
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName)}&details=${encodeURIComponent(richDescription)}&location=${encodeURIComponent(location)}&dates=${startDateTimeStr}/${endDateTimeStr}&src=${encodeURIComponent(calendarId)}`

    // Create email transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
      },
    })

    // Prepare email attachments if there's an image
    let attachments = []
    if (imageFile) {
      const buffer = Buffer.from(await imageFile.arrayBuffer())
      attachments.push({
        filename: imageFile.name,
        content: buffer,
      })
    }

    // Update the admin email HTML content
    const adminEmailHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">New Event Submission</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Event Name:</strong> ${eventName}</p>
          <p><strong>Date:</strong> ${eventDate}</p>
          <p><strong>Time:</strong> ${eventTime} - ${endTime}</p>
          <p><strong>Location:</strong> ${location}</p>
          <p><strong>State:</strong> ${state}</p>
          <p><strong>City:</strong> ${city}</p>
          <p><strong>Description:</strong> ${description}</p>
          <p><strong>Organizer:</strong> ${organizerName}</p>
          <p><strong>Organizer Email:</strong> ${organizerEmail}</p>
          ${eventLink ? `<p><strong>Event Link:</strong> ${eventLink}</p>` : ''}
          ${ticketLink ? `<p><strong>Ticket Link:</strong> ${ticketLink}</p>` : ''}
        </div>

        ${imageUrl ? `
          <div style="margin: 20px 0;">
            <h3 style="color: #444;">Event Image</h3>
            <img src="${imageUrl}" alt="Event image" style="max-width: 100%; border-radius: 5px;">
          </div>
        ` : ''}

        <div style="text-align: center; margin: 30px 0;">
          <a href="${calendarUrl}" 
             style="display: inline-block; background-color: #4CAF50; color: white; padding: 15px 30px; 
                    text-decoration: none; border-radius: 5px; font-weight: bold;">
            Add to Google Calendar
          </a>
        </div>

        <p style="color: #666; font-size: 0.9em;">
          This event will be added to the ${city} calendar (${calendarId}).
        </p>
      </div>
    `

    // Update the admin email sending code
    const adminEmailResult = await resend.emails.send({
      from: "Bachata Hub <onboarding@resend.dev>",
      to: "bachata.au@gmail.com",
      subject: `New Event Submission: ${eventName}`,
      html: adminEmailHtml,
      attachments: attachments,
    })

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
              <li style="margin-bottom: 10px;"><strong>Time:</strong> ${eventTime} - ${endTime}</li>
              <li style="margin-bottom: 10px;"><strong>Location:</strong> ${location}</li>
              <li style="margin-bottom: 10px;"><strong>City:</strong> ${city}</li>
              <li style="margin-bottom: 10px;"><strong>Description:</strong> ${description}</li>
              ${eventLink ? `<li style="margin-bottom: 10px;"><strong>Event Link:</strong> ${eventLink}</li>` : ''}
              ${ticketLink ? `<li style="margin-bottom: 10px;"><strong>Ticket Link:</strong> ${ticketLink}</li>` : ''}
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
      attachments: attachments,
    })
    console.log("Organizer email sent successfully:", organizerEmailResult)

    return NextResponse.json(
      { message: "Event submission successful", imageUrl: imageUrl },
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