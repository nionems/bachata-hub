import { NextResponse } from 'next/server'

// Hardcoded admin credentials
const ADMIN_EMAIL = "admin@bachata.au"
const ADMIN_PASSWORD = "admin123"

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    // Check if credentials match
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      // Create successful response
      const response = NextResponse.json({ 
        success: true,
        message: 'Login successful' 
      })
      
      // Set the admin session cookie
      response.cookies.set('admin_session', 'true', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        maxAge: 60 * 60 * 24 // 24 hours
      })

      return response
    }

    // If credentials don't match
    return NextResponse.json(
      { error: 'Invalid email or password' },
      { status: 401 }
    )
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    )
  }
} 