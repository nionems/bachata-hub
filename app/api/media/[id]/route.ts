import { NextResponse } from 'next/server'
import { db } from '@/lib/firebase-admin'

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const mediaDoc = await db.collection('medias').doc(params.id).get()
    if (!mediaDoc.exists) {
      return NextResponse.json({ error: 'Media not found' }, { status: 404 })
    }
    return NextResponse.json({ id: mediaDoc.id, ...mediaDoc.data() })
  } catch (error) {
    console.error('Error fetching media:', error)
    return NextResponse.json({ error: 'Failed to fetch media' }, { status: 500 })
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params
    const data = await request.json()
    
    console.log('Updating media:', id, 'with data:', data)
    
    const mediaRef = db.collection('medias').doc(id)
    const mediaDoc = await mediaRef.get()
    
    if (!mediaDoc.exists) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    // Update all provided fields
    const updateData: any = {
      updatedAt: new Date()
    }
    
    // Add all fields that are provided in the request
    if (data.name !== undefined) updateData.name = data.name
    if (data.location !== undefined) updateData.location = data.location
    if (data.state !== undefined) updateData.state = data.state
    if (data.comment !== undefined) updateData.comment = data.comment
    if (data.instagramLink !== undefined) updateData.instagramLink = data.instagramLink
    if (data.facebookLink !== undefined) updateData.facebookLink = data.facebookLink
    if (data.email !== undefined) updateData.email = data.email
    if (data.mediaLink !== undefined) updateData.mediaLink = data.mediaLink
    if (data.mediaLink2 !== undefined) updateData.mediaLink2 = data.mediaLink2
    if (data.imageUrl !== undefined) updateData.imageUrl = data.imageUrl
    if (data.status !== undefined) updateData.status = data.status
    
    await mediaRef.update(updateData)
    
    console.log('Media updated successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error updating media:', error)
    return NextResponse.json(
      { error: 'Failed to update media' },
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
    
    console.log('Deleting media:', id)
    
    const mediaRef = db.collection('medias').doc(id)
    const mediaDoc = await mediaRef.get()
    
    if (!mediaDoc.exists) {
      return NextResponse.json(
        { error: 'Media not found' },
        { status: 404 }
      )
    }
    
    await mediaRef.delete()
    
    console.log('Media deleted successfully')
    
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting media:', error)
    return NextResponse.json(
      { error: 'Failed to delete media' },
      { status: 500 }
    )
  }
} 
 
 
 