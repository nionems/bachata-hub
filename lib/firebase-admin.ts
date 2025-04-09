import { initializeApp, getApps, cert, App } from 'firebase-admin/app'
import { getFirestore, Firestore } from 'firebase-admin/firestore'
import { getStorage, Storage } from 'firebase-admin/storage'

let db: Firestore;
let storage: Storage;
let app: App;

console.log('Attempting Firebase Admin initialization (direct export)...');
try {
    if (getApps().length === 0) {
        console.log('No existing Firebase Admin apps found. Initializing new one.');
        const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
        const projectId = process.env.FIREBASE_PROJECT_ID;
        const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
        const storageBucket = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET;

        if (!privateKey || !projectId || !clientEmail) {
            console.error('Missing Firebase Admin credentials:', {
                hasPrivateKey: !!privateKey,
                hasProjectId: !!projectId,
                hasClientEmail: !!clientEmail,
            });
            throw new Error('Firebase Admin credentials are missing in environment variables.');
        }
        if (!storageBucket) {
             console.warn('Missing storage bucket env var (NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET). Storage functionality might be limited.');
        }

        app = initializeApp({
            credential: cert({
                projectId: projectId,
                clientEmail: clientEmail,
                privateKey: privateKey,
            }),
            storageBucket: storageBucket,
        });
        console.log('Firebase Admin app initialized successfully.');
    } else {
        console.log('Using existing Firebase Admin app.');
        app = getApps()[0];
        if (!app) {
            throw new Error("getApps()[0] returned undefined unexpectedly.");
        }
    }

    db = getFirestore(app);
    storage = getStorage(app);
    console.log('Firestore Admin instance obtained successfully.');
    console.log('Storage Admin instance obtained successfully.');

    if (!db) {
        throw new Error("Failed to get Firestore instance after app initialization.");
    }
     if (!storage) {
        throw new Error("Failed to get Storage instance after app initialization.");
    }

} catch (error) {
    console.error('CRITICAL Error during Firebase Admin initialization:', error);
    if (error instanceof Error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
    }
    // Attempting to assign undefined or re-throw might cause issues depending on import timing.
    // Let consuming modules handle the potential undefined state if needed, or rely on build failure.
    // db = undefined as any; // Avoid assigning undefined if possible
    // storage = undefined as any;
    throw new Error(`Firebase Admin initialization failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
}

export { db, storage }; // Directly export the initialized instances 