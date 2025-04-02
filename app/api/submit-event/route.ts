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
    // Log request headers and method
    console.log("Request details:", {
      method: request.method,
      headers: Object.fromEntries(request.headers.entries()),
      url: request.url
    })

    // Log the incoming request
    console.log("Received event submission request")
    
    const formData = await request.formData()
    const formDataObj = Object.fromEntries(formData)
    
    // Log form data with more details
    console.log("Form data received:", {
      ...formDataObj,
      image: formDataObj.image ? {
        type: (formDataObj.image as File).type,
        size: (formDataObj.image as File).size,
        name: (formDataObj.image as File).name
      } : "No file",
      hasImage: formDataObj.image instanceof File
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

    // Log parsed form data with types
    console.log("Parsed form data:", {
      eventName: { value: eventName, type: typeof eventName },
      eventDate: { value: eventDate, type: typeof eventDate },
      eventTime: { value: eventTime, type: typeof eventTime },
      location: { value: location, type: typeof location },
      city: { value: city, type: typeof city },
      description: { value: description, type: typeof description },
      organizerName: { value: organizerName, type: typeof organizerName },
      organizerEmail: { value: organizerEmail, type: typeof organizerEmail },
      ticketLink: { value: ticketLink, type: typeof ticketLink },
      image: image instanceof File ? {
        type: image.type,
        size: image.size,
        name: image.name
      } : "No image"
    })

    // Validate required fields with detailed logging
    const validationResults = {
      eventName: { required: true, present: !!eventName, value: eventName },
      eventDate: { required: true, present: !!eventDate, value: eventDate },
      eventTime: { required: true, present: !!eventTime, value: eventTime },
      location: { required: true, present: !!location, value: location },
      city: { required: true, present: !!city, value: city },
      description: { required: true, present: !!description, value: description },
      organizerName: { required: true, present: !!organizerName, value: organizerName },
      organizerEmail: { required: true, present: !!organizerEmail, value: organizerEmail }
    }

    console.log("Field validation results:", validationResults)

    const missingFields = Object.entries(validationResults)
      .filter(([_, field]) => field.required && !field.present)
      .map(([field]) => field)

    if (missingFields.length > 0) {
      console.error("Missing required fields:", missingFields)
      return NextResponse.json(
        { 
          success: false,
          message: "Missing required fields",
          error: "Missing required fields",
          details: validationResults
        },
        { status: 400 }
      )
    }

    // Format date and time for Google Calendar with detailed logging
    const formattedDate = eventDate as string
    const formattedTime = eventTime as string
    
    console.log("Date/time processing:", {
      input: {
        date: formattedDate,
        time: formattedTime
      },
      parsed: {
        date: new Date(formattedDate),
        time: new Date(`1970-01-01T${formattedTime}`)
      }
    })
    
    // Create a date object in the local timezone
    const eventDateTime = new Date(`${formattedDate}T${formattedTime}`)
    
    // Ensure the date is valid with detailed logging
    if (isNaN(eventDateTime.getTime())) {
      console.error("Invalid date:", {
        input: {
          date: formattedDate,
          time: formattedTime
        },
        parsed: eventDateTime,
        timestamp: eventDateTime.getTime()
      })
      return NextResponse.json(
        { 
          success: false,
          message: "Invalid date or time format",
          error: "Invalid date or time format",
          details: {
            date: formattedDate,
            time: formattedTime,
            parsed: eventDateTime.toISOString()
          }
        },
        { status: 400 }
      )
    }

    // Format the date and time for the Google Calendar URL with detailed logging
    const startDateTime = eventDateTime.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    const endDateTime = new Date(eventDateTime.getTime() + 2 * 60 * 60 * 1000).toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z'
    
    console.log("Calendar date formatting:", {
      input: {
        date: formattedDate,
        time: formattedTime,
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
      },
      processed: {
        eventDateTime: eventDateTime.toISOString(),
        startDateTime,
        endDateTime
      }
    })

    let imageUrl = null
    if (image instanceof File) {
      try {
        console.log("Starting image upload process:", {
          file: {
            type: image.type,
            size: image.size,
            name: image.name
          }
        })

        // Convert File to Buffer
        const bytes = await image.arrayBuffer()
        const buffer = Buffer.from(bytes)
        console.log("Image buffer created:", {
          size: buffer.length,
          type: image.type
        })

        // Upload to Cloudinary with timeout and detailed logging
        const result = await new Promise((resolve, reject) => {
          if (!cloudName || !apiKey || !apiSecret) {
            const error = new Error("Cloudinary configuration is incomplete")
            console.error("Cloudinary configuration error:", {
              cloudName: !!cloudName,
              apiKey: !!apiKey,
              apiSecret: !!apiSecret,
              error: error.message
            })
            reject(error)
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
                console.error("Cloudinary upload error:", {
                  error: error.message,
                  code: error.code,
                  http_code: error.http_code
                })
                resolve(null)
              } else {
                console.log("Image uploaded successfully:", {
                  public_id: result?.public_id,
                  secure_url: result?.secure_url,
                  format: result?.format,
                  resource_type: result?.resource_type
                })
                resolve(result)
              }
            }
          )

          uploadStream.end(buffer)
          console.log("Upload stream started")
        })

        if (result) {
          imageUrl = (result as any).secure_url
          console.log("Image URL generated:", imageUrl)
        } else {
          console.log("No image URL available due to upload failure")
        }
      } catch (uploadError) {
        console.error("Error uploading image:", {
          error: uploadError instanceof Error ? uploadError.message : "Unknown error",
          stack: uploadError instanceof Error ? uploadError.stack : undefined
        })
      }
    }

    // Get the appropriate calendar ID based on the city with logging
    const cityKey = (city as string).toLowerCase()
    const calendarId = calendarIds[cityKey as keyof typeof calendarIds] || calendarIds.sydney
    
    console.log("Calendar ID selection:", {
      input: cityKey,
      selected: calendarId,
      available: Object.keys(calendarIds)
    })

    // Create Google Calendar URL with logging
    const calendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventName as string)}&details=${encodeURIComponent(description as string)}&location=${encodeURIComponent(location as string)}&dates=${startDateTime}/${endDateTime}${imageUrl ? `&image=${encodeURIComponent(imageUrl)}` : ''}`
    
    console.log("Calendar URL generated:", {
      url: calendarUrl,
      hasImage: !!imageUrl
    })

    // Send email notifications with detailed logging
    try {
      console.log("Starting email notification process")
      console.log("Admin email configuration:", {
        to: process.env.ADMIN_EMAIL,
        resendConfigured: !!resend
      })
      
      if (resend) {
        const adminResult = await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: process.env.ADMIN_EMAIL as string,
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
            ${ticketLink ? `<p><strong>Ticket Link:</strong> ${ticketLink}</p>` : ''}
            ${imageUrl ? `<p><strong>Event Image:</strong> <a href="${imageUrl}">View Image</a></p>` : ''}
            <p><strong>Calendar Link:</strong> <a href="${calendarUrl}">Add to Calendar</a></p>
          `
        })
        console.log("Admin email sent successfully:", {
          status: "success",
          response: adminResult
        })
      }

      // Send confirmation email to the organizer with logging
      console.log("Sending organizer confirmation email:", {
        to: organizerEmail,
        resendConfigured: !!resend
      })

      if (resend) {
        const organizerResult = await resend.emails.send({
          from: "Bachata Hub <onboarding@resend.dev>",
          to: organizerEmail as string,
          subject: `Your Event Submission: ${eventName}`,
          html: `
            <h2>Event Submission Confirmation</h2>
            <p>Thank you for submitting your event to Bachata Hub!</p>
            <p>Here are the details of your submission:</p>
            <p><strong>Event Name:</strong> ${eventName}</p>
            <p><strong>Date:</strong> ${eventDate}</p>
            <p><strong>Time:</strong> ${eventTime}</p>
            <p><strong>Location:</strong> ${location}</p>
            <p><strong>City:</strong> ${city}</p>
            <p><strong>Description:</strong> ${description}</p>
            ${ticketLink ? `<p><strong>Ticket Link:</strong> ${ticketLink}</p>` : ''}
            ${imageUrl ? `<p><strong>Event Image:</strong> <a href="${imageUrl}">View Image</a></p>` : ''}
            <p><strong>Calendar Link:</strong> <a href="${calendarUrl}">Add to Calendar</a></p>
            <p>We will review your submission and get back to you soon.</p>
          `
        })
        console.log("Organizer email sent successfully:", {
          status: "success",
          response: organizerResult
        })
      }

      // Return success response with detailed data
      const successResponse = {
        success: true,
        message: "Event submitted successfully",
        data: {
          eventName,
          eventDate,
          eventTime,
          location,
          city,
          description,
          organizerName,
          organizerEmail,
          ticketLink,
          imageUrl,
          calendarUrl
        }
      }
      
      console.log("Sending success response:", successResponse)
      return NextResponse.json(successResponse)
    } catch (emailError) {
      console.error("Error sending emails:", {
        error: emailError instanceof Error ? emailError.message : "Unknown error",
        stack: emailError instanceof Error ? emailError.stack : undefined
      })
      
      // Still return success if emails fail
      const response = {
        success: true,
        message: "Event submitted successfully, but there was an error sending emails",
        data: {
          eventName,
          eventDate,
          eventTime,
          location,
          city,
          description,
          organizerName,
          organizerEmail,
          ticketLink,
          imageUrl,
          calendarUrl
        },
        emailError: emailError instanceof Error ? emailError.message : "Unknown email error"
      }
      
      console.log("Sending success response with email error:", response)
      return NextResponse.json(response)
    }
  } catch (error) {
    console.error("Error processing event submission:", {
      error: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined
    })
    
    return NextResponse.json({
      success: false,
      message: "Failed to submit event",
      error: error instanceof Error ? error.message : "Unknown error",
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 