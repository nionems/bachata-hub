import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import { Media } from '@/types/media'

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const admin = searchParams.get('admin')
    
    const mediaCollection = collection(db, 'medias')
    const mediaSnapshot = await getDocs(mediaCollection)
    let mediaList: Media[] = mediaSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    })) as Media[]

    // If not admin, only return approved media
    if (!admin) {
      mediaList = mediaList.filter(media => media.status === 'approved' || !media.status)
    }

    return NextResponse.json(mediaList)
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    console.log('Received media creation request');
    const data = await request.json();
    console.log('Received data:', data);

    const {
      name,
      location,
      state,
      email,
      comment,
      instagramLink,
      facebookLink,
      emailLink,
      mediaLink,
      mediaLink2,
      imageUrl
    } = data;

    // Validate required fields
    if (!name || !location || !state || !email) {
      console.error('Missing required fields');
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const mediaData = {
      name,
      location,
      state,
      imageUrl: imageUrl || '',
      comment: comment || '',
      instagramLink: instagramLink || '',
      facebookLink: facebookLink || '',
      emailLink: email || '',
      mediaLink,
      mediaLink2: mediaLink2 || '',
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    console.log('Processed media data:', mediaData);

    const mediaCollection = collection(db, 'medias')
    const docRef = await addDoc(mediaCollection, mediaData)
    
    console.log('Media created with ID:', docRef.id);
    return NextResponse.json({
      id: docRef.id,
      ...mediaData
    })

  } catch (error) {
    console.error('Failed to create media:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack
      });
    }
    return NextResponse.json(
      { 
        error: 'Failed to create media',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 
 
 
 