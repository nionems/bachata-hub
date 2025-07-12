import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    console.log('Testing Firebase connection...')
    
    // Check environment variables
    const envVars = {
      FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
      FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL ? 'Set' : 'Missing',
      FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY ? 'Set' : 'Missing',
    }
    
    console.log('Environment variables:', envVars)
    
    // Try to get Firebase instance
    const db = getDb()
    console.log('Firebase database instance obtained successfully')
    
    // Try a simple query
    const testSnapshot = await db.collection('festivals').limit(1).get()
    console.log('Test query successful, found', testSnapshot.docs.length, 'documents')
    
    return NextResponse.json({
      success: true,
      message: 'Firebase connection successful',
      envVars,
      testQuery: `Found ${testSnapshot.docs.length} documents`
    })
  } catch (error) {
    console.error('Firebase test failed:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 