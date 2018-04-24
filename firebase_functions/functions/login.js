const admin = require('firebase-admin');

// To test this locally, run
// > firebase functions:shell

// Then call a funcion with parameters
// > login.post('/login').form( {username: 'user123', password: 'password123' })

module.exports = function(req, res) {
  if (!req.body.username || !req.body.password) {
    return res.send({ error: 'Bad Input' });
  }

  admin
    .database()
    .ref(`users/${req.body.username}`)
    .once('value')
    .then(snapshot => {
      const val = snapshot.val();
      if (val.password === req.body.password) {
        return res.send(val);
      } else {
        return res.status(403).send({ error: 'Wrong password' });
      }
    })
    .catch(error => {
      res.status(500).send({ error: 'User not found' });
    });
};
