const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: 'bachatahub',
  authDomain: 'bachatahub.firebaseapp.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function checkShopInfo() {
  try {
    console.log('Checking shop info data...\n');
    
    const shopsRef = collection(db, 'shops');
    const snapshot = await getDocs(shopsRef);
    
    if (snapshot.empty) {
      console.log('No shops found in the database.');
      return;
    }
    
    console.log('Shop Info Data:');
    console.log('================\n');
    
    let shopsWithInfo = 0;
    let totalShops = 0;
    
    snapshot.docs.forEach((doc, index) => {
      const data = doc.data();
      totalShops++;
      
      console.log(`${index + 1}. ${data.name || 'No name'}`);
      console.log(`   Info: ${data.info || 'No info'}`);
      console.log(`   Info length: ${data.info ? data.info.length : 0} characters`);
      console.log(`   Location: ${data.location || 'No location'}, ${data.state || 'No state'}`);
      console.log(`   Condition: ${data.condition || 'No condition'}`);
      console.log(`   Price: ${data.price || 'No price'}`);
      console.log('');
      
      if (data.info && data.info.trim() !== '') {
        shopsWithInfo++;
      }
    });
    
    console.log(`\nSummary:`);
    console.log(`Total shops: ${totalShops}`);
    console.log(`Shops with info: ${shopsWithInfo}`);
    console.log(`Shops without info: ${totalShops - shopsWithInfo}`);
    
  } catch (error) {
    console.error('Error checking shop data:', error);
  }
}

checkShopInfo(); 