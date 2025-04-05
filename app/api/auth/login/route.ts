import { NextResponse } from 'next/server'

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@bachata.au"
const ADMIN_PASSWORD = "admin123"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Set a cookie to maintain the session
      const response = NextResponse.json({ success: true })
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        maxAge: 60 * 60 * 24 // 24 hours
      })
      return response
    }

    return NextResponse.json(
      { error: 'Invalid credentials' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
} 