import { db } from '@/lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  console.log("API Route: Received POST request to /api/shops");
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
      createdAt: Timestamp.now(),
    };

    console.log("API Route: Preparing to add document using Admin SDK:", shopDoc);

    const shopsCollectionRef = db.collection('shops');
    console.log("API Route: Got Admin collection reference for 'shops'");

    const docRef = await shopsCollectionRef.add(shopDoc);
    console.log("API Route: Document added successfully using Admin SDK with ID:", docRef.id);

    return NextResponse.json({ message: 'Shop added successfully', id: docRef.id }, { status: 201 });

  } catch (error) {
    console.error("API Route: >>> Critical Error in POST /api/shops <<<");
    console.error("API Route: Error:", error);

    let errorMessage = 'Failed to add shop due to an internal server error.';
    let errorDetails = 'Unknown error';

    if (error instanceof Error) {
        console.error("API Route: Error Message:", error.message);
        console.error("API Route: Error Stack:", error.stack);
        errorMessage = `Failed to add shop: ${error.message}`;
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

export async function GET() {
  console.log("API Route: Received GET request to /api/shops");
  try {
    console.log("API Route (GET): Checking imported db object:", typeof db, db && typeof db.collection === 'function' ? 'Looks like Admin DB' : 'Invalid Admin DB');
    if (!db || typeof db.collection !== 'function') {
        console.error("API Route (GET): FATAL - Imported 'db' is not a valid Admin Firestore instance!");
        throw new Error("Firestore Admin instance is not available or invalid.");
    }

    const shopsCollectionRef = db.collection('shops');
    const shopsSnapshot = await shopsCollectionRef.get();
    
    if (shopsSnapshot.empty) {
      console.log('API Route (GET): No shops found.');
      return NextResponse.json([]);
    }

    const shops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log(`API Route (GET): Fetched ${shops.length} shops using Admin SDK.`);
    return NextResponse.json(shops)
  } catch (error) {
    console.error("API Route: >>> Critical Error in GET /api/shops <<<");
    console.error('API Route (GET): Error fetching shops:', error);
    return NextResponse.json(
      { error: 'Failed to fetch shops', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 