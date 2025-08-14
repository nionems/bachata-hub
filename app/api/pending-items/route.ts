import { NextResponse } from 'next/server'
import { collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore'
import { db } from '@/lib/firebase'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      name,
      location,
      state,
      address,
      contactName,
      contactEmail,
      contactPhone,
      website,
      instagramUrl,
      facebookUrl,
      price,
      condition,
      comment,
      discountCode,
      imageUrl,
      googleMapLink,
      info,
      danceStyles
    } = body

    // Validate required fields
    if (!name || !location || !state || !contactName || !contactEmail || !price || !condition || !imageUrl || !info) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const pendingItemData = {
      type: 'shop',
      name,
      location,
      state,
      address: address || '',
      contactName,
      contactEmail,
      contactPhone: contactPhone || '',
      website: website || '',
      instagramUrl: instagramUrl || '',
      facebookUrl: facebookUrl || '',
      price,
      condition,
      comment: comment || '',
      discountCode: discountCode || '',
      imageUrl,
      googleMapLink: googleMapLink || '',
      info,
      danceStyles: Array.isArray(danceStyles) && danceStyles.length > 0 ? danceStyles : ['Bachata', 'Salsa', 'Kizomba', 'Zouk', 'Reggaeton', 'Heels', 'Pole Dance', 'Latin Beat', 'HipHop', 'Mambo', 'Dominican Bachata', 'Sensual Bachata', 'Bachata Moderna', 'Cuban Salsa', 'Chacha', 'Rumba', 'Merengue', 'Tango', 'Afrobeats', 'Taraxo', 'Choreography', 'Ballroom', 'Twerk', 'Jazz', 'Contemporary', 'Bachazouk', 'Bachata Influence', 'Other'],
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date().toISOString(),
      reviewedAt: null,
      reviewedBy: null,
      reviewNotes: null
    }

    const docRef = await addDoc(collection(db, 'pending_items'), pendingItemData)
    
    return NextResponse.json({ 
      id: docRef.id, 
      message: 'Shop item submitted for review',
      ...pendingItemData 
    })
  } catch (error) {
    console.error('Error creating pending item:', error)
    return NextResponse.json({ 
      error: 'Failed to submit item for review',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}

export async function GET() {
  try {
    // Fetch from pending_items, shops, and instructors collections
    const [pendingItemsSnapshot, shopsSnapshot, instructorsSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'pending_items'), orderBy('submittedAt', 'desc'))),
      getDocs(query(collection(db, 'shops'), orderBy('createdAt', 'desc'))),
      getDocs(query(collection(db, 'instructors'), orderBy('createdAt', 'desc')))
    ])
    
    const pendingItems = pendingItemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const allShops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const allInstructors = instructorsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('All shops found:', allShops.length)
    console.log('All instructors found:', allInstructors.length)
    console.log('Shops with status:', allShops.map((shop: any) => ({ id: shop.id, status: shop.status, name: shop.name })))
    console.log('Instructors with status:', allInstructors.map((instructor: any) => ({ id: instructor.id, status: instructor.status, name: instructor.name })))

    const pendingShops = allShops
      .filter((shop: any) => shop.status === 'pending')
      .map((shop: any) => ({
        ...shop,
        type: 'shop',
        submittedAt: shop.createdAt || shop.submittedAt || shop.updatedAt
      }))

    const pendingInstructors = allInstructors
      .filter((instructor: any) => instructor.status === 'pending')
      .map((instructor: any) => ({
        ...instructor,
        type: 'instructor',
        submittedAt: instructor.createdAt || instructor.submittedAt || instructor.updatedAt
      }))

    console.log('Pending shops found:', pendingShops.length)
    console.log('Pending instructors found:', pendingInstructors.length)

    // Combine and sort by submission date
    const allPendingItems = [...pendingItems, ...pendingShops, ...pendingInstructors].sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt || 0)
      const dateB = new Date(b.submittedAt || b.createdAt || 0)
      return dateB.getTime() - dateA.getTime()
    })

    console.log('Total pending items:', allPendingItems.length)

    return NextResponse.json(allPendingItems)
  } catch (error) {
    console.error('Error fetching pending items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending items' },
      { status: 500 }
    )
  }
} 