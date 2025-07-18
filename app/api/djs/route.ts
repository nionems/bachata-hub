import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-admin"
import { Dj } from "@/types/dj"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin')
    
    console.log('Fetching DJs from Firestore')
    const db = getDb()
    const djsRef = db.collection("djs")
    const snapshot = await djsRef.get()
    
    let djs: Dj[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Dj[]

    // If not admin, only return approved DJs
    if (!admin) {
      djs = djs.filter(dj => dj.status === 'approved' || !dj.status)
    }

    console.log('Fetched DJs:', djs)
    return NextResponse.json(djs)
  } catch (error) {
    console.error("Failed to fetch DJs:", error)
    return NextResponse.json(
      { error: "Failed to fetch DJs" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received DJ creation request');
    const data = await request.json();
    console.log('Received data:', data);

    const {
      name,
      location,
      state,
      email,
      musicStyles,
      imageUrl,
      comment,
      instagramLink,
      facebookLink,
      emailLink,
      musicLink
    } = data;

    // Validate required fields
    if (!name || !location || !state || !email) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const djData = {
      name,
      location,
      state,
      contact: '', // Removed contact field
      emailLink: email || '',
      facebookLink: facebookLink || '',
      instagramLink: instagramLink || '',
      imageUrl: imageUrl || '',
      comment: comment || '',
      danceStyles: Array.isArray(musicStyles) ? musicStyles : [musicStyles].filter(Boolean),
      musicLink: musicLink || '',
      status: 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Processed DJ data:', djData);

    // Add to Firestore djs collection
    const db = getDb()
    const djsRef = db.collection('djs')
    const docRef = await djsRef.add(djData)

    console.log('DJ created with ID:', docRef.id);
    return NextResponse.json({
      id: docRef.id,
      ...djData
    })

  } catch (error) {
    console.error('Failed to create DJ:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to create DJ',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 