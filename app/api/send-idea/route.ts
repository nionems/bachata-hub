import { Resend } from 'resend'
import { NextResponse } from 'next/server'

// Check if Resend API key is properly configured
if (!process.env.RESEND_API_KEY) {
  console.error('Resend API key is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    const { name, email, idea } = await request.json()

    if (!name || !email || !idea) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      )
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Bachata Hub <onboarding@resend.dev>',
      to: 'bachata.au@gmail.com',
      replyTo: 'bachata.au@gmail.com',
      subject: 'New Idea Submission from Bachata Hub',
      html: `
        <h2>New Idea Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Idea:</strong></p>
        <p>${idea}</p>
      `,
    })

    if (error) {
      console.error('Resend error:', error)
      return NextResponse.json(
        { error: 'Failed to send email', details: error.message },
        { status: 500 }
      )
    }

    console.log('Email sent successfully:', data)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error sending idea:', error)
    return NextResponse.json(
      { error: 'Failed to submit idea', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 