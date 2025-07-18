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
    
    // Update all festival fields
    const updateData: any = {
      name: data.name,
      startDate: data.startDate,
      endDate: data.endDate,
      location: data.location,
      state: data.state,
      country: data.country || 'Australia',
      address: data.address,
      eventLink: data.eventLink || '',
      price: data.price,
      ticketLink: data.ticketLink || '',
      danceStyles: data.danceStyles || [],
      imageUrl: data.imageUrl || '',
      description: data.description || '',
      ambassadorCode: data.ambassadorCode || '',
      googleMapLink: data.googleMapLink || '',
      featured: data.featured || 'no',
      published: data.published !== undefined ? data.published : true,
      instagramLink: data.instagramLink || '',
      facebookLink: data.facebookLink || '',
      updatedAt: new Date().toISOString()
    }
    
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