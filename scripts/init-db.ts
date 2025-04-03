import { getFirestore } from 'firebase-admin/firestore'
import { initializeApp, cert } from 'firebase-admin/app'

async function initDatabase() {
  try {
    console.log('Initializing database...')

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
    
    // Create schools collection if it doesn't exist
    const schoolsRef = db.collection('schools')
    const schoolsSnapshot = await schoolsRef.limit(1).get()
    
    if (schoolsSnapshot.empty) {
      console.log('Creating schools collection...')
      // Add a test school to create the collection
      await schoolsRef.add({
        name: 'Test School',
        location: 'Test Location',
        state: 'Test State',
        address: 'Test Address',
        contactInfo: 'Test Contact',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      })
      console.log('Schools collection created successfully')
    } else {
      console.log('Schools collection already exists')
    }
    
    console.log('Database initialization complete')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

initDatabase()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  }) 