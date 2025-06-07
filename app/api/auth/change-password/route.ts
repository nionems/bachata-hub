import { NextResponse } from 'next/server'
import { db } from '@/firebase/config'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    const { currentPassword, newPassword } = await request.json()

    // Get admin credentials from Firestore
    const adminDoc = await getDoc(doc(db, 'admin', 'credentials'))
    
    if (!adminDoc.exists()) {
      return NextResponse.json(
        { error: 'Admin configuration not found' },
        { status: 404 }
      )
    }

    const adminData = adminDoc.data()
    
    // Verify current password
    const isPasswordValid = await bcrypt.compare(currentPassword, adminData.password)
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update the password in Firestore
    await updateDoc(doc(db, 'admin', 'credentials'), {
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