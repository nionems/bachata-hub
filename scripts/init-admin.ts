import { db } from '../firebase/config'
import { doc, setDoc } from 'firebase/firestore'
import bcrypt from 'bcryptjs'

async function initAdmin() {
  try {
    const email = 'admin@bachata.au'
    const password = 'admin123' // This will be the initial password
    const hashedPassword = await bcrypt.hash(password, 10)

    await setDoc(doc(db, 'admin', 'credentials'), {
      email,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date()
    })

    console.log('Admin credentials initialized successfully')
    process.exit(0)
  } catch (error) {
    console.error('Error initializing admin credentials:', error)
    process.exit(1)
  }
}

initAdmin() 