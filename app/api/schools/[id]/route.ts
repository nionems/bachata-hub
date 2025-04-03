import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { School } from '@/types/school'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schoolRef = doc(db, 'schools', params.id)
    const schoolDoc = await getDoc(schoolRef)
    
    if (!schoolDoc.exists()) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: schoolDoc.id,
      ...schoolDoc.data()
    } as School)
  } catch (error) {
    console.error('Error fetching school:', error)
    return NextResponse.json(
      { error: 'Failed to fetch school' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json()
    const schoolRef = doc(db, 'schools', params.id)
    const schoolDoc = await getDoc(schoolRef)
    
    if (!schoolDoc.exists()) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    await updateDoc(schoolRef, {
      ...body,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json({
      id: params.id,
      ...body
    } as School)
  } catch (error) {
    console.error('Error updating school:', error)
    return NextResponse.json(
      { error: 'Failed to update school' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schoolRef = doc(db, 'schools', params.id)
    const schoolDoc = await getDoc(schoolRef)
    
    if (!schoolDoc.exists()) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    await deleteDoc(schoolRef)
    return NextResponse.json({ message: 'School deleted successfully' })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    )
  }
} 