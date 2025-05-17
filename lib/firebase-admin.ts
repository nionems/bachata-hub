import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage, Storage } from 'firebase-admin/storage'

let db: Firestore;
let storage: Storage;
let app: App;

function validateEnvVariables() {
  const requiredEnvVars = {
    FIREBASE_PROJECT_ID: process.env.FIREBASE_PROJECT_ID,
    FIREBASE_CLIENT_EMAIL: process.env.FIREBASE_CLIENT_EMAIL,
    FIREBASE_PRIVATE_KEY: process.env.FIREBASE_PRIVATE_KEY,
  };

  const missingVars = Object.entries(requiredEnvVars)
    .filter(([_, value]) => !value)
    .map(([key]) => key);

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missingVars.join(', ')}. ` +
      'Please check your Vercel environment variables configuration.'
    );
  }

  // Validate project_id format
  if (!/^[a-z0-9-]+$/.test(requiredEnvVars.FIREBASE_PROJECT_ID)) {
    throw new Error('Invalid FIREBASE_PROJECT_ID format');
  }

  // Validate client_email format
  if (!requiredEnvVars.FIREBASE_CLIENT_EMAIL.includes('@')) {
    throw new Error('Invalid FIREBASE_CLIENT_EMAIL format');
  }

  // Validate private_key format
  if (!requiredEnvVars.FIREBASE_PRIVATE_KEY.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid FIREBASE_PRIVATE_KEY format');
  }
}

function initializeFirebaseAdmin() {
  try {
    if (getApps().length === 0) {
      console.log('Initializing Firebase Admin...');
      
      // Validate environment variables first
      validateEnvVariables();

      const privateKey = process.env.FIREBASE_PRIVATE_KEY!.replace(/\\n/g, '\n');
      const projectId = process.env.FIREBASE_PROJECT_ID!;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL!;
      const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

      const serviceAccount = {
        projectId,
        clientEmail,
        privateKey,
      };

      app = initializeApp({
        credential: cert(serviceAccount),
        storageBucket: storageBucket || `${projectId}.appspot.com`,
      });

      console.log('Firebase Admin initialized successfully');
    } else {
      console.log('Using existing Firebase Admin app');
      app = getApps()[0];
    }

    // Initialize Firestore and Storage
    db = getFirestore(app);
    storage = getStorage(app);

    console.log('Firestore and Storage initialized successfully');

    return { app, db, storage };
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    throw error;
  }
}

// Initialize Firebase Admin
const { db: firestoreDb, storage: firestoreStorage } = initializeFirebaseAdmin();

export { firestoreDb as db, firestoreStorage as storage }; 