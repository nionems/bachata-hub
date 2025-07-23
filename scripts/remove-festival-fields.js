const admin = require('firebase-admin');
require('dotenv').config({ path: '.env.local' });

// Initialize Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    })
  });
}

const db = admin.firestore();

async function removeFestivalFields() {
  try {
    console.log('Starting migration to remove price, address, and description fields from festivals...');
    
    // Get all festivals
    const festivalsSnapshot = await db.collection('festivals').get();
    
    if (festivalsSnapshot.empty) {
      console.log('No festivals found in database.');
      return;
    }
    
    console.log(`Found ${festivalsSnapshot.size} festivals to update.`);
    
    const batch = db.batch();
    let updateCount = 0;
    
    festivalsSnapshot.forEach((doc) => {
      const festivalData = doc.data();
      
      // Create update object with fields to remove
      const updateData = {};
      
      // Remove the specified fields if they exist
      if (festivalData.hasOwnProperty('price')) {
        updateData.price = admin.firestore.FieldValue.delete();
      }
      if (festivalData.hasOwnProperty('address')) {
        updateData.address = admin.firestore.FieldValue.delete();
      }
      if (festivalData.hasOwnProperty('description')) {
        updateData.description = admin.firestore.FieldValue.delete();
      }
      
      // Only update if there are fields to remove
      if (Object.keys(updateData).length > 0) {
        batch.update(doc.ref, updateData);
        updateCount++;
        console.log(`Marking festival "${festivalData.name}" (${doc.id}) for update`);
      }
    });
    
    if (updateCount > 0) {
      console.log(`Committing ${updateCount} updates...`);
      await batch.commit();
      console.log(`Successfully removed fields from ${updateCount} festivals.`);
    } else {
      console.log('No festivals needed updates.');
    }
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    process.exit(0);
  }
}

// Run the migration
removeFestivalFields(); 