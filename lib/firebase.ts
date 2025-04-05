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

// Add this before the try block
console.log('Firebase Config:', {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY ? 'Set' : 'Missing',
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN ? 'Set' : 'Missing',
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ? 'Set' : 'Missing',
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET ? 'Set' : 'Missing',
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID ? 'Set' : 'Missing',
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID ? 'Set' : 'Missing'
});

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
  const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
  console.log('Firebase app initialized')

  // Initialize Firestore
  db = getFirestore(app)
  console.log('Firestore initialized')

  // Initialize Storage
  storage = getStorage(app);
  console.log('Storage initialized successfully')
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