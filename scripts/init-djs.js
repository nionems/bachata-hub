const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
require('dotenv').config({ path: '.env.local' })

async function initDJsCollection() {
    try {
        console.log('Initializing DJs collection...')

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
        
        // Create djs collection if it doesn't exist
        const djsRef = db.collection('djs')
        const djsSnapshot = await djsRef.limit(1).get()
        
        if (djsSnapshot.empty) {
            console.log('Creating djs collection...')
            // Add Nohmon as the first DJ
            await djsRef.add({
                name: 'Nohmon',
                location: 'Sydney',
                state: 'NSW',
                contact: '0434047460',
                musicStyles: 'Bachata/Salsa',
                imageUrl: '',  // URL of the uploaded image in Firebase Storage
                comment: 'great fun',
                instagramLink: 'https://www.instagram.com/nohmonsnaps/',
                facebookLink: 'https://www.facebook.com/nohmon.anwaryar',
                emailLink: 'nionems@icloud.com',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            })
            console.log('DJs collection created successfully with Nohmon as the first DJ')
        } else {
            console.log('DJs collection already exists')
        }
        
        console.log('DJs collection initialization complete')
    } catch (error) {
        console.error('Error initializing DJs collection:', error)
        throw error
    }
}

// Run the initialization
initDJsCollection().catch(console.error) 