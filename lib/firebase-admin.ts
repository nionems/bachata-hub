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

  // At this point, we know all required variables are defined
  const projectId = requiredEnvVars.FIREBASE_PROJECT_ID as string;
  const clientEmail = requiredEnvVars.FIREBASE_CLIENT_EMAIL as string;
  const privateKey = requiredEnvVars.FIREBASE_PRIVATE_KEY as string;

  // Validate project_id format
  if (!/^[a-z0-9-]+$/.test(projectId)) {
    throw new Error('Invalid FIREBASE_PROJECT_ID format');
  }

  // Validate client_email format
  if (!clientEmail.includes('@')) {
    throw new Error('Invalid FIREBASE_CLIENT_EMAIL format');
  }

  // Validate private_key format
  if (!privateKey.includes('-----BEGIN PRIVATE KEY-----')) {
    throw new Error('Invalid FIREBASE_PRIVATE_KEY format');
  }

  return { projectId, clientEmail, privateKey };
}

function initializeFirebaseAdmin() {
  try {
    if (getApps().length === 0) {
      console.log('Initializing Firebase Admin...');
      
      // Validate environment variables first and get validated values
      const { projectId, clientEmail, privateKey } = validateEnvVariables();
      const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

      const serviceAccount = {
        projectId,
        clientEmail,
        privateKey: privateKey.replace(/\\n/g, '\n'),
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

// Initialize Firebase Admin only once
let firestoreDb: Firestore | null = null;
let firestoreStorage: Storage | null = null;

try {
  const { db, storage } = initializeFirebaseAdmin();
  firestoreDb = db;
  firestoreStorage = storage;
} catch (error) {
  console.error('Failed to initialize Firebase Admin:', error);
  // Don't throw error, just log it and continue with null values
}

export { firestoreDb as db, firestoreStorage as storage }; 