import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log('Fetching competition:', id)
    
    const db = getDb()
    const competitionRef = db.collection('competitions').doc(id)
    const competitionDoc = await competitionRef.get()
    
    if (!competitionDoc.exists) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }
    
    const competitionData = competitionDoc.data()
    return NextResponse.json({
      id: competitionDoc.id,
      ...competitionData
    })
  } catch (error) {
    console.error('Error fetching competition:', error)
    return NextResponse.json(
      { error: 'Failed to fetch competition' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    console.log('Updating competition:', id, 'with data:', data)
    
    const db = getDb()
    const competitionRef = db.collection('competitions').doc(id)
    const competitionDoc = await competitionRef.get()
    
    if (!competitionDoc.exists) {
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }
    
    // Get existing competition data
    const existingData = competitionDoc.data()
    
    // Update only provided fields (partial update)
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }
    
    // Only update fields that are provided in the request
    if (data.name !== undefined) updateData.name = data.name
    if (data.organizer !== undefined) updateData.organizer = data.organizer
    if (data.email !== undefined) updateData.email = data.email
    if (data.startDate !== undefined) updateData.startDate = data.startDate
    if (data.endDate !== undefined) updateData.endDate = data.endDate
    if (data.location !== undefined) updateData.location = data.location
    if (data.state !== undefined) updateData.state = data.state
    if (data.address !== undefined) updateData.address = data.address
    if (data.eventLink !== undefined) updateData.eventLink = data.eventLink
    if (data.price !== undefined) updateData.price = data.price
    if (data.ticketLink !== undefined) updateData.ticketLink = data.ticketLink
    if (data.resultLink !== undefined) updateData.resultLink = data.resultLink
    if (data.danceStyles !== undefined) updateData.danceStyles = data.danceStyles
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.comment !== undefined) updateData.comment = data.comment
    if (data.googleMapLink !== undefined) updateData.googleMapLink = data.googleMapLink
    if (data.categories !== undefined) updateData.categories = data.categories
    if (data.level !== undefined) updateData.level = data.level
    if (data.socialLink !== undefined) updateData.socialLink = data.socialLink
    if (data.instagramLink !== undefined) updateData.instagramLink = data.instagramLink
    if (data.facebookLink !== undefined) updateData.facebookLink = data.facebookLink
    if (data.published !== undefined) updateData.published = data.published
    
    // Handle status updates
    if (data.status) {
      updateData.status = data.status
      // If approved, also set published to true
      if (data.status === 'approved') {
        updateData.published = true
      }
    }
    
    await competitionRef.update(updateData)
    
    console.log('Competition updated successfully')
    
    // Clear the competitions cache to ensure the public page shows updated data
    try {
      await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/competitions?clearCache=true`)
      console.log('Competitions cache cleared after update')
    } catch (cacheError) {
      console.warn('Failed to clear competitions cache:', cacheError)
    }
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating competition:', error)
    return NextResponse.json(
      { error: 'Failed to update competition' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log('DELETE /api/competitions/[id] - Deleting competition:', id)
    console.log('DELETE /api/competitions/[id] - Request URL:', request.url)
    console.log('DELETE /api/competitions/[id] - Request method:', request.method)
    
    const db = getDb()
    console.log('DELETE /api/competitions/[id] - Firebase admin initialized')
    
    const competitionRef = db.collection('competitions').doc(id)
    console.log('DELETE /api/competitions/[id] - Competition reference created')
    
    const competitionDoc = await competitionRef.get()
    console.log('DELETE /api/competitions/[id] - Competition document fetched, exists:', competitionDoc.exists)
    
    if (!competitionDoc.exists) {
      console.log('DELETE /api/competitions/[id] - Competition not found, returning 404')
      return NextResponse.json(
        { error: 'Competition not found' },
        { status: 404 }
      )
    }
    
    console.log('DELETE /api/competitions/[id] - Competition found, proceeding with deletion')
    await competitionRef.delete()
    
    console.log('DELETE /api/competitions/[id] - Competition deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('DELETE /api/competitions/[id] - Error deleting competition:', error)
    if (error instanceof Error) {
      console.error('DELETE /api/competitions/[id] - Error details:', {
        message: error.message,
        stack: error.stack
      })
    }
    return NextResponse.json(
      { error: 'Failed to delete competition' },
      { status: 500 }
    )
  }
} 