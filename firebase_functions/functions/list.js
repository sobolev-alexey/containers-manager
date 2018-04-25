const admin = require('firebase-admin');

module.exports = function(req, res) {
  if (!req.body.statuses) {
    return res.send({ error: 'Bad Input' });
  }

  const ref = admin
    .database()
    .ref('containers')
    .orderByChild('status');

  const promises = [];

  req.body.statuses.forEach(status => {
    const query = ref.equalTo(status);
    promises.push(query.once('value'));
  });

  Promise.all(promises)
    .then(snapshots => {
      const results = [];
      snapshots.forEach(snapshot => {
        const val = snapshot.val();
        if (val) {
          results.push(Object.values(val)[0]);
        }
      });
      return res.send(results);
    })
    .catch(error => {
      res.status(500).send({ error: 'Something went wrong' });
    });
};
