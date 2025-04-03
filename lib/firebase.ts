import { initializeApp, getApps, getApp } from 'firebase/app'
import { getFirestore, Firestore } from 'firebase/firestore'
import { getStorage, FirebaseStorage } from 'firebase/storage'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
}

// Initialize Firebase
let app
let db: Firestore
let storage: FirebaseStorage

try {
  if (!firebaseConfig.apiKey) {
    throw new Error('Firebase API key is missing')
  }
  if (!firebaseConfig.projectId) {
    throw new Error('Firebase project ID is missing')
  }
  if (!firebaseConfig.storageBucket) {
    throw new Error('Firebase Storage bucket is missing')
  }

  // Initialize Firebase app if it hasn't been initialized
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig)
    console.log('Firebase app initialized')
  } else {
    app = getApp()
    console.log('Using existing Firebase app')
  }

  // Initialize Firestore
  db = getFirestore(app)
  console.log('Firestore initialized')

  // Initialize Storage with explicit bucket URL
  const bucketUrl = `gs://${firebaseConfig.storageBucket}`
  storage = getStorage(app, bucketUrl)
  console.log('Storage initialized with bucket:', bucketUrl)
} catch (error) {
  console.error('Error initializing Firebase:', error)
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