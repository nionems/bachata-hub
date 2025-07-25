import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { School } from '@/types/school'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin')
    
    const schoolsRef = collection(db, 'schools')
    const snapshot = await getDocs(schoolsRef)
    let schools: School[] = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as School[]
    
    // If not admin, only return approved schools
    if (!admin) {
      schools = schools.filter(school => school.status === 'approved' || !school.status)
    }
    
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
    console.log('Received school creation request');
    const data = await request.json();
    console.log('Received data:', data);

    const {
      name,
      location,
      state,
      website,
      danceStyles,
      imageUrl,
      googleReviewsUrl,
      googleRating,
      googleReviewsCount,
      socialUrl,
      googleMapLink,
      googleReviewLink,
      instagramUrl,
      facebookUrl,
      comment,
      status
    } = data;

    // Validate required fields
    if (!name || !location || !state) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const schoolData = {
      name,
      location,
      state,
      website: website || '',
      danceStyles: Array.isArray(danceStyles) ? danceStyles : [],
      imageUrl: imageUrl || '',
      googleReviewsUrl: googleReviewsUrl || '',
      googleReviewLink: googleReviewLink || '',
      googleRating: Number(googleRating) || 0,
      googleReviewsCount: Number(googleReviewsCount) || 0,
      socialUrl: socialUrl || '',
      googleMapLink: googleMapLink || '',
      instagramUrl: instagramUrl || '',
      facebookUrl: facebookUrl || '',
      comment: comment || '',
      status: status || 'pending',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    console.log('Processed school data:', schoolData);

    const docRef = await addDoc(collection(db, 'schools'), schoolData);
    console.log('School created with ID:', docRef.id);
    
    return NextResponse.json({ id: docRef.id, ...schoolData });
  } catch (error) {
    console.error('Error creating school:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to create school',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 