import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

export async function POST(request: Request) {
  console.log("Received POST request to /api/upload")
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const folder = formData.get('folder') as string || 'default'

    if (!file) {
      console.error("No file found in the request")
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log("File received:", { name: file.name, type: file.type, size: file.size, folder })

    // Convert file to base64
    const bytes = await file.arrayBuffer()
    const base64 = Buffer.from(bytes).toString('base64')
    const base64Data = `data:${file.type};base64,${base64}`

    // Upload to Cloudinary
    console.log("Uploading to Cloudinary...")
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload(
        base64Data,
        {
          folder: folder,
          resource_type: 'auto',
        },
        (error: any, result: any) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(error)
          } else {
            resolve(result)
          }
        }
      )
    })

    console.log("Cloudinary upload result:", result)
    return NextResponse.json({ imageUrl: (result as any).secure_url })
  } catch (error) {
    console.error("Error in POST /api/upload:", error)
    if (error instanceof Error) {
      console.error("Error details:", { message: error.message, stack: error.stack })
    }
    return NextResponse.json(
      { error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
} 