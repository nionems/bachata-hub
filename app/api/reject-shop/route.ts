import { NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    console.log('Rejection request received')
    const { searchParams } = new URL(request.url)
    
    // Extract basic shop data from URL parameters
    const shopData = {
      name: searchParams.get('name') || '',
      location: searchParams.get('location') || '',
      state: searchParams.get('state') || '',
      contactName: searchParams.get('contactName') || '',
      contactEmail: searchParams.get('contactEmail') || '',
      status: 'rejected' as const,
      rejectedAt: new Date().toISOString()
    }

    console.log('Shop rejection data:', shopData)

    // Return rejection confirmation page
    return new NextResponse(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Shop Rejected</title>
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
          .reject-icon {
            font-size: 48px;
            margin-bottom: 20px;
          }
          h1 {
            color: #EF4444;
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
          .note {
            background: #FEF3C7;
            border: 1px solid #F59E0B;
            border-radius: 6px;
            padding: 15px;
            margin: 20px 0;
            color: #92400E;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="reject-icon">❌</div>
          <h1>Shop Rejected</h1>
          <p>The shop submission has been rejected and will not be added to the database.</p>
          
          <div class="shop-details">
            <h3>Rejected Shop Details:</h3>
            <p><strong>Name:</strong> ${shopData.name}</p>
            <p><strong>Location:</strong> ${shopData.location}, ${shopData.state}</p>
            <p><strong>Contact:</strong> ${shopData.contactName} (${shopData.contactEmail})</p>
            <p><strong>Status:</strong> <span style="color: #EF4444; font-weight: bold;">Rejected</span></p>
          </div>
          
          <div class="note">
            <strong>Note:</strong> This rejection has been recorded. The shop will not appear on the website.
            If you need to contact the submitter, you can email them at: <strong>${shopData.contactEmail}</strong>
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
    console.error('Error rejecting shop:', error)
    
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
          <h1>Error Rejecting Shop</h1>
          <p>There was an error while trying to reject the shop. Please try again or contact support.</p>
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