const { initializeApp, cert } = require('firebase-admin/app')
const { getFirestore } = require('firebase-admin/firestore')
require('dotenv').config({ path: '.env.local' })

// Initialize Firebase Admin
const app = initializeApp({
  credential: cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  }),
})

const db = getFirestore(app)

async function setAllEventsPublished() {
  try {
    console.log('Fetching all events...');
    
    // Get all events from the events collection
    const eventsSnapshot = await db.collection('events').get();
    
    if (eventsSnapshot.empty) {
      console.log('No events found in the database.');
      return;
    }
    
    console.log(`Found ${eventsSnapshot.size} events. Updating them to published...`);
    
    // Update each event to set published: true
    const batch = db.batch();
    let updateCount = 0;
    
    eventsSnapshot.forEach((doc) => {
      const eventData = doc.data();
      
      // Only update if published field doesn't exist or is false
      if (!eventData.published || eventData.published === false) {
        batch.update(doc.ref, { published: true });
        updateCount++;
        console.log(`Marking event "${eventData.name}" for update`);
      } else {
        console.log(`Event "${eventData.name}" is already published, skipping`);
      }
    });
    
    if (updateCount > 0) {
      console.log(`Committing ${updateCount} updates...`);
      await batch.commit();
      console.log(`Successfully updated ${updateCount} events to published status.`);
    } else {
      console.log('All events are already published.');
    }
    
  } catch (error) {
    console.error('Error updating events:', error);
  } finally {
    process.exit(0);
  }
}

setAllEventsPublished(); 