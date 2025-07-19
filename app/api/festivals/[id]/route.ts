import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export const dynamic = 'force-dynamic'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log('Fetching festival:', id)
    
    const db = getDb()
    const festivalRef = db.collection('festivals').doc(id)
    const festivalDoc = await festivalRef.get()
    
    if (!festivalDoc.exists) {
      return NextResponse.json(
        { error: 'Festival not found' },
        { status: 404 }
      )
    }
    
    const festivalData = festivalDoc.data()
    return NextResponse.json({
      id: festivalDoc.id,
      ...festivalData
    })
  } catch (error) {
    console.error('Error fetching festival:', error)
    return NextResponse.json(
      { error: 'Failed to fetch festival' },
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
    
    console.log('Updating festival:', id, 'with data:', data)
    
    const db = getDb()
    const festivalRef = db.collection('festivals').doc(id)
    const festivalDoc = await festivalRef.get()
    
    if (!festivalDoc.exists) {
      return NextResponse.json(
        { error: 'Festival not found' },
        { status: 404 }
      )
    }
    
    // Get existing festival data
    const existingData = festivalDoc.data()
    
    // Update only provided fields (partial update)
    const updateData: any = {
      updatedAt: new Date().toISOString()
    }
    
    // Only update fields that are provided in the request
    if (data.name !== undefined) updateData.name = data.name
    if (data.startDate !== undefined) updateData.startDate = data.startDate
    if (data.endDate !== undefined) updateData.endDate = data.endDate
    if (data.location !== undefined) updateData.location = data.location
    if (data.state !== undefined) updateData.state = data.state
    if (data.country !== undefined) updateData.country = data.country
    if (data.address !== undefined) updateData.address = data.address
    if (data.eventLink !== undefined) updateData.eventLink = data.eventLink
    if (data.price !== undefined) updateData.price = data.price
    if (data.ticketLink !== undefined) updateData.ticketLink = data.ticketLink
    if (data.danceStyles !== undefined) updateData.danceStyles = data.danceStyles
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.description !== undefined) updateData.description = data.description
    if (data.ambassadorCode !== undefined) updateData.ambassadorCode = data.ambassadorCode
    if (data.googleMapLink !== undefined) updateData.googleMapLink = data.googleMapLink
    if (data.featured !== undefined) updateData.featured = data.featured
    if (data.published !== undefined) updateData.published = data.published
    if (data.instagramLink !== undefined) updateData.instagramLink = data.instagramLink
    if (data.facebookLink !== undefined) updateData.facebookLink = data.facebookLink
    
    // Handle status updates
    if (data.status) {
      updateData.status = data.status
      // If approved, also set published to true
      if (data.status === 'approved') {
        updateData.published = true
      }
    }
    
    await festivalRef.update(updateData)
    
    console.log('Festival updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating festival:', error)
    return NextResponse.json(
      { error: 'Failed to update festival' },
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
    
    console.log('Deleting festival:', id)
    
    const db = getDb()
    const festivalRef = db.collection('festivals').doc(id)
    const festivalDoc = await festivalRef.get()
    
    if (!festivalDoc.exists) {
      return NextResponse.json(
        { error: 'Festival not found' },
        { status: 404 }
      )
    }
    
    await festivalRef.delete()
    
    console.log('Festival deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting festival:', error)
    return NextResponse.json(
      { error: 'Failed to delete festival' },
      { status: 500 }
    )
  }
} 