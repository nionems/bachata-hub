import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import { School } from '@/types/school'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const db = getDb()
    const schoolDoc = await db.collection('schools').doc(params.id).get()
    
    if (!schoolDoc.exists) {
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

    const db = getDb()
    const schoolRef = db.collection('schools').doc(params.id);
    const schoolDoc = await schoolRef.get();
    
    if (!schoolDoc.exists) {
      console.error('School not found with ID:', params.id);
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      );
    }

    const existingData = schoolDoc.data();
    
    if (!existingData) {
      console.error('School data is null/undefined');
      return NextResponse.json(
        { error: 'School data not found' },
        { status: 404 }
      );
    }

    // If this is just a status update, use existing data
    if (Object.keys(data).length === 1 && data.status) {
      const updateData = {
        status: data.status,
        updatedAt: new Date().toISOString()
      };
      
      await schoolRef.update(updateData);
      console.log('School status updated successfully');
      return NextResponse.json({ id: params.id, ...existingData, ...updateData });
    }

    // For full updates, validate required fields
    if (!data.name || !data.location || !data.state) {
      console.error('Missing required fields:', {
        hasName: !!data.name,
        hasLocation: !!data.location,
        hasState: !!data.state
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
      comment,
      status
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
      status: status || existingData.status || 'pending',
      updatedAt: new Date().toISOString()
    };

    console.log('Processed school data:', schoolData);

    await schoolRef.update(schoolData);
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
    const db = getDb()
    const schoolRef = db.collection('schools').doc(params.id)
    const schoolDoc = await schoolRef.get()
    
    if (!schoolDoc.exists) {
      return NextResponse.json(
        { error: 'School not found' },
        { status: 404 }
      )
    }

    await schoolRef.delete()
    return NextResponse.json({ message: 'School deleted successfully' })
  } catch (error) {
    console.error('Error deleting school:', error)
    return NextResponse.json(
      { error: 'Failed to delete school' },
      { status: 500 }
    )
  }
} 