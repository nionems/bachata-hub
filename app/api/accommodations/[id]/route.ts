import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

// Add CORS headers helper
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
}

// Handle OPTIONS request
export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders })
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accommodationRef = db.collection('accommodations').doc(params.id)
    const accommodationDoc = await accommodationRef.get()

    if (!accommodationDoc.exists) {
      return NextResponse.json(
        { error: 'Accommodation not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    const accommodation = {
      id: accommodationDoc.id,
      ...accommodationDoc.data()
    }

    return NextResponse.json(accommodation, { headers: corsHeaders })
  } catch (error) {
    console.error('Error fetching accommodation:', error)
    return NextResponse.json(
      { error: 'Failed to fetch accommodation' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json()
    const accommodationRef = db.collection('accommodations').doc(params.id)

    await accommodationRef.update({
      ...data,
      updatedAt: new Date().toISOString()
    })

    return NextResponse.json(
      { message: 'Accommodation updated successfully' },
      { headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error updating accommodation:', error)
    return NextResponse.json(
      { error: 'Failed to update accommodation' },
      { status: 500, headers: corsHeaders }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const accommodationRef = db.collection('accommodations').doc(params.id)
    const doc = await accommodationRef.get()

    if (!doc.exists) {
      return NextResponse.json(
        { error: 'Accommodation not found' },
        { status: 404, headers: corsHeaders }
      )
    }

    await accommodationRef.delete()
    
    return NextResponse.json(
      { message: 'Accommodation deleted successfully' },
      { status: 200, headers: corsHeaders }
    )
  } catch (error) {
    console.error('Error deleting accommodation:', error)
    return NextResponse.json(
      { error: 'Failed to delete accommodation' },
      { status: 500, headers: corsHeaders }
    )
  }
}
