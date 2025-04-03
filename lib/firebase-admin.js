"use strict";
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.storage = exports.db = void 0;
var app_1 = require("firebase-admin/app");
var firestore_1 = require("firebase-admin/firestore");
var storage_1 = require("firebase-admin/storage");
// Initialize Firebase Admin
var app;
var db;
var storage;
try {
    if ((0, app_1.getApps)().length === 0) {
        app = (0, app_1.initializeApp)({
            credential: (0, app_1.cert)({
                projectId: process.env.FIREBASE_PROJECT_ID,
                clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
                privateKey: (_a = process.env.FIREBASE_PRIVATE_KEY) === null || _a === void 0 ? void 0 : _a.replace(/\\n/g, '\n'),
            }),
        });
        console.log('Firebase Admin initialized');
    }
    else {
        app = (0, app_1.getApps)()[0];
    }
    exports.db = db = (0, firestore_1.getFirestore)(app);
    console.log('Firestore Admin initialized');
    exports.storage = storage = (0, storage_1.getStorage)(app);
    console.log('Storage initialized');
}
catch (error) {
    console.error('Error initializing Firebase Admin:', error);
    if (error instanceof Error) {
        console.error('Error details:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });
    }
    throw error;
}
