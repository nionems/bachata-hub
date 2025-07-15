const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
  // Add your Firebase config here
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Normalize dance styles from old string format to new array format
 */
function normalizeDanceStyles(danceStyles) {
  if (!danceStyles) return [];
  
  if (Array.isArray(danceStyles)) {
    return danceStyles.filter(Boolean);
  }
  
  // Handle old string format
  if (typeof danceStyles === 'string') {
    return danceStyles
      .split(',')
      .map(style => style.trim())
      .filter(Boolean);
  }
  
  return [];
}

/**
 * Migrate dance styles from string to array format
 */
async function migrateDanceStyles() {
  try {
    console.log('Starting dance styles migration...');
    
    // Get all events
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const eventData = docSnapshot.data();
      const oldDanceStyles = eventData.danceStyles;
      const newDanceStyles = normalizeDanceStyles(oldDanceStyles);
      
      // Only update if the format has changed
      if (!Array.isArray(oldDanceStyles) || JSON.stringify(oldDanceStyles) !== JSON.stringify(newDanceStyles)) {
        console.log(`Migrating event: ${eventData.name}`);
        console.log(`  Old: ${JSON.stringify(oldDanceStyles)}`);
        console.log(`  New: ${JSON.stringify(newDanceStyles)}`);
        
        await updateDoc(doc(db, 'events', docSnapshot.id), {
          danceStyles: newDanceStyles
        });
        
        updatedCount++;
      } else {
        skippedCount++;
      }
    }
    
    console.log(`Migration completed!`);
    console.log(`  Updated: ${updatedCount} events`);
    console.log(`  Skipped: ${skippedCount} events (already in correct format)`);
    
  } catch (error) {
    console.error('Migration failed:', error);
  }
}

// Run the migration
migrateDanceStyles(); 