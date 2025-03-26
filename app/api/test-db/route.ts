import { NextResponse } from 'next/server'
import clientPromise from '@/lib/mongodb'

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db("bachataDB")
    
    // Test the connection
    await db.command({ ping: 1 })
    
    return NextResponse.json({ status: 'Connected to MongoDB!' })
  } catch (error) {
    console.error('MongoDB connection error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to connect to MongoDB',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  }
} 