import { initializeApp, cert } from 'firebase-admin/app'
import { getFirestore } from 'firebase-admin/firestore'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config({ path: '.env.local' })

async function initAdmin() {
  try {
    // Initialize Firebase Admin
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    })

    // Get Firestore instance
    const db = getFirestore(app)

    const email = 'admin@bachata.au'
    const password = 'admin123' // This will be the initial password
    const hashedPassword = await bcrypt.hash(password, 10)

    await db.collection('admin').doc('credentials').set({
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('Admin credentials initialized successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing admin credentials:', error)
    process.exit(1)
  }
}

initAdmin() 