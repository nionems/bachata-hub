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
      info
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
    // Fetch from both pending_items and shops collections
    const [pendingItemsSnapshot, shopsSnapshot] = await Promise.all([
      getDocs(query(collection(db, 'pending_items'), orderBy('submittedAt', 'desc'))),
      getDocs(query(collection(db, 'shops'), orderBy('createdAt', 'desc')))
    ])
    
    const pendingItems = pendingItemsSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    const pendingShops = shopsSnapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .filter(shop => shop.status === 'pending')
      .map(shop => ({
        ...shop,
        type: 'shop',
        submittedAt: shop.createdAt || shop.submittedAt
      }))

    // Combine and sort by submission date
    const allPendingItems = [...pendingItems, ...pendingShops].sort((a, b) => {
      const dateA = new Date(a.submittedAt || a.createdAt || 0)
      const dateB = new Date(b.submittedAt || b.createdAt || 0)
      return dateB.getTime() - dateA.getTime()
    })

    return NextResponse.json(allPendingItems)
  } catch (error) {
    console.error('Error fetching pending items:', error)
    return NextResponse.json(
      { error: 'Failed to fetch pending items' },
      { status: 500 }
    )
  }
} 