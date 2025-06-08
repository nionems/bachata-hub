import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// Check if Resend API key is properly configured
if (!process.env.RESEND_API_KEY) {
  console.error('Resend API key is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const type = formData.get('type') as string

    // Convert FormData to a plain object
    const data: Record<string, string> = {}
    formData.forEach((value, key) => {
      if (key !== 'type') {
        data[key] = value.toString()
      }
    })

    // Format the email content based on the submission type
    let emailContent = ''
    let subject = ''

    switch (type) {
      case 'accommodation':
        subject = 'New Accommodation Submission'
        emailContent = `
          <h2>New Accommodation Submission</h2>
          <div style="background-color: #f5f5f5; padding: 20px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Location:</strong> ${data.location}</p>
            <p><strong>State:</strong> ${data.state}</p>
            <p><strong>Address:</strong> ${data.address}</p>
            <p><strong>Contact Info:</strong> ${data.contactInfo}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Phone:</strong> ${data.phone}</p>
            <p><strong>Website:</strong> ${data.website || 'Not provided'}</p>
            <p><strong>Price:</strong> ${data.price}</p>
            <p><strong>Rooms:</strong> ${data.rooms}</p>
            <p><strong>Capacity:</strong> ${data.capacity}</p>
            <p><strong>Image URL:</strong> ${data.imageUrl || 'Not provided'}</p>
            <p><strong>Description:</strong> ${data.comment || 'Not provided'}</p>
            <p><strong>Google Map Link:</strong> ${data.googleMapLink || 'Not provided'}</p>
          </div>
        `
        break

      default:
        return NextResponse.json(
          { error: 'Invalid submission type' },
          { status: 400 }
        )
    }

    // Send email using Resend
    const { data: emailData, error } = await resend.emails.send({
      from: 'Bachata Hub <onboarding@resend.dev>',
      to: 'bachata.au@gmail.com',
      subject: subject,
      html: emailContent,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', emailData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in submit-listing:', error)
    return NextResponse.json(
      { error: 'Failed to submit listing', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 