import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, addDoc, getDocs } from 'firebase/firestore'

// Add GET method to fetch all instructors
export async function GET() {
  try {
    console.log('Fetching instructors from Firestore') // Debug log
    const instructorsRef = collection(db, 'instructors')
    const snapshot = await getDocs(instructorsRef)
    
    const instructors = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('Fetched instructors:', instructors) // Debug log
    return NextResponse.json(instructors)
  } catch (error) {
    console.error('Failed to fetch instructors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Add timestamp to the instructor data
    const instructorData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to Firestore instructors collection
    const instructorsRef = collection(db, 'instructors')
    const docRef = await addDoc(instructorsRef, instructorData)

    return NextResponse.json({
      id: docRef.id,
      ...instructorData
    })

  } catch (error) {
    console.error('Failed to create instructor:', error)
    return NextResponse.json(
      { error: 'Failed to create instructor' },
      { status: 500 }
    )
  }
} 