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
  console.log("API Route: Received PUT request to /api/shops/[id]");
  try {
    console.log("API Route: Checking imported db object:", typeof db, db && typeof db.collection === 'function' ? 'Looks like Admin DB' : 'Invalid Admin DB');
    if (!db || typeof db.collection !== 'function') {
        console.error("API Route: FATAL - Imported 'db' is not a valid Admin Firestore instance!");
        throw new Error("Firestore Admin instance is not available or invalid.");
    }

    const shopData = await request.json();
    console.log("API Route: Shop data received:", shopData);

    const { name, location, state } = shopData;

    if (!name || !location || !state) {
      console.error("API Route: Validation Failed - Missing required fields:", { name, location, state });
      return NextResponse.json({ error: 'Missing required fields: Name, Location, and State are required.' }, { status: 400 });
    }

    const shopDoc = {
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

    console.log("API Route: Preparing to update document using Admin SDK:", shopDoc);

    const shopsCollectionRef = db.collection('shops');
    console.log("API Route: Got Admin collection reference for 'shops'");

    await shopsCollectionRef.doc(params.id).update(shopDoc);
    console.log("API Route: Document updated successfully using Admin SDK with ID:", params.id);

    return NextResponse.json({ message: 'Shop updated successfully' });

  } catch (error) {
    console.error("API Route: >>> Critical Error in PUT /api/shops/[id] <<<");
    console.error("API Route: Error:", error);

    let errorMessage = 'Failed to update shop due to an internal server error.';
    let errorDetails = 'Unknown error';

    if (error instanceof Error) {
        console.error("API Route: Error Message:", error.message);
        console.error("API Route: Error Stack:", error.stack);
        errorMessage = `Failed to update shop: ${error.message}`;
        errorDetails = error.message;
        // Check for Firestore specific errors if possible (structure varies)
        if ((error as any).code) {
             console.error("API Route: Firestore Error Code:", (error as any).code);
             errorDetails = `Firestore Error: ${(error as any).code}`;
        }
    } else {
         console.error("API Route: Non-Error object thrown:", error);
    }

    return NextResponse.json({ error: errorMessage, details: errorDetails }, { status: 500 });
  }
} 