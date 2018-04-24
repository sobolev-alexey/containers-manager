const admin = require('firebase-admin');
const functions = require('firebase-functions');
const serviceAccount = require('./service_account.json');
const login = require('./login');
const list = require('./list');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://container-tracking-simulation.firebaseio.com',
});

exports.login = functions.https.onRequest(login);
exports.list = functions.https.onRequest(list);
