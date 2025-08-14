import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract parameters from the URL
    const name = searchParams.get('name')
    const location = searchParams.get('location')
    const state = searchParams.get('state')
    const email = searchParams.get('email')

    if (!name || !location || !state || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Find the instructor in the database and update status to rejected
    const db = getDb()
    const instructorsRef = db.collection('instructors')
    const query = instructorsRef.where('name', '==', name)
      .where('location', '==', location)
      .where('state', '==', state)
      .where('emailLink', '==', email)
      .where('status', '==', 'pending')

    const snapshot = await query.get()

    if (snapshot.empty) {
      return NextResponse.json(
        { error: 'Instructor not found or already processed' },
        { status: 404 }
      )
    }

    // Update the first matching instructor
    const doc = snapshot.docs[0]
    await doc.ref.update({
      status: 'rejected',
      updatedAt: new Date().toISOString()
    })

    // Return success page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Instructor Rejected</title>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            body {
              font-family: Arial, sans-serif;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background-color: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .reject-icon {
              color: #EF4444;
              font-size: 48px;
              text-align: center;
              margin-bottom: 20px;
            }
            h1 {
              color: #EF4444;
              text-align: center;
              margin-bottom: 30px;
            }
            .details {
              background-color: #f9f9f9;
              padding: 20px;
              border-radius: 5px;
              margin: 20px 0;
            }
            .detail-row {
              display: flex;
              margin-bottom: 10px;
            }
            .detail-label {
              font-weight: bold;
              width: 150px;
              flex-shrink: 0;
            }
            .detail-value {
              flex: 1;
            }
            .back-button {
              display: inline-block;
              background-color: #EF4444;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .back-button:hover {
              background-color: #DC2626;
            }
            .contact-info {
              background-color: #FEF2F2;
              border: 1px solid #FECACA;
              padding: 15px;
              border-radius: 5px;
              margin: 20px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="reject-icon">❌</div>
            <h1>Instructor Rejected</h1>
            
            <div class="details">
              <h3>Instructor Details:</h3>
              <div class="detail-row">
                <span class="detail-label">Name:</span>
                <span class="detail-value">${name}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Location:</span>
                <span class="detail-value">${location}, ${state}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Email:</span>
                <span class="detail-value">${email}</span>
              </div>
            </div>
            
            <div class="contact-info">
              <h4>Contact Information:</h4>
              <p><strong>Email:</strong> ${email}</p>
              <p>You can contact the instructor directly to inform them about the rejection and provide feedback.</p>
            </div>
            
            <p><strong>Status:</strong> The instructor submission has been rejected and will not appear on the website.</p>
            
            <a href="/admin/dashboard" class="back-button">Back to Admin Dashboard</a>
          </div>
        </body>
      </html>
    `

    return new NextResponse(html, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error rejecting instructor:', error)
    return NextResponse.json(
      { error: 'Failed to reject instructor' },
      { status: 500 }
    )
  }
} 