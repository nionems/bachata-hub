import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc } from 'firebase/firestore'

export async function GET() {
  try {
    const competitionsRef = collection(db, 'competitions')
    const snapshot = await getDocs(competitionsRef)
    
    const competitions = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    return NextResponse.json(competitions)
  } catch (error) {
    console.error('Failed to fetch competitions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competitions' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    
    // Add timestamp to the competition data
    const competitionData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to Firestore competitions collection
    const competitionsRef = collection(db, 'competitions')
    const docRef = await addDoc(competitionsRef, competitionData)

    return NextResponse.json({
      id: docRef.id,
      ...competitionData
    })

  } catch (error) {
    console.error('Failed to create competition:', error)
    return NextResponse.json(
      { error: 'Failed to create competition' },
      { status: 500 }
    )
  }
} 