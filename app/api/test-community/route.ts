import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    console.log('Testing community API...')
    
    const db = getDb()
    
    // Test if we can read from the collection
    const testQuery = await db.collection('community_members').get()
    console.log('Successfully read from community_members collection')
    
    // Test if we can write to the collection
    const testData = {
      name: 'Test User',
      email: `test-${Date.now()}@example.com`,
      joinedAt: new Date().toISOString(),
      isActive: true,
      contestEntry: true,
      lastActivity: new Date().toISOString(),
      isTest: true
    }
    
    const docRef = await db.collection('community_members').add(testData)
    console.log('Successfully wrote to community_members collection:', docRef.id)
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection and write test successful',
      testDocId: docRef.id,
      existingMembers: testQuery.size
    })
  } catch (error) {
    console.error('Test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 