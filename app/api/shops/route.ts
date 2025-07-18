import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Shop } from '@/types/shop'
import { Resend } from 'resend'

// Check if Resend API key is properly configured
if (!process.env.RESEND_API_KEY) {
  console.error('Resend API key is not configured')
}

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  try {
    console.log('Received shop creation request')
    const data = await request.json()
    console.log('Received data:', data)

    const {
      name,
      location,
      state,
      address,
      contactName,
      contactEmail,
      contactPhone,
      website,
      instagramUrl,
      facebookUrl,
      price,
      condition,
      comment,
      discountCode,
      imageUrl,
      googleMapLink,
      info,
      status,
      danceStyles
    } = data

    // Validate required fields
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!location) missingFields.push('location')
    if (!state) missingFields.push('state')
    if (!contactName) missingFields.push('contactName')
    if (!contactEmail) missingFields.push('contactEmail')
    if (!price) missingFields.push('price')
    if (!condition) missingFields.push('condition')
    if (!imageUrl) missingFields.push('imageUrl')
    if (!info) missingFields.push('info')
    
    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      console.error('Received data:', data)
      return NextResponse.json(
        { error: 'Missing required fields', missingFields, receivedData: data },
        { status: 400 }
      )
    }

    const shopData = {
      name,
      location,
      state,
      address: address || '',
      contactName,
      contactEmail,
      contactPhone: contactPhone || '',
      website: website || '',
      instagramUrl: instagramUrl || '',
      facebookUrl: facebookUrl || '',
      price,
      condition,
      comment: comment || '',
      discountCode: discountCode || '',
      imageUrl,
      googleMapLink: googleMapLink || '',
      info,
      danceStyles: Array.isArray(danceStyles) && danceStyles.length > 0 ? danceStyles : ['Bachata', 'Salsa', 'Kizomba', 'Zouk', 'Reggaeton', 'Heels', 'Pole Dance', 'Latin Beat', 'HipHop', 'Mambo', 'Dominican Bachata', 'Sensual Bachata', 'Bachata Moderna', 'Cuban Salsa', 'Chacha', 'Rumba', 'Merengue', 'Tango', 'Afrobeats', 'Taraxo', 'Choreography', 'Ballroom', 'Twerk', 'Jazz', 'Contemporary', 'Bachazouk', 'Bachata Influence', 'Other'],
      status: status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Saving shop with status:', shopData.status)

    console.log('Processed shop data:', shopData)

    const docRef = await addDoc(collection(db, 'shops'), shopData)
    console.log('Shop created with ID:', docRef.id)

    // Send email notification
    try {
      const { data, error } = await resend.emails.send({
        from: 'Bachata Hub <onboarding@resend.dev>',
        to: 'bachata.au@gmail.com',
        replyTo: 'bachata.au@gmail.com',
        subject: 'New Shop/Item Submission from Bachata Hub',
        html: `
          <h2>New Shop/Item Submission</h2>
          <p><strong>Item Name:</strong> ${name}</p>
          <p><strong>Location:</strong> ${location}, ${state}</p>
          <p><strong>Contact Name:</strong> ${contactName}</p>
          <p><strong>Contact Email:</strong> ${contactEmail}</p>
          <p><strong>Contact Phone:</strong> ${contactPhone || 'Not provided'}</p>
          <p><strong>Website:</strong> ${website || 'Not provided'}</p>
          <p><strong>Instagram:</strong> ${instagramUrl || 'Not provided'}</p>
          <p><strong>Facebook:</strong> ${facebookUrl || 'Not provided'}</p>
          <p><strong>Price:</strong> ${price}</p>
          <p><strong>Condition:</strong> ${condition}</p>
          <p><strong>Description:</strong></p>
          <p>${info}</p>
          <p><strong>Image URL:</strong> ${imageUrl}</p>
          <p><strong>Status:</strong> ${status}</p>
          <p><strong>Submitted:</strong> ${new Date().toLocaleString()}</p>
        `,
      })

      if (error) {
        console.error('Resend error:', error)
        // Don't fail the submission if email fails, just log it
      } else {
        console.log('Email notification sent successfully:', data)
      }
    } catch (emailError) {
      console.error('Error sending email notification:', emailError)
      // Don't fail the submission if email fails, just log it
    }
    
    return NextResponse.json({ id: docRef.id, ...shopData })
  } catch (error) {
    console.error('Error creating shop:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json({ 
      error: 'Failed to create shop',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const shopsSnapshot = await getDocs(collection(db, 'shops'))
    const shops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Shop[]

    // Only return approved shops for the public page
    const approvedShops = shops.filter(shop => shop.status === 'approved')

    console.log(`Total shops: ${shops.length}, Approved shops: ${approvedShops.length}`)
    
    // Add cache-busting headers
    const response = NextResponse.json(approvedShops)
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate, max-age=0')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
    
    return response
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
} 