import { NextResponse } from 'next/server'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { storage } from '@/lib/firebase'

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    // Simplified file naming
    const filename = `${Date.now()}-${file.name}`
    const storageRef = ref(storage, `schools/${filename}`)
    
    const metadata = {
      contentType: file.type,
      customMetadata: {
        originalName: file.name
      }
    }

    const snapshot = await uploadBytes(storageRef, buffer, metadata)
    const url = await getDownloadURL(snapshot.ref)

    return NextResponse.json({ url })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
} 