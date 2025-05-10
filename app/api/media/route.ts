import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'

export async function GET() {
  try {
    const mediaCollection = collection(db, 'medias')
    const mediaSnapshot = await getDocs(mediaCollection)
    const mediaList = mediaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    return NextResponse.json(mediaList)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    const mediaCollection = collection(db, 'medias')
    const docRef = await addDoc(mediaCollection, {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return NextResponse.json({ id: docRef.id, ...data })
  } catch (error) {
    console.error('Error creating media:', error)
    return NextResponse.json({ error: 'Failed to create media' }, { status: 500 })
  }
} 
 
 
 