import { initializeApp, getApps, cert } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage as getFirebaseStorage, Storage } from 'firebase-admin/storage'

// Initialize Firebase Admin only once
let firestoreDb: Firestore | null = null;
let firestoreStorage: Storage | null = null;

function initializeFirebaseAdmin() {
  try {
    if (getApps().length === 0) {
      console.log('Initializing Firebase Admin...');
      
      // Validate environment variables
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      const privateKey = process.env.FIREBASE_PRIVATE_KEY;
      
      if (!projectId) {
        throw new Error('FIREBASE_PROJECT_ID environment variable is not set');
      }
      if (!clientEmail) {
        throw new Error('FIREBASE_CLIENT_EMAIL environment variable is not set');
      }
      if (!privateKey) {
        throw new Error('FIREBASE_PRIVATE_KEY environment variable is not set');
      }
      
      console.log('Firebase Admin environment variables validated');
      
      const serviceAccount = {
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
      };

      const app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${projectId}.appspot.com`,
      });

      console.log('Firebase Admin initialized successfully');
      return app;
    } else {
      console.log('Using existing Firebase Admin app');
      return getApps()[0];
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

// Export functions that get the instances when needed
export const getDb = (): Firestore => {
  if (!firestoreDb) {
    const app = initializeFirebaseAdmin();
    firestoreDb = getFirestore(app);
  }
  return firestoreDb;
}

export const getStorage = (): Storage => {
  if (!firestoreStorage) {
    const app = initializeFirebaseAdmin();
    firestoreStorage = getFirebaseStorage(app);
  }
  return firestoreStorage;
} 