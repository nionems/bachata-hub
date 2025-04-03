import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage } from 'firebase-admin/storage'

// Initialize Firebase Admin
let app
let db: Firestore
let storage

try {
  if (getApps().length === 0) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
    if (!privateKey) {
      throw new Error('Firebase private key is missing')
    }

    app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
      storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    })
    console.log('Firebase Admin initialized')
  } else {
    app = getApps()[0]
  }

  db = getFirestore(app)
  console.log('Firestore Admin initialized')

  storage = getStorage(app)
  console.log('Storage initialized')
} catch (error) {
  console.error('Error initializing Firebase Admin:', error)
  if (error instanceof Error) {
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    })
  }
  throw error
}

export { db, storage } 