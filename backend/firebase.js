const admin = require('firebase-admin');

const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://bus-ticket-system-86868.firebaseapp.com"
});

const db = admin.firestore();

module.exports = { admin, db };
