import { NextResponse } from 'next/server'
import { v2 as cloudinary } from 'cloudinary'

// Ensure Cloudinary is configured correctly using environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true, // Make sure secure is true
})

export async function POST(request: Request) {
  console.log("Received POST request to /api/upload")
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      console.error("No file found in the request")
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 })
    }

    console.log("File received:", { name: file.name, type: file.type, size: file.size })

    // Convert file to buffer
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Upload to Cloudinary using upload_stream
    console.log("API Route (/api/upload): Attempting to upload to Cloudinary...")
    const uploadResponse = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'auto' }, // Use 'auto' to detect file type
        (error, result) => {
          if (error) {
            console.error("Cloudinary upload error:", error)
            reject(new Error('Cloudinary upload failed'))
          } else {
            console.log("Cloudinary upload successful:", result)
            resolve(result)
          }
        }
      )
      uploadStream.end(buffer)
    })

    // Type assertion for the result
    const result = uploadResponse as { secure_url: string }

    // --- Log the exact object being returned ---
    const responsePayload = { imageUrl: result.secure_url }
    console.log("API Route (/api/upload): Upload successful. Sending response payload:", responsePayload)
    // --- End log ---

    return NextResponse.json(responsePayload)
  } catch (error) {
    console.error("Error in POST /api/upload:", error)
    if (error instanceof Error) {
      console.error("Error details:", { message: error.message, stack: error.stack })
    }
    console.error("API Route (/api/upload): Error during upload:", error)
    return NextResponse.json({ error: 'Failed to upload image', details: error instanceof Error ? error.message : 'Unknown error' }, { status: 500 })
  }
} 