import { NextResponse } from 'next/server'
import { getDb } from '@/lib/firebase-admin'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

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
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, adminData?.password || '')
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the password in Firestore
    await db.collection('admin').doc('credentials').update({
      password: hashedPassword,
      updatedAt: new Date()
    })

    return NextResponse.json({ 
      success: true,
      message: 'Password changed successfully' 
    })
  } catch (error) {
    console.error('Error changing password:', error)
    return NextResponse.json(
      { error: 'Failed to change password' },
      { status: 500 }
    )
  }
} 