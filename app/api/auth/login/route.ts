import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import bcrypt from 'bcryptjs'
import { cookies } from 'next/headers'

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json()

    const db = getDb()
    // Get admin credentials from Firestore
    const adminDoc = await db.collection('admin').doc('credentials').get()
    
    if (!adminDoc.exists) {
      return NextResponse.json(
        { error: 'Admin configuration not found' },
        { status: 404 }
      )
    }

    const adminData = adminDoc.data()

    // Verify email and password
    if (email !== adminData?.email || !(await bcrypt.compare(password, adminData?.password))) {
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      )
    }

    // Set admin session cookie
    cookies().set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 // 24 hours
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Login failed' },
      { status: 500 }
    )
  }
} 