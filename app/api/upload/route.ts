import { NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const folder = formData.get('folder') as string || 'festivals'
    
    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Create a unique filename in the festivals folder
    const filename = `${folder}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
    console.log('Uploading file to:', filename) // Debug log
    
    const storageRef = ref(storage, filename)
    
    const metadata = {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000'
    }

    const uploadResult = await uploadBytes(storageRef, buffer, metadata)
    const url = await getDownloadURL(uploadResult.ref)

    console.log('File uploaded successfully, URL:', url) // Debug log

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 