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

// Dance styles to add to shops
const DANCE_STYLES = [
  'Bachata',
  'Salsa',
  'Kizomba',
  'Zouk',
  'Latin Beat',
  'HipHop',
  'Mambo',
  'Dominican Bachata',
  'Sensual Bachata',
  'Bachata Moderna',
  'Cuban Salsa',
  'Chacha',
  'Rumba',
  'Merengue',
  'Tango',
  'Afrobeats',
  'Taraxo',
  'Choreography',
  'Ballroom',
  'Twerk',
  'Jazz',
  'Contemporary',
  'Bachazouk',
  'Bachata Influence',
  'All'
];

// Function to determine dance styles based on shop info
function determineDanceStyles(shop) {
  const info = (shop.info || '').toLowerCase();
  const name = (shop.name || '').toLowerCase();
  const comment = (shop.comment || '').toLowerCase();
  
  const danceStyles = [];
  
  // Check for specific dance styles in the text
  if (info.includes('bachata') || name.includes('bachata')) {
    danceStyles.push('Bachata');
  }
  if (info.includes('salsa') || name.includes('salsa')) {
    danceStyles.push('Salsa');
  }
  if (info.includes('kizomba') || name.includes('kizomba')) {
    danceStyles.push('Kizomba');
  }
  if (info.includes('zouk') || name.includes('zouk')) {
    danceStyles.push('Zouk');
  }
  if (info.includes('latin') || name.includes('latin')) {
    danceStyles.push('Latin Beat');
  }
  if (info.includes('hip hop') || info.includes('hiphop') || name.includes('hip hop') || name.includes('hiphop')) {
    danceStyles.push('HipHop');
  }
  if (info.includes('mambo') || name.includes('mambo')) {
    danceStyles.push('Mambo');
  }
  if (info.includes('dominican') || name.includes('dominican')) {
    danceStyles.push('Dominican Bachata');
  }
  if (info.includes('sensual') || name.includes('sensual')) {
    danceStyles.push('Sensual Bachata');
  }
  if (info.includes('moderna') || name.includes('moderna')) {
    danceStyles.push('Bachata Moderna');
  }
  if (info.includes('cuban') || name.includes('cuban')) {
    danceStyles.push('Cuban Salsa');
  }
  if (info.includes('chacha') || info.includes('cha cha') || name.includes('chacha') || name.includes('cha cha')) {
    danceStyles.push('Chacha');
  }
  if (info.includes('rumba') || name.includes('rumba')) {
    danceStyles.push('Rumba');
  }
  if (info.includes('merengue') || name.includes('merengue')) {
    danceStyles.push('Merengue');
  }
  if (info.includes('tango') || name.includes('tango')) {
    danceStyles.push('Tango');
  }
  if (info.includes('afrobeats') || name.includes('afrobeats')) {
    danceStyles.push('Afrobeats');
  }
  if (info.includes('taraxo') || name.includes('taraxo')) {
    danceStyles.push('Taraxo');
  }
  if (info.includes('choreography') || name.includes('choreography')) {
    danceStyles.push('Choreography');
  }
  if (info.includes('ballroom') || name.includes('ballroom')) {
    danceStyles.push('Ballroom');
  }
  if (info.includes('twerk') || name.includes('twerk')) {
    danceStyles.push('Twerk');
  }
  if (info.includes('jazz') || name.includes('jazz')) {
    danceStyles.push('Jazz');
  }
  if (info.includes('contemporary') || name.includes('contemporary')) {
    danceStyles.push('Contemporary');
  }
  if (info.includes('bachazouk') || name.includes('bachazouk')) {
    danceStyles.push('Bachazouk');
  }
  if (info.includes('influence') || name.includes('influence')) {
    danceStyles.push('Bachata Influence');
  }
  
  // If no specific styles found, add general ones based on the type of item
  if (danceStyles.length === 0) {
    if (info.includes('heel') || name.includes('heel') || info.includes('dance shoe') || name.includes('dance shoe')) {
      // Dance shoes are typically for Latin dances
      danceStyles.push('Bachata', 'Salsa', 'Latin Beat');
    } else if (info.includes('tee') || name.includes('tee') || info.includes('shirt') || name.includes('shirt')) {
      // Clothing items are more general
      danceStyles.push('All');
    } else {
      // Default to general Latin dances
      danceStyles.push('Bachata', 'Salsa', 'Latin Beat');
    }
  }
  
  return danceStyles;
}

async function migrateShopDanceStyles() {
  try {
    console.log('Starting shop dance styles migration...');
    
    // Get all shops
    const shopsSnapshot = await db.collection('shops').get();
    
    if (shopsSnapshot.empty) {
      console.log('No shops found in database.');
      return;
    }
    
    console.log(`Found ${shopsSnapshot.size} shops to migrate.`);
    
    let updatedCount = 0;
    let skippedCount = 0;
    
    for (const doc of shopsSnapshot.docs) {
      const shop = doc.data();
      const shopId = doc.id;
      
      console.log(`\nProcessing shop: ${shop.name} (ID: ${shopId})`);
      
      // Check if shop already has dance styles
      if (shop.danceStyles && Array.isArray(shop.danceStyles) && shop.danceStyles.length > 0) {
        console.log(`  - Shop already has dance styles: ${shop.danceStyles.join(', ')}`);
        skippedCount++;
        continue;
      }
      
      // Determine dance styles based on shop info
      const danceStyles = determineDanceStyles(shop);
      
      console.log(`  - Determined dance styles: ${danceStyles.join(', ')}`);
      
      // Update the shop with dance styles
      await db.collection('shops').doc(shopId).update({
        danceStyles: danceStyles,
        updatedAt: new Date().toISOString()
      });
      
      console.log(`  - ✅ Updated shop with dance styles`);
      updatedCount++;
    }
    
    console.log(`\nMigration completed!`);
    console.log(`- Updated: ${updatedCount} shops`);
    console.log(`- Skipped: ${skippedCount} shops (already had dance styles)`);
    
  } catch (error) {
    console.error('Error during migration:', error);
  } finally {
    process.exit(0);
  }
}

// Run the migration
migrateShopDanceStyles(); 