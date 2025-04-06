import { NextResponse } from 'next/server'
import { storage } from '@/lib/firebase'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'

export async function POST(request: Request) {
  try {
    // Log the start of upload process
    console.log('Starting upload process...')

    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('No file provided in request')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    // Log file details
    console.log('File details:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Generate safe filename
    const timestamp = Date.now()
    const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filename = `schools/${timestamp}-${safeName}`

    console.log('Uploading file as:', filename)

    // Create storage reference
    const storageRef = ref(storage, filename)

    // Set metadata
    const metadata = {
      contentType: file.type,
      cacheControl: 'public, max-age=31536000'
    }

    try {
      // Upload to Firebase Storage
      console.log('Attempting Firebase upload...')
      const uploadResult = await uploadBytes(storageRef, buffer, metadata)
      console.log('Upload successful, getting download URL...')

      // Get download URL
      const url = await getDownloadURL(uploadResult.ref)
      console.log('Download URL obtained:', url)

      return NextResponse.json({ url })
    } catch (firebaseError) {
      console.error('Firebase error:', firebaseError)
      return NextResponse.json(
        { 
          error: 'Storage error',
          details: firebaseError.message 
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { 
        error: 'Upload failed',
        details: error.message 
      },
      { status: 500 }
    )
  }
} 