import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { Shop } from '@/types/shop'

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
      status
    } = data

    // Validate required fields
    if (!name || !location || !state || !contactName || !contactEmail || !price || !condition || !imageUrl || !info) {
      console.error('Missing required fields')
      return NextResponse.json(
        { error: 'Missing required fields' },
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
      status: status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Processed shop data:', shopData)

    const docRef = await addDoc(collection(db, 'shops'), shopData)
    console.log('Shop created with ID:', docRef.id)
    
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