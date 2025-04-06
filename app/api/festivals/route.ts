import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

export async function GET() {
  try {
    const festivalsRef = collection(db, 'festivals')
    const snapshot = await getDocs(festivalsRef)
    
    const festivals = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(festivals)
  } catch (error) {
    console.error('Failed to fetch festivals:', error)
    return NextResponse.json(
      { error: 'Failed to fetch festivals' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Add timestamp to the festival data
    const festivalData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    console.log('Creating festival with data:', festivalData) // Debug log

    // Add to Firestore festivals collection
    const festivalsRef = collection(db, 'festivals')
    const docRef = await addDoc(festivalsRef, festivalData)

    console.log('Festival created with ID:', docRef.id) // Debug log

    return NextResponse.json({
      id: docRef.id,
      ...festivalData
    })

  } catch (error) {
    console.error('Failed to create festival:', error)
    return NextResponse.json(
      { error: 'Failed to create festival' },
      { status: 500 }
    )
  }
} 