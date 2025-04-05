import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { School } from '@/types/school'

export async function GET() {
  try {
    const schoolsRef = collection(db, 'schools')
    const snapshot = await getDocs(schoolsRef)
    const schools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
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
    const schoolsRef = collection(db, 'schools')
    const docRef = await addDoc(schoolsRef, {
      ...body,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    })
    
    const newSchool = await getDoc(docRef)
    return NextResponse.json({
      id: docRef.id,
      ...newSchool.data()
    })
  } catch (error) {
    console.error('Error creating school:', error)
    return NextResponse.json(
      { error: 'Failed to create school' },
      { status: 500 }
    )
  }
} 