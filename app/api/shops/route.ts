import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, location, image, website, phone, email } = body

    if (!name || !description || !location || !image) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const docRef = await addDoc(collection(db, 'shops'), {
      name,
      description,
      location,
      image,
      website,
      phone,
      email,
      createdAt: new Date().toISOString(),
    })

    return NextResponse.json({ id: docRef.id })
  } catch (error) {
    console.error('Error creating shop:', error)
    return NextResponse.json(
      { error: 'Failed to create shop' },
      { status: 500 }
    )
  }
}

export async function GET() {
  try {
    const querySnapshot = await getDocs(collection(db, 'shops'))
    const shops = querySnapshot.docs.map(doc => ({
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