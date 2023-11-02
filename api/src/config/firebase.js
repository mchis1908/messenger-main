var admin = require("firebase-admin");
var { getFirestore } = require("firebase-admin/firestore");

var serviceAccount = require("../../creds.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://talk-time-23c0d-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = getFirestore();
module.exports = { db };