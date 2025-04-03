import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { School } from '@/types/school'

export async function GET() {
  try {
    const schoolsRef = collection(db, 'schools')
    const q = query(schoolsRef, orderBy('name'))
    const snapshot = await getDocs(q)
    const schools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as School[]
    return NextResponse.json(schools)
  } catch (error) {
    console.error('Error fetching schools:', error)
    return NextResponse.json(
      { error: 'Failed to fetch schools' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    console.log('Received school data:', body)
    
    // Validate required fields
    const requiredFields = ['name', 'location', 'state', 'address', 'contactInfo']
    const missingFields = requiredFields.filter(field => !body[field])
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Prepare school data
    const schoolData = {
      name: body.name,
      location: body.location,
      state: body.state,
      address: body.address,
      contactInfo: body.contactInfo,
      instructors: body.instructors || '',
      website: body.website || '',
      danceStyles: body.danceStyles || '',
      imageUrl: body.imageUrl || '',
      imageRef: body.imageRef || '',
      comment: body.comment || '',
      googleReviewsUrl: body.googleReviewsUrl || '',
      googleRating: body.googleRating || 0,
      googleReviewsCount: body.googleReviewsCount || 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Creating school with data:', schoolData)

    const schoolsRef = collection(db, 'schools')
    const docRef = await addDoc(schoolsRef, schoolData)

    console.log('School created successfully with ID:', docRef.id)
    return NextResponse.json(
      { id: docRef.id, ...schoolData },
      { status: 201 }
    )
  } catch (error) {
    console.error('Error creating school:', error)
    // Log the full error object for debugging
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to create school' },
      { status: 500 }
    )
  }
} 