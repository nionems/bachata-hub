import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const competitionRef = doc(db, 'competitions', params.id)
    const competitionSnap = await getDoc(competitionRef)
    
    if (!competitionSnap.exists()) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: competitionSnap.id,
      ...competitionSnap.data()
    })
  } catch (error) {
    console.error('Failed to fetch competition:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competition' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const competitionRef = doc(db, 'competitions', params.id)
    
    // Add updatedAt timestamp
    const updatedData = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    await updateDoc(competitionRef, updatedData)

    return NextResponse.json({
      id: params.id,
      ...updatedData
    })
  } catch (error) {
    console.error('Failed to update competition:', error)
    return NextResponse.json(
      { error: 'Failed to update competition' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const competitionRef = doc(db, 'competitions', params.id)
    await deleteDoc(competitionRef)
    
    return NextResponse.json({ message: 'Competition deleted successfully' })
  } catch (error) {
    console.error('Failed to delete competition:', error)
    return NextResponse.json(
      { error: 'Failed to delete competition' },
      { status: 500 }
    )
  }
} 