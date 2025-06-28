const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  projectId: 'bachatahub',
  authDomain: 'bachatahub.firebaseapp.com'
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function getInstructorsWithoutEmails() {
  try {
    console.log('Fetching instructors without emails...\n');
    
    const instructorsRef = collection(db, 'instructors');
    const snapshot = await getDocs(instructorsRef);
    
    if (snapshot.empty) {
      console.log('No instructors found in the database.');
      return;
    }
    
    const instructorsWithoutEmails = snapshot.docs
      .map(doc => doc.data())
      .filter(instructor => !instructor.emailLink || instructor.emailLink === '')
      .map(instructor => instructor.name)
      .filter(name => name && name.trim() !== '');
    
    console.log('Instructors without email addresses:');
    console.log('=====================================\n');
    
    instructorsWithoutEmails.forEach((name, index) => {
      console.log(`${index + 1}. ${name}`);
    });
    
    console.log(`\nTotal instructors without emails: ${instructorsWithoutEmails.length}`);
    console.log(`Total instructors in database: ${snapshot.docs.length}`);
    
  } catch (error) {
    console.error('Error fetching instructor data:', error);
  }
}

getInstructorsWithoutEmails(); 