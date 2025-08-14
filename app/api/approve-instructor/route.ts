import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Extract all parameters from the URL
    const name = searchParams.get('name')
    const location = searchParams.get('location')
    const state = searchParams.get('state')
    const bio = searchParams.get('bio')
    const website = searchParams.get('website')
    const facebookLink = searchParams.get('facebookLink')
    const instagramLink = searchParams.get('instagramLink')
    const email = searchParams.get('email')
    const danceStyles = searchParams.get('danceStyles')
    const privatePricePerHour = searchParams.get('privatePricePerHour')
    const imageUrl = searchParams.get('imageUrl')

    if (!name || !location || !state || !email) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Find the instructor in the database and update status to approved
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
      status: 'approved',
      updatedAt: new Date().toISOString()
    })

    // Return success page
    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Instructor Approved</title>
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
            .success-icon {
              color: #10B981;
              font-size: 48px;
              text-align: center;
              margin-bottom: 20px;
            }
            h1 {
              color: #10B981;
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
              background-color: #10B981;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin-top: 20px;
            }
            .back-button:hover {
              background-color: #059669;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="success-icon">✅</div>
            <h1>Instructor Approved Successfully!</h1>
            
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
              <div class="detail-row">
                <span class="detail-label">Bio:</span>
                <span class="detail-value">${bio || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Website:</span>
                <span class="detail-value">${website || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Facebook:</span>
                <span class="detail-value">${facebookLink || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Instagram:</span>
                <span class="detail-value">${instagramLink || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Dance Styles:</span>
                <span class="detail-value">${danceStyles || 'N/A'}</span>
              </div>
              <div class="detail-row">
                <span class="detail-label">Private Price:</span>
                <span class="detail-value">${privatePricePerHour || 'N/A'}</span>
              </div>
            </div>
            
            <p><strong>Status:</strong> The instructor has been approved and is now live on the website.</p>
            
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
    console.error('Error approving instructor:', error)
    return NextResponse.json(
      { error: 'Failed to approve instructor' },
      { status: 500 }
    )
  }
} 