const admin = require('firebase-admin');

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
        delete val.password;
        return res.send(val);
      } else {
        return res.status(403).send({ error: 'Wrong password' });
      }
    })
    .catch(error => {
      res.status(500).send({ error: 'User not found' });
    });
};
