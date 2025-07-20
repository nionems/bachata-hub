import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    
    console.log('Fetching DJ:', id)
    
    const db = getDb()
    const djRef = db.collection('djs').doc(id)
    const djDoc = await djRef.get()
    
    if (!djDoc.exists) {
      return NextResponse.json(
        { error: 'DJ not found' },
        { status: 404 }
      )
    }
    
    const djData = djDoc.data()
    return NextResponse.json({
      id: djDoc.id,
      ...djData
    })
  } catch (error) {
    console.error('Error fetching DJ:', error)
    return NextResponse.json(
      { error: 'Failed to fetch DJ' },
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
    
    console.log('Updating DJ:', id, 'with data:', data)
    
    const db = getDb()
    const djRef = db.collection('djs').doc(id)
    const djDoc = await djRef.get()
    
    if (!djDoc.exists) {
      return NextResponse.json(
        { error: 'DJ not found' },
        { status: 404 }
      )
    }

    // Validate required fields
    if (!data.name || !data.location || !data.state || !data.email) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Validate dance styles
    if (!data.danceStyles || (Array.isArray(data.danceStyles) && data.danceStyles.length === 0)) {
      return NextResponse.json(
        { error: 'Please select at least one dance style' },
        { status: 400 }
      )
    }
    
    // Update all DJ fields
    const updateData = {
      name: data.name,
      location: data.location,
      state: data.state,
      email: data.email,
      danceStyles: Array.isArray(data.danceStyles) ? data.danceStyles : [data.danceStyles].filter(Boolean),
      imageUrl: data.imageUrl || '',
      comment: data.comment || '',
      instagramLink: data.instagramLink || '',
      facebookLink: data.facebookLink || '',
      musicLink: data.musicLink || '',
      status: data.status || 'pending',
      updatedAt: new Date().toISOString()
    }
    
    await djRef.update(updateData)
    
    console.log('DJ updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating DJ:', error)
    return NextResponse.json(
      { error: 'Failed to update DJ' },
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
    
    console.log('Deleting DJ:', id)
    
    const db = getDb()
    const djRef = db.collection('djs').doc(id)
    const djDoc = await djRef.get()
    
    if (!djDoc.exists) {
      return NextResponse.json(
        { error: 'DJ not found' },
        { status: 404 }
      )
    }
    
    await djRef.delete()
    
    console.log('DJ deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting DJ:', error)
    return NextResponse.json(
      { error: 'Failed to delete DJ' },
      { status: 500 }
    )
  }
} 