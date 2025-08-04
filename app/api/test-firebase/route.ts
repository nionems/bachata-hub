import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET() {
  try {
    console.log('Testing Firebase admin connection...')
    
    // Check environment variables
    const projectId = process.env.FIREBASE_PROJECT_ID
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_PRIVATE_KEY
    
    console.log('Environment variables check:', {
      hasProjectId: !!projectId,
      hasClientEmail: !!clientEmail,
      hasPrivateKey: !!privateKey,
      projectIdLength: projectId?.length || 0,
      clientEmailLength: clientEmail?.length || 0,
      privateKeyLength: privateKey?.length || 0
    })
    
    // Try to get Firebase instance
    const db = getDb()
    console.log('Firebase DB instance obtained successfully')
    
    // Try to access a collection
    const testCollection = db.collection('test')
    console.log('Test collection reference created')
    
    return NextResponse.json({
      success: true,
      message: 'Firebase admin is working correctly',
      envCheck: {
        hasProjectId: !!projectId,
        hasClientEmail: !!clientEmail,
        hasPrivateKey: !!privateKey
      }
    })
    
  } catch (error) {
    console.error('Firebase test failed:', error)
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      details: error instanceof Error ? error.stack : undefined
    }, { status: 500 })
  }
} 