import { NextResponse } from "next/server"
import { getDb } from "@/lib/firebase-admin"

export async function GET() {
  try {
    console.log('Fetching DJs from Firestore')
    const db = getDb()
    const djsRef = db.collection("djs")
    const snapshot = await djsRef.get()
    
    const djs = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))

    console.log('Fetched DJs:', djs)
    return NextResponse.json(djs)
  } catch (error) {
    console.error("Failed to fetch DJs:", error)
    return NextResponse.json(
      { error: "Failed to fetch DJs" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const data = await request.json()
    console.log('Received DJ data:', data)
    
    // Add timestamp to the DJ data
    const djData = {
      ...data,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }

    // Add to Firestore djs collection
    const db = getDb()
    const djsRef = db.collection('djs')
    const docRef = await djsRef.add(djData)

    console.log('DJ created with ID:', docRef.id)
    return NextResponse.json({
      id: docRef.id,
      ...djData
    })

  } catch (error) {
    console.error('Failed to create DJ:', error)
    return NextResponse.json(
      { error: 'Failed to create DJ' },
      { status: 500 }
    )
  }
} 