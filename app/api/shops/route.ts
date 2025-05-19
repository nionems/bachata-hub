import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

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
      website,
      googleReviewLink,
      contactInfo,
      imageUrl,
      instagramUrl,
      facebookUrl,
      googleMapLink,
      comment
    } = data

    // Validate required fields
    if (!name || !location || !state || !address) {
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
      address,
      website: website || '',
      googleReviewLink: googleReviewLink || '',
      contactInfo: contactInfo || '',
      imageUrl: imageUrl || '',
      instagramUrl: instagramUrl || '',
      facebookUrl: facebookUrl || '',
      googleMapLink: googleMapLink || '',
      comment: comment || '',
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
    }))

    return NextResponse.json(shops)
  } catch (error) {
    console.error('Error fetching shops:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shops' },
      { status: 500 }
    )
  }
} 