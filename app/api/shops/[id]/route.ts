import { db, storage } from '../../../../firebase/config'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage'
import { NextResponse } from 'next/server'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = params.id
    const shopDoc = await getDoc(doc(db, 'shops', shopId))

    if (!shopDoc.exists()) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const shopData = {
      id: shopDoc.id,
      ...shopDoc.data()
    }

    return NextResponse.json(shopData)
  } catch (error) {
    console.error('Error fetching shop:', error)
    return NextResponse.json(
      { error: 'Failed to fetch shop' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = params.id

    // Get the shop document to check for image URL
    const shopDoc = await getDoc(doc(db, 'shops', shopId))
    if (!shopDoc.exists()) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 })
    }

    const shopData = shopDoc.data()

    // Delete the image from storage if it exists
    if (shopData.imageUrl) {
      try {
        const imageRef = ref(storage, shopData.imageUrl)
        await deleteObject(imageRef)
      } catch (error) {
        console.error('Error deleting image:', error)
        // Continue with shop deletion even if image deletion fails
      }
    }

    // Delete the shop document
    await deleteDoc(doc(db, 'shops', shopId))

    return NextResponse.json({ message: 'Shop deleted successfully' })
  } catch (error) {
    console.error('Error deleting shop:', error)
    return NextResponse.json(
      { error: 'Failed to delete shop' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const shopId = params.id
    const data = await request.formData()
    
    const updateData: any = {
      name: data.get('name'),
      location: data.get('location'),
      state: data.get('state'),
      address: data.get('address'),
      googleReviewLink: data.get('googleReviewLink'),
      websiteLink: data.get('websiteLink'),
      comment: data.get('comment'),
      updatedAt: new Date().toISOString()
    }

    // Handle image upload if a new image is provided
    const imageFile = data.get('image') as File | null
    if (imageFile && imageFile.size > 0) {
      const imageRef = ref(storage, `shops/${Date.now()}-${imageFile.name}`)
      const imageBuffer = await imageFile.arrayBuffer()
      await uploadBytes(imageRef, imageBuffer)
      updateData.imageUrl = await getDownloadURL(imageRef)
    }

    // Update the shop document
    await updateDoc(doc(db, 'shops', shopId), updateData)

    return NextResponse.json({ message: 'Shop updated successfully' })
  } catch (error) {
    console.error('Error updating shop:', error)
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    )
  }
} 