import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs, serverTimestamp, deleteDoc, doc } from 'firebase/firestore'

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received accommodation data:', data)

    const { 
      name, 
      location, 
      state, 
      address, 
      contactInfo, 
      email, 
      website, 
      price, 
      rooms, 
      capacity, 
      imageUrl, 
      comment, 
      googleMapLink 
    } = data

    // Validate required fields
    const requiredFields = {
      name,
      location,
      state,
      address,
      contactInfo,
      email,
      price,
      rooms,
      capacity,
      imageUrl,
      comment
    }

    const missingFields = Object.entries(requiredFields)
      .filter(([_, value]) => !value)
      .map(([key]) => key)

    if (missingFields.length > 0) {
      console.error('Missing required fields:', missingFields)
      return NextResponse.json(
        { error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    // Create accommodation document in Firestore
    const accommodationData = {
      name,
      location,
      state,
      address,
      contactInfo,
      email,
      website,
      price,
      rooms,
      capacity,
      imageUrl,
      comment,
      googleMapLink,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    console.log('Creating accommodation with data:', accommodationData)

    const docRef = await addDoc(collection(db, 'accommodations'), accommodationData)
    console.log('Accommodation created with ID:', docRef.id)

    return NextResponse.json({ 
      id: docRef.id,
      message: 'Accommodation created successfully'
    })
  } catch (error) {
    console.error('Detailed error creating accommodation:', error)
    return NextResponse.json(
      { 
        error: 'Failed to create accommodation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    console.log('Fetching accommodations from Firestore')
    const snapshot = await getDocs(collection(db, 'accommodations'))
    console.log(`Found ${snapshot.size} accommodations`)
    
    const accommodations = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('Returning accommodations:', accommodations)
    return NextResponse.json(accommodations)
  } catch (error) {
    console.error('Detailed error fetching accommodations:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch accommodations',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { error: 'Accommodation ID is required' },
        { status: 400 }
      )
    }

    console.log('Deleting accommodation with ID:', id)
    await deleteDoc(doc(db, 'accommodations', id))
    
    return NextResponse.json({ 
      message: 'Accommodation deleted successfully'
    })
  } catch (error) {
    console.error('Detailed error deleting accommodation:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete accommodation',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 