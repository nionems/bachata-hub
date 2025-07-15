const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, doc, updateDoc } = require('firebase/firestore');

// Your Firebase config
const firebaseConfig = {
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

// Valid dance styles from constants
const VALID_DANCE_STYLES = [
  'Bachata',
  'Salsa', 
  'Kizomba',
  'Zouk',
  'Reaggeaton',
  'Heels',
  'Pole Dance',
  'Latin Beat'
];

/**
 * Clean dance styles - remove old string values and keep only valid ones
 */
function cleanDanceStyles(danceStyles) {
  if (!danceStyles) return [];
  
  if (Array.isArray(danceStyles)) {
    // Filter to only keep valid dance styles
    return danceStyles.filter(style => 
      VALID_DANCE_STYLES.includes(style)
    );
  }
  
  // If it's a string, return empty array (remove old string format)
  if (typeof danceStyles === 'string') {
    return [];
  }
  
  return [];
}

/**
 * Clean dance styles from all events
 */
async function cleanDanceStylesFromEvents() {
  try {
    console.log('Starting dance styles cleanup...');
    console.log('Valid dance styles:', VALID_DANCE_STYLES);
    
    // Get all events
    const eventsRef = collection(db, 'events');
    const snapshot = await getDocs(eventsRef);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const docSnapshot of snapshot.docs) {
      const eventData = docSnapshot.data();
      const oldDanceStyles = eventData.danceStyles;
      const cleanedDanceStyles = cleanDanceStyles(oldDanceStyles);
      
      console.log(`\nEvent: ${eventData.name}`);
      console.log(`  Old dance styles: ${JSON.stringify(oldDanceStyles)}`);
      console.log(`  Cleaned dance styles: ${JSON.stringify(cleanedDanceStyles)}`);
      
      // Update if there are changes
      if (JSON.stringify(oldDanceStyles) !== JSON.stringify(cleanedDanceStyles)) {
        console.log(`  → Updating event...`);
        
        await updateDoc(doc(db, 'events', docSnapshot.id), {
          danceStyles: cleanedDanceStyles
        });
        
        updatedCount++;
      } else {
        console.log(`  → No changes needed`);
        skippedCount++;
      }
    }
    
    console.log(`\nCleanup completed!`);
    console.log(`  Updated: ${updatedCount} events`);
    console.log(`  Skipped: ${skippedCount} events (already clean)`);
    
  } catch (error) {
    console.error('Cleanup failed:', error);
  }
}

// Run the cleanup
cleanDanceStylesFromEvents(); 