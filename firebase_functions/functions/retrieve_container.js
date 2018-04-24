const admin = require('firebase-admin');
const mamFunctions = require('./mam/mamFunctions.js');

module.exports = function(req, res) {
  // Verify the user provided a container ID
  if (!req.body.container || !req.body.departure) {
    return res.send({ error: 'Bad Input' });
  }

  // Format the container ID to remove dashes and parens
  const container = req.body.container.replace(/[^0-9a-zA-Z_-]/g, '');

  admin.database().ref(`${req.body.departure}/containers/${container}`).on('value', snapshot => {
    const val = snapshot.val();
    if (val) {
      retrieveContainerChannel(val.mam.root, res)
    } else {
      return res.send({ error: 'Something wrong' })
    }
  })
}

const retrieveContainerChannel = (root, res) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const channel = await mamFunctions.fetch(root);
      return resolve(res.send({ success: channel }));
    } catch (error) {
      return reject(res.send({ error, root }));
    }
  });

  return promise
}
