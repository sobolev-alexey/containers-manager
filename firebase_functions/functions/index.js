const admin = require('firebase-admin');
const functions = require('firebase-functions');
const login = require('./login');
const serviceAccount = require('./service_account.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://container-tracking-simulation.firebaseio.com',
});

exports.login = functions.https.onRequest(login);
