import { NextResponse } from 'next/server'
import { Resend } from 'resend'

// Check if Resend API key is properly configured
if (!process.env.RESEND_API_KEY) {
  console.error('Resend API key is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { type, data } = await request.json()

    let subject = ''
    let html = ''

    switch (type) {
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
          <p><strong>Dance Styles:</strong> ${data.danceStyles}</p>
          <p><strong>Description:</strong> ${data.description}</p>
          <p><strong>Image URL:</strong> ${data.imageUrl}</p>
        `
        break
      case 'shop_submission':
        subject = 'New Shop Submission'
        html = `
          <h2>New Shop Submission</h2>
          <p><strong>Shop Name:</strong> ${data.name}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>State:</strong> ${data.state}</p>
          <p><strong>Address:</strong> ${data.address}</p>
          <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
          <p><strong>Instagram:</strong> ${data.instagramLink || 'N/A'}</p>
          <p><strong>Facebook:</strong> ${data.facebookLink || 'N/A'}</p>
          <p><strong>Google Maps:</strong> ${data.googleMapLink || 'N/A'}</p>
          <p><strong>Contact Name:</strong> ${data.contactName}</p>
          <p><strong>Contact Email:</strong> ${data.contactEmail}</p>
          <p><strong>Contact Phone:</strong> ${data.contactPhone || 'N/A'}</p>
          <p><strong>Additional Comments:</strong> ${data.comment || 'N/A'}</p>
          <p><strong>Additional Information:</strong> ${data.additionalInfo || 'N/A'}</p>
          <p><strong>Image URL:</strong> ${data.imageUrl}</p>
        `
        break
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
        break
      case 'instructor_submission':
        subject = 'New Instructor Submission'
        html = `
          <h2>New Instructor Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Location:</strong> ${data.location}</p>
          <p><strong>State:</strong> ${data.state}</p>
          <p><strong>Bio:</strong> ${data.bio}</p>
          <p><strong>Website:</strong> ${data.website || 'N/A'}</p>
          <p><strong>Social URL:</strong> ${data.socialUrl || 'N/A'}</p>
          <p><strong>Contact Info:</strong> ${data.contactInfo}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Dance Styles:</strong> ${data.danceStyles}</p>
          <p><strong>Experience:</strong> ${data.experience}</p>
          <p><strong>Image URL:</strong> ${data.imageUrl}</p>
        `
        break
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
        break
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
          <p><strong>Media Link 1:</strong> ${data.mediaLink || 'N/A'}</p>
          <p><strong>Media Link 2:</strong> ${data.mediaLink2 || 'N/A'}</p>
          <p><strong>Image URL:</strong> ${data.imageUrl}</p>
        `
        break
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
          <p><strong>Price:</strong> ${data.price}</p>
          <p><strong>Ticket Link:</strong> ${data.ticketLink || 'N/A'}</p>
          <p><strong>Dance Styles:</strong> ${data.danceStyles}</p>
          <p><strong>Categories:</strong> ${data.categories.join(', ')}</p>
          <p><strong>Levels:</strong> ${data.level.join(', ')}</p>
          <p><strong>Social Link:</strong> ${data.socialLink || 'N/A'}</p>
          <p><strong>Google Map Link:</strong> ${data.googleMapLink || 'N/A'}</p>
          <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
          <p><strong>Image URL:</strong> ${data.imageUrl}</p>
        `
        break
      case 'contact_form':
        subject = 'New Contact Form Submission'
        html = `
          <h2>New Contact Form Submission</h2>
          <p><strong>Name:</strong> ${data.name}</p>
          <p><strong>Email:</strong> ${data.email}</p>
          <p><strong>Message:</strong></p>
          <p>${data.message}</p>
        `
        break
      default:
        return NextResponse.json(
          { error: 'Invalid email type' },
          { status: 400 }
        )
    }

    console.log('Sending email with Resend...')
    console.log('API Key exists:', !!process.env.RESEND_API_KEY)

    const { data: emailData, error } = await resend.emails.send({
      from: 'Bachata Hub <onboarding@resend.dev>',
      to: 'bachata.au@gmail.com',
      subject,
      html
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { 
          error: 'Failed to send email',
          details: error.message
        },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', emailData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { 
        error: 'Failed to send email',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 