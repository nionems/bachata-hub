import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    console.log('Fetching community members...')
    const db = getDb()
    
    const snapshot = await db.collection('community_members').get()
    const members = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
    
    console.log(`Found ${members.length} community members`)
    
    return NextResponse.json({
      success: true,
      count: members.length,
      members: members
    })
  } catch (error) {
    console.error('Error fetching community members:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 