"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStorage = exports.getDb = void 0;
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore");
var storage_1 = require("firebase-admin/storage");

// Initialize Firebase Admin only once
let firestoreDb = null;
let firestoreStorage = null;

function initializeFirebaseAdmin() {
  try {
    if ((0, app_1.getApps)().length === 0) {
      console.log('Initializing Firebase Admin...');
      
      const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
      };

      const app = (0, app_1.initializeApp)({
        credential: (0, app_1.cert)(serviceAccount),
        storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || `${process.env.FIREBASE_PROJECT_ID}.appspot.com`,
      });

      console.log('Firebase Admin initialized successfully');
      return app;
    } else {
      console.log('Using existing Firebase Admin app');
      return (0, app_1.getApps)()[0];
    }
  } catch (error) {
    console.error('Firebase Admin initialization error:', error);
    throw error;
  }
}

// Export functions that get the instances when needed
function getDb() {
  if (!firestoreDb) {
    const app = initializeFirebaseAdmin();
    firestoreDb = (0, firestore_1.getFirestore)(app);
  }
  return firestoreDb;
}

function getStorage() {
  if (!firestoreStorage) {
    const app = initializeFirebaseAdmin();
    firestoreStorage = (0, storage_1.getStorage)(app);
  }
  return firestoreStorage;
}

exports.getDb = getDb;
exports.getStorage = getStorage;
