import { db, storage } from '../../../firebase/config'
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const data = await request.formData()
    const name = data.get('name') as string
    const location = data.get('location') as string
    const state = data.get('state') as string
    const address = data.get('address') as string
    const googleReviewLink = data.get('googleReviewLink') as string
    const websiteLink = data.get('websiteLink') as string
    const comment = data.get('comment') as string
    const imageFile = data.get('image') as File | null

    let imageUrl = ''

    // If an image file is provided, upload it to Firebase Storage
    if (imageFile) {
      const imageRef = ref(storage, `shops/${Date.now()}-${imageFile.name}`)
      const imageBuffer = await imageFile.arrayBuffer()
      await uploadBytes(imageRef, imageBuffer)
      imageUrl = await getDownloadURL(imageRef)
    }

    // Create the shop document in Firestore
    const shopData = {
      name,
      location,
      state,
      address,
      googleReviewLink,
      websiteLink,
      comment,
      imageUrl,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    }

    const docRef = await addDoc(collection(db, 'shops'), shopData)

    return NextResponse.json({ 
      message: 'Shop created successfully',
      id: docRef.id 
    }, { status: 201 })

  } catch (error) {
    console.error('Error creating shop:', error)
    return NextResponse.json({ 
      error: 'Failed to create shop' 
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    const shopsCollection = collection(db, 'shops')
    const shopsSnapshot = await getDocs(shopsCollection)
    
    const shops = shopsSnapshot.docs.map(doc => ({
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