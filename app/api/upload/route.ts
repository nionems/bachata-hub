import { NextResponse } from 'next/server'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export async function POST(request: Request) {
  try {
    console.log('Starting file upload...')
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      console.log('No file provided in request')
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    console.log('File received:', {
      name: file.name,
      type: file.type,
      size: file.size
    })

    // Validate file type
    if (!file.type.startsWith('image/')) {
      console.log('Invalid file type:', file.type)
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      )
    }

    // Get file extension
    const extension = file.name.split('.').pop()
    
    // Create a unique filename
    const filename = `${Date.now()}-${Math.random().toString(36).substring(2)}.${extension}`
    
    console.log('Creating storage reference for:', filename)
    // Create a reference to the file location
    const storageRef = ref(storage, `schools/${filename}`)

    console.log('Converting file to buffer...')
    // Convert File to ArrayBuffer
    const buffer = await file.arrayBuffer()
    
    console.log('Uploading file to Firebase Storage...')
    // Upload the file
    await uploadBytes(storageRef, buffer, {
      contentType: file.type,
    })

    console.log('Getting download URL...')
    // Get the download URL
    const downloadURL = await getDownloadURL(storageRef)
    console.log('File uploaded successfully:', downloadURL)

    return NextResponse.json({
      url: downloadURL,
      path: `schools/${filename}`
    })
  } catch (error) {
    console.error('Error uploading file:', error)
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      })
    }
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 