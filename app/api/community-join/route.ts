import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function POST(request: Request) {
  try {
    console.log('Community join API called')
    const body = await request.json()
    console.log('Received body:', body)
    const { name, email } = body

    // Get client IP address
    const forwarded = request.headers.get('x-forwarded-for')
    const realIp = request.headers.get('x-real-ip')
    const clientIp = forwarded ? forwarded.split(',')[0] : realIp || 'unknown'
    
    console.log('Client IP address:', clientIp)

    // Validate required fields
    if (!name || !email) {
      console.log('Missing required fields:', { name, email })
      return NextResponse.json(
        { error: 'Name and email are required' },
        { status: 400 }
      )
    }

    // Check if email already exists
    console.log('Checking for existing email:', email)
    const db = getDb()
    const existingQuery = db.collection('community_members').where('email', '==', email)
    const existingSnapshot = await existingQuery.get()
    console.log('Existing email check result:', existingSnapshot.empty ? 'No existing email' : 'Email already exists')
    
    if (!existingSnapshot.empty) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 409 }
      )
    }

    // Create community member data with IP address
    const memberData = {
      name: name.trim(),
      email: email.toLowerCase().trim(),
      joinedAt: new Date().toISOString(),
      isActive: true,
      contestEntry: true,
      lastActivity: new Date().toISOString(),
      ipAddress: clientIp,
      userAgent: request.headers.get('user-agent') || 'unknown'
    }

    // Save to Firestore
    console.log('Attempting to save to Firestore:', memberData)
    const docRef = await db.collection('community_members').add(memberData)
    
    console.log('Community member added successfully:', { id: docRef.id, email, ipAddress: clientIp })

    // Verify the document was actually saved
    const savedDoc = await db.collection('community_members').doc(docRef.id).get()
    console.log('Verification - Document exists:', savedDoc.exists)
    if (savedDoc.exists) {
      console.log('Verification - Document data:', savedDoc.data())
    }

    return NextResponse.json({ 
      success: true,
      id: docRef.id, 
      message: 'Successfully joined the community!',
      verified: savedDoc.exists,
      ipAddress: clientIp
    })
  } catch (error) {
    console.error('Error adding community member:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json({ 
      error: 'Failed to join community',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 