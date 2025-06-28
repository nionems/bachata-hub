const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: 'bachatahub',
  authDomain: 'bachatahub.firebaseapp.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getDJsWithoutEmails() {
  try {
    console.log('Fetching DJs without emails...\n');
    
    const djsRef = collection(db, 'djs');
    const snapshot = await getDocs(djsRef);
    
    if (snapshot.empty) {
      console.log('No DJs found in the database.');
      return;
    }
    
    const djsWithoutEmails = snapshot.docs
      .map(doc => doc.data())
      .filter(dj => !dj.emailLink || dj.emailLink === '')
      .map(dj => dj.name)
      .filter(name => name && name.trim() !== '');
    
    console.log('DJs without email addresses:');
    console.log('=============================\n');
    
    djsWithoutEmails.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    console.log(`\nTotal DJs without emails: ${djsWithoutEmails.length}`);
    console.log(`Total DJs in database: ${snapshot.docs.length}`);
    
  } catch (error) {
    console.error('Error fetching DJ data:', error);
  }
}

getDJsWithoutEmails(); 