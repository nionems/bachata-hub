import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'

export async function POST() {
  try {
    // Clear the cookie
    cookies().delete('isAdmin')
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json(
      { error: 'An error occurred during logout' },
      { status: 500 }
    )
  }
} 