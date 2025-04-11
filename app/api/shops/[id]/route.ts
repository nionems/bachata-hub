import { db, storage } from '../../../../firebase/config'
import { doc, getDoc, deleteDoc, updateDoc } from 'firebase/firestore'
import { ref, deleteObject, uploadBytes, getDownloadURL } from 'firebase/storage'
import { NextResponse } from 'next/server'
import { Timestamp } from 'firebase/firestore'

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
    const shopData = await request.json();
    console.log("API Route: Shop data received:", shopData);

    const { name, location, state } = shopData;

    if (!name || !location || !state) {
      return NextResponse.json({ error: 'Missing required fields: Name, Location, and State are required.' }, { status: 400 });
    }

    // First check if the shop exists
    const shopRef = doc(db, 'shops', params.id);
    const shopDoc = await getDoc(shopRef);
    
    if (!shopDoc.exists()) {
      return NextResponse.json({ error: 'Shop not found' }, { status: 404 });
    }

    const updatedShopData = {
      name,
      location,
      state,
      address: shopData.address || "",
      googleReviewLink: shopData.googleReviewLink || "",
      websiteLink: shopData.websiteLink || "",
      imageUrl: shopData.imageUrl || "",
      comment: shopData.comment || "",
      updatedAt: Timestamp.now(),
    };

    console.log("API Route: Updating shop with data:", updatedShopData);
    await updateDoc(shopRef, updatedShopData);
    console.log("API Route: Shop updated successfully");

    return NextResponse.json({ message: 'Shop updated successfully' });
  } catch (error) {
    console.error('Error updating shop:', error);
    return NextResponse.json(
      { error: 'Failed to update shop' },
      { status: 500 }
    );
  }
} 