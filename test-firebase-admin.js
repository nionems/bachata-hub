const { getDb, getStorage } = require('./lib/firebase-admin.ts');

console.log('getDb function:', typeof getDb);
console.log('getStorage function:', typeof getStorage);

if (typeof getDb === 'function') {
  console.log('✅ getDb is exported correctly');
} else {
  console.log('❌ getDb is not a function');
}

if (typeof getStorage === 'function') {
  console.log('✅ getStorage is exported correctly');
} else {
  console.log('❌ getStorage is not a function');
} 