import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json({
    hasApiKey: !!process.env.GOOGLE_API_KEY,
    apiKeyFirstChars: process.env.GOOGLE_API_KEY ? `${process.env.GOOGLE_API_KEY.substring(0, 5)}...` : null,
    nodeEnv: process.env.NODE_ENV,
    vercelEnv: process.env.VERCEL_ENV,
  })
}
