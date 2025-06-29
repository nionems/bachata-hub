import { NextResponse } from 'next/server'
import { collection, addDoc } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function GET(request: Request) {
  try {
    console.log('Approval request received')
    const { searchParams } = new URL(request.url)
    
    // Extract all shop data from URL parameters
    const shopData = {
      name: searchParams.get('name') || '',
      location: searchParams.get('location') || '',
      state: searchParams.get('state') || '',
      address: searchParams.get('address') || '',
      contactName: searchParams.get('contactName') || '',
      contactEmail: searchParams.get('contactEmail') || '',
      contactPhone: searchParams.get('contactPhone') || '',
      website: searchParams.get('website') || '',
      instagramUrl: searchParams.get('instagramUrl') || '',
      facebookUrl: searchParams.get('facebookUrl') || '',
      price: searchParams.get('price') || '',
      condition: searchParams.get('condition') || '',
      comment: searchParams.get('comment') || '',
      discountCode: searchParams.get('discountCode') || '',
      imageUrl: searchParams.get('imageUrl') || '',
      googleMapLink: searchParams.get('googleMapLink') || '',
      info: searchParams.get('info') || '',
      status: 'approved' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Shop data extracted:', shopData)

    // Validate required fields
    if (!shopData.name || !shopData.location || !shopData.state || !shopData.contactName || !shopData.contactEmail || !shopData.price || !shopData.condition || !shopData.imageUrl || !shopData.info) {
      console.log('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    console.log('Adding shop to database...')
    // Add to shops collection
    const docRef = await addDoc(collection(db, 'shops'), shopData)
    console.log('Shop added successfully with ID:', docRef.id)
    
    // Return success page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shop Approved</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .success-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #10B981;
            margin-bottom: 20px;
          }
          .shop-details {
            text-align: left;
            background: #f9fafb;
            padding: 20px;
            border-radius: 8px;
            margin: 20px 0;
          }
          .shop-details h3 {
            margin-top: 0;
            color: #374151;
          }
          .shop-details p {
            margin: 8px 0;
            color: #6B7280;
          }
          .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #3B82F6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          }
          .back-link:hover {
            background: #2563EB;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="success-icon">✅</div>
          <h1>Shop Approved Successfully!</h1>
          <p>The shop has been added to the database and is now live on the website.</p>
          
          <div class="shop-details">
            <h3>Shop Details:</h3>
            <p><strong>Name:</strong> ${shopData.name}</p>
            <p><strong>Location:</strong> ${shopData.location}, ${shopData.state}</p>
            <p><strong>Contact:</strong> ${shopData.contactName} (${shopData.contactEmail})</p>
            <p><strong>Price:</strong> ${shopData.price}</p>
            <p><strong>Condition:</strong> ${shopData.condition}</p>
            <p><strong>Status:</strong> <span style="color: #10B981; font-weight: bold;">Approved</span></p>
          </div>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard" class="back-link">
            Go to Admin Dashboard
          </a>
        </div>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  } catch (error) {
    console.error('Error approving shop:', error)
    
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Error</title>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            max-width: 600px;
            margin: 50px auto;
            padding: 20px;
            background-color: #f9fafb;
          }
          .container {
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
            text-align: center;
          }
          .error-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #EF4444;
            margin-bottom: 20px;
          }
          .back-link {
            display: inline-block;
            margin-top: 20px;
            padding: 12px 24px;
            background: #3B82F6;
            color: white;
            text-decoration: none;
            border-radius: 6px;
            font-weight: 500;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="error-icon">❌</div>
          <h1>Error Approving Shop</h1>
          <p>There was an error while trying to approve the shop. Please try again or contact support.</p>
          <p><strong>Error:</strong> ${error instanceof Error ? error.message : 'Unknown error'}</p>
          
          <a href="${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/admin/dashboard" class="back-link">
            Go to Admin Dashboard
          </a>
        </div>
      </body>
      </html>
    `, {
      headers: {
        'Content-Type': 'text/html',
      },
    })
  }
} 