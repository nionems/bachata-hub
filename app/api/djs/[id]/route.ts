import { NextResponse } from "next/server"
import { db } from "@/lib/firebase-admin"

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const djRef = db.collection("djs").doc(params.id)
    const djDoc = await djRef.get()

    if (!djDoc.exists) {
      return NextResponse.json(
        { error: "DJ not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: djDoc.id,
      ...djDoc.data()
    })
  } catch (error) {
    console.error("Failed to fetch DJ:", error)
    return NextResponse.json(
      { error: "Failed to fetch DJ" },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const djRef = db.collection("djs").doc(params.id)
    
    // Add updatedAt timestamp
    const djData = {
      ...data,
      updatedAt: new Date().toISOString()
    }

    await djRef.update(djData)

    return NextResponse.json({
      id: params.id,
      ...djData
    })
  } catch (error) {
    console.error("Failed to update DJ:", error)
    return NextResponse.json(
      { error: "Failed to update DJ" },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const djRef = db.collection("djs").doc(params.id)
    await djRef.delete()

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to delete DJ:", error)
    return NextResponse.json(
      { error: "Failed to delete DJ" },
      { status: 500 }
    )
  }
} 