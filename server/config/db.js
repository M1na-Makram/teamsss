const admin = require('./firebase');

const db = admin.firestore();

let rtdb;
try {
  rtdb = admin.database();
} catch (e) {
  console.warn('Realtime Database could not be initialized:', e.message);
}

module.exports = {
  db,
  rtdb
};
