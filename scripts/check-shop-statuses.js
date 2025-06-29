const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkShopStatuses() {
  try {
    console.log('Checking shop statuses...');
    
    const shopsSnapshot = await getDocs(collection(db, 'shops'));
    const shops = shopsSnapshot.docs.map(doc => ({
      id: doc.id,
      name: doc.data().name,
      status: doc.data().status || 'NO STATUS'
    }));

    console.log(`\nTotal shops: ${shops.length}`);
    
    const statusCounts = {};
    shops.forEach(shop => {
      statusCounts[shop.status] = (statusCounts[shop.status] || 0) + 1;
    });

    console.log('\nStatus breakdown:');
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count} shops`);
    });

    console.log('\nShops without status:');
    shops.filter(shop => shop.status === 'NO STATUS').forEach(shop => {
      console.log(`  - ${shop.name} (ID: ${shop.id})`);
    });

    console.log('\nApproved shops:');
    shops.filter(shop => shop.status === 'approved').forEach(shop => {
      console.log(`  - ${shop.name} (ID: ${shop.id})`);
    });

    console.log('\nPending shops:');
    shops.filter(shop => shop.status === 'pending').forEach(shop => {
      console.log(`  - ${shop.name} (ID: ${shop.id})`);
    });

    console.log('\nRejected shops:');
    shops.filter(shop => shop.status === 'rejected').forEach(shop => {
      console.log(`  - ${shop.name} (ID: ${shop.id})`);
    });

  } catch (error) {
    console.error('Error checking shop statuses:', error);
  }
}

checkShopStatuses(); 