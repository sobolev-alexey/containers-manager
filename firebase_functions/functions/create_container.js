const admin = require('firebase-admin');
const crypto = require('crypto');
const mamFunctions = require('./mam/mamFunctions.js');

module.exports = function(req, res) {
  // Verify the user provided a container ID
  if (!req.body.container || !req.body.departure) {
    return res.send({ error: 'Bad Input' });
  }

  const containerId = req.body.container.replace(/[^0-9a-zA-Z_-]/g, '');
  // create reference
  const containersRef = admin.database().ref(`${req.body.departure}/containers/${containerId}`);

  containersRef
    .once('value')
    .then(snapshot => {
      if (snapshot.val() === null) {
        createContainerChannel(req, res, containerId, containersRef);
      } else {
        return res.send({
          text: 'Already exists',
          shipper: snapshot.val().shipper,
        });
      }
    })
    .catch(error => {
      console.log('Error getting message details', error.message);
      res.sendStatus(500);
    });
};

const createContainerChannel = (req, res, containerId, containersRef) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const { departure, destination, load, type, shipper, containerId } = req.body;
      // Format the container ID to remove dashes and parens
      const timestamp = Date.now();
      const secretKey = keyGen(81);
      const channel = await mamFunctions.createNewChannel(
        {
          containerId,
          departure,
          destination,
          load,
          shipper,
          type,
          timestamp,
        },
        secretKey
      );

      // Create a new container entry using that container ID
      await containersRef.set({
        containerId,
        timestamp,
        secretKey,
        mam: {
          root: channel.root,
          seed: channel.state.seed,
          next: channel.state.channel.next_root,
          start: channel.state.channel.start,
        },
      });

      return resolve(res.send({ success: containerId, channel }));
    } catch (error) {
      return reject(error);
    }
  });

  return promise;
};

const keyGen = length => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ9';
  const values = crypto.randomBytes(length);
  return Array.from(new Array(length), (x, i) => charset[values[i] % charset.length]).join('');
};
