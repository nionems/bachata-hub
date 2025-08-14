import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { Instructor } from '@/types/instructor'

// Add GET method to fetch all instructors
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin')
    
    console.log('Fetching instructors from Firestore') // Debug log
    const db = getDb()
    const instructorsSnapshot = await db.collection('instructors').get()
    
    let instructors: Instructor[] = instructorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Instructor[]

    // If not admin, only return approved instructors
    if (!admin) {
      instructors = instructors.filter(instructor => instructor.status === 'approved' || !instructor.status)
    }

    console.log('Fetched instructors:', instructors) // Debug log
    return NextResponse.json(instructors)
  } catch (error) {
    console.error('Failed to fetch instructors:', error)
    return NextResponse.json(
      { error: 'Failed to fetch instructors' },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received instructor creation request');
    const data = await request.json();
    console.log('Received data:', data);

    const {
      name,
      location,
      state,
      bio,
      website,
      facebookLink,
      instagramLink,
      email,
      danceStyles,
      imageUrl,
      privatePricePerHour,
      status
    } = data;

    // Validate required fields
    if (!name || !location || !state || !email) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const instructorData = {
      name,
      location,
      state,
      comment: bio || '',
      website: website || '',
      facebookLink: facebookLink || '',
      instagramLink: instagramLink || '',
      emailLink: email || '',
      danceStyles: typeof danceStyles === 'string' ? danceStyles.split(',').map(style => style.trim()) : Array.isArray(danceStyles) ? danceStyles : [],
      imageUrl: imageUrl || '',
      privatePricePerHour: privatePricePerHour || '',
      status: status || 'pending', // User submissions are pending by default, admin-created are approved
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Processed instructor data:', instructorData);

    // Add to Firestore instructors collection
    const db = getDb()
    const docRef = await db.collection('instructors').add(instructorData)

    console.log('Instructor created with ID:', docRef.id);

    return NextResponse.json({
      id: docRef.id,
      ...instructorData
    })

  } catch (error) {
    console.error('Failed to create instructor:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to create instructor',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 