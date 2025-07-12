import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { doc, getDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { School } from '@/types/school'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schoolRef = doc(db, 'schools', params.id)
    const schoolDoc = await getDoc(schoolRef)
    
    if (!schoolDoc.exists()) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: schoolDoc.id,
      ...schoolDoc.data()
    } as School)
  } catch (error) {
    console.error('Error fetching school:', error)
    return NextResponse.json(
      { error: 'Failed to fetch school' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    console.log('Received update data:', data);

    // Validate required fields
    if (!data.name || !data.location || !data.state || !data.address || !data.contactInfo) {
      console.error('Missing required fields:', {
        hasName: !!data.name,
        hasLocation: !!data.location,
        hasState: !!data.state,
        hasAddress: !!data.address,
        hasContactInfo: !!data.contactInfo
      });
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const {
      name,
      location,
      state,
      address,
      contactInfo,
      website,
      danceStyles,
      imageUrl,
      googleReviewsUrl,
      googleRating,
      googleReviewsCount,
      instagramUrl,
      facebookUrl,
      googleMapLink,
      googleReviewLink,
      comment
    } = data;

    // Process danceStyles
    const processedDanceStyles = Array.isArray(danceStyles) 
      ? danceStyles 
      : typeof danceStyles === 'string' 
        ? danceStyles.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];

    const schoolData = {
      name,
      location,
      state,
      address,
      contactInfo,
      website: website || '',
      danceStyles: processedDanceStyles,
      imageUrl: imageUrl || '',
      googleReviewsUrl: googleReviewsUrl || '',
      googleReviewLink: googleReviewLink || '',
      googleRating: Number(googleRating) || 0,
      googleReviewsCount: Number(googleReviewsCount) || 0,
      instagramUrl: instagramUrl || '',
      facebookUrl: facebookUrl || '',
      googleMapLink: googleMapLink || '',
      comment: comment || '',
      updatedAt: new Date().toISOString()
    };

    console.log('Processed school data:', schoolData);

    const schoolRef = doc(db, 'schools', params.id);
    const schoolDoc = await getDoc(schoolRef);
    
    if (!schoolDoc.exists()) {
      console.error('School not found with ID:', params.id);
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    await updateDoc(schoolRef, schoolData);
    console.log('School updated successfully');
    return NextResponse.json({ id: params.id, ...schoolData });
  } catch (error) {
    console.error('Detailed error updating school:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to update school',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const schoolRef = doc(db, 'schools', params.id)
    const schoolDoc = await getDoc(schoolRef)
    
    if (!schoolDoc.exists()) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    await deleteDoc(schoolRef)
    return NextResponse.json({ message: 'School deleted successfully' })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    )
  }
} 