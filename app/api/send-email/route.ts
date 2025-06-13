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
          <p><strong>Email:</strong> ${data.email}</p>
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
          <p><strong>Comment:</strong> ${data.comment || 'N/A'}</p>
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
    }

    const email = {
      from: 'no-reply@example.com',
      to: 'recipient@example.com',
      subject: subject,
      html: html
    }

    await resend.sendEmail(email)

    return NextResponse.json({ message: 'Email sent successfully' })
  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json({ message: 'Error sending email' }, { status: 500 })
  }
}