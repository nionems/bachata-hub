import { Resend } from "resend"
import { NextResponse } from "next/server"
import { v2 as cloudinary } from "cloudinary"

const resend = new Resend(process.env.RESEND_API_KEY)

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

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
    const formData = await request.formData()
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
    } = Object.fromEntries(formData)

    let imageUrl = null
    if (image instanceof File) {
      // Convert File to Buffer
      const bytes = await image.arrayBuffer()
      const buffer = Buffer.from(bytes)

      // Upload to Cloudinary
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              resource_type: "auto",
              folder: "bachata-events",
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          )
          .end(buffer)
      })

      imageUrl = (result as any).secure_url
    }

    // Get the appropriate calendar ID based on the city
    const cityKey = (city as string).toLowerCase()
    const calendarId = calendarIds[cityKey as keyof typeof calendarIds] || calendarIds.sydney
    
    // Create a rich description that includes the image
    const richDescription = `${description as string}${imageUrl ? `\n\nEvent Image:\n${imageUrl}` : ""}`
    
    const calendarUrl = `https://calendar.google.com/calendar/event?action=TEMPLATE&text=${encodeURIComponent(eventName as string)}&details=${encodeURIComponent(richDescription)}&location=${encodeURIComponent(location as string)}&dates=${eventDate}T${eventTime}/${eventDate}T${eventTime}&ctz=Australia/Sydney`

    // Send email to admin for review
    await resend.emails.send({
      from: "Bachata Hub <onboarding@resend.dev>",
      to: process.env.ADMIN_EMAIL || "your-email@example.com",
      subject: `New Event Submission: ${eventName}`,
      html: `
        <h2>New Event Submission</h2>
        <p><strong>Event Name:</strong> ${eventName}</p>
        <p><strong>Date:</strong> ${eventDate}</p>
        <p><strong>Time:</strong> ${eventTime}</p>
        <p><strong>Location:</strong> ${location}</p>
        <p><strong>City:</strong> ${city}</p>
        <p><strong>Description:</strong> ${description}</p>
        <p><strong>Organizer Name:</strong> ${organizerName}</p>
        <p><strong>Organizer Email:</strong> ${organizerEmail}</p>
        ${ticketLink ? `<p><strong>Ticket Link:</strong> ${ticketLink}</p>` : ""}
        ${imageUrl ? `<p><strong>Event Image:</strong> <a href="${imageUrl}">View Image</a></p>` : ""}
        <br>
        <p>Please review this event and add it to the appropriate calendar if approved.</p>
        <div style="margin-top: 20px;">
          <a href="${calendarUrl}" 
             style="background-color: #4CAF50; 
                    color: white; 
                    padding: 10px 20px; 
                    text-decoration: none; 
                    border-radius: 5px; 
                    display: inline-block;">
            Add to ${city} Calendar
          </a>
        </div>
      `,
    })

    // Send confirmation email to the organizer
    await resend.emails.send({
      from: "Bachata Hub <onboarding@resend.dev>",
      to: organizerEmail as string,
      subject: "Your Event Submission Received",
      html: `
        <h2>Thank You for Submitting Your Event!</h2>
        <p>Dear ${organizerName},</p>
        <p>We have received your event submission for "${eventName}". Our team will review it and add it to the calendar if approved.</p>
        <p>Here's a summary of your submission:</p>
        <ul>
          <li><strong>Event Name:</strong> ${eventName}</li>
          <li><strong>Date:</strong> ${eventDate}</li>
          <li><strong>Time:</strong> ${eventTime}</li>
          <li><strong>Location:</strong> ${location}</li>
          <li><strong>City:</strong> ${city}</li>
        </ul>
        <p>We typically process submissions within 24-48 hours. If you have any questions, please don't hesitate to contact us.</p>
        <br>
        <p>Best regards,<br>The Bachata Hub Team</p>
      `,
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting event:", error)
    return NextResponse.json(
      { error: "Failed to submit event" },
      { status: 500 },
    )
  }
} 