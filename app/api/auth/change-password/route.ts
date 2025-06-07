import { NextResponse } from 'next/server'

// Hardcoded admin credentials (same as in login route)
const ADMIN_EMAIL = "admin@bachata.au"
const ADMIN_PASSWORD = "admin123"

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Verify current password
    if (currentPassword !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // In a real application, you would update the password in a secure database
    // For now, we'll just return a success message
    return NextResponse.json({ 
      success: true,
      message: 'Password changed successfully' 
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
} 