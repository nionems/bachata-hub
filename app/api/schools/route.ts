import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase'
import { collection, getDocs, doc, getDoc, addDoc, updateDoc, deleteDoc } from 'firebase/firestore'
import { School } from '@/types/school'

export async function GET() {
  try {
    const schoolsRef = collection(db, 'schools')
    const snapshot = await getDocs(schoolsRef)
    const schools = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
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
    const data = await request.json();
    const {
      name,
      location,
      state,
      address,
      contactInfo,
      instructors,
      website,
      danceStyles,
      imageUrl,
      comment,
      googleReviewsUrl,
      googleRating,
      googleReviewsCount,
      socialUrl,
      googleMapLink
    } = data;

    const schoolData = {
      name,
      location,
      state,
      address,
      contactInfo,
      instructors: instructors.split(',').map((i: string) => i.trim()),
      website,
      danceStyles: danceStyles.split(',').map((s: string) => s.trim()),
      imageUrl,
      comment,
      googleReviewsUrl,
      googleRating: Number(googleRating),
      googleReviewsCount: Number(googleReviewsCount),
      socialUrl,
      googleMapLink,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const docRef = await addDoc(collection(db, 'schools'), schoolData);
    return NextResponse.json({ id: docRef.id, ...schoolData });
  } catch (error) {
    console.error('Error creating school:', error);
    return NextResponse.json({ error: 'Failed to create school' }, { status: 500 });
  }
} 