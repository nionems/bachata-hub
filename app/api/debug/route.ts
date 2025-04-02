import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Log environment variables (without sensitive values)
    const envCheck = {
      cloudinary: {
        cloudName: !!process.env.CLOUDINARY_CLOUD_NAME,
        apiKey: !!process.env.CLOUDINARY_API_KEY,
        apiSecret: !!process.env.CLOUDINARY_API_SECRET
      },
      resend: {
        apiKey: !!process.env.RESEND_API_KEY,
        adminEmail: !!process.env.ADMIN_EMAIL
      },
      nodeEnv: process.env.NODE_ENV,
      isProduction: process.env.NODE_ENV === 'production',
      runtime: process.env.NEXT_RUNTIME,
      serverRuntime: process.env.NEXT_SERVER_RUNTIME
    }

    return NextResponse.json({
      success: true,
      message: "Debug information",
      data: {
        environment: envCheck,
        timestamp: new Date().toISOString(),
        serverInfo: {
          nodeVersion: process.version,
          platform: process.platform,
          arch: process.arch
        }
      }
    })
  } catch (error) {
    console.error("Debug route error:", error)
    return NextResponse.json({
      success: false,
      message: "Error getting debug information",
      error: error instanceof Error ? error.message : "Unknown error"
    }, { status: 500 })
  }
} 