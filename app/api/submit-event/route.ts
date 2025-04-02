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
    const richDescription = `${description as string}${imageUrl ? `\n\nEvent Image:\n${imageUrl}` : ""}`
    
    // Create the Google Calendar URL with proper date formatting and image
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName.toString())}&details=${encodeURIComponent(description.toString())}&location=${encodeURIComponent(location.toString())}&dates=${startDateTime}/${endDateTime}${imageUrl ? `&image=${encodeURIComponent(imageUrl)}` : ""}`

    // Send email to admin for review if Resend is configured
    if (resend) {
      try {
        console.log("Sending admin notification email")
        const adminEmail = process.env.ADMIN_EMAIL || "your-email@example.com"
        console.log("Sending to admin email:", adminEmail)

        // Create a rich HTML email with better formatting
        const emailHtml = `
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
                <p style="margin-top: 10px;"><a href="${imageUrl}" target="_blank">View full image</a></p>
              </div>
            ` : ''}
            <div style="margin: 20px 0;">
              <h3 style="color: #444;">Quick Actions</h3>
              <p style="margin-bottom: 15px;">
                <a href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(String(eventName))}&details=${encodeURIComponent(String(description))}&location=${encodeURIComponent(String(location))}&dates=${encodeURIComponent(String(eventDate))}T${encodeURIComponent(String(eventTime))}/${encodeURIComponent(String(eventDate))}T${encodeURIComponent(String(eventTime))}" 
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
        `

        // Prepare email attachments
        let attachments = []
        if (image instanceof File) {
          try {
            const bytes = await image.arrayBuffer()
            const buffer = Buffer.from(bytes)
            attachments.push({
              filename: image.name || "event-image.jpg",
              content: buffer,
              contentType: image.type || "image/jpeg"
            })
          } catch (error) {
            console.error("Error preparing image attachment:", error)
          }
        }

        // Send email to admin
        const adminEmailResult = await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: adminEmail,
          subject: `New Event Submission: ${eventName}`,
          html: emailHtml,
          attachments: attachments.length > 0 ? attachments : undefined
        })

        console.log("Admin email sent successfully:", adminEmailResult)

        // Send confirmation email to the organizer
        const organizerEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Thank You for Submitting Your Event!</h2>
            <p>Dear ${organizerName},</p>
            <p>We have received your event submission for "${eventName}". Our team will review it and add it to the calendar if approved.</p>
            <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
              <h3 style="color: #444; margin-top: 0;">Your Event Details</h3>
              <ul style="list-style: none; padding: 0;">
                <li style="margin-bottom: 10px;"><strong>Event Name:</strong> ${eventName}</li>
                <li style="margin-bottom: 10px;"><strong>Date:</strong> ${eventDate}</li>
                <li style="margin-bottom: 10px;"><strong>Time:</strong> ${eventTime}</li>
                <li style="margin-bottom: 10px;"><strong>Location:</strong> ${location}</li>
                <li style="margin-bottom: 10px;"><strong>City:</strong> ${city}</li>
              </ul>
              ${imageUrl ? `
                <div style="margin-top: 20px;">
                  <h4 style="color: #444;">Your Event Image</h4>
                  <div style="text-align: center; margin: 20px 0;">
                    <img src="${imageUrl}" alt="Event Image" style="max-width: 100%; height: auto; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                  </div>
                  <p style="text-align: center;"><a href="${imageUrl}" style="color: #0066cc; text-decoration: none;">Click here to view full image</a></p>
                </div>
              ` : ""}
            </div>
            <p>We typically process submissions within 24-48 hours. If you have any questions, please don't hesitate to contact us.</p>
            <br>
            <p style="color: #666;">Best regards,<br>The Bachata Hub Team</p>
          </div>
        `

        const organizerEmailResult = await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: organizerEmail as string,
          subject: "Your Event Submission Received",
          html: organizerEmailHtml,
          attachments: attachments.length > 0 ? attachments : undefined
        })

        console.log("Organizer email sent successfully:", organizerEmailResult)
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
    console.error("Error processing event submission:", error)
    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to submit event", 
        error: error instanceof Error ? error.message : "Unknown error",
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    )
  }
} 