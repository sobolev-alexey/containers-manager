const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const config = require('./mam/config.json');
const mamFunctions = require('./mam/mamFunctions.js');

module.exports = function(req, res) {
  return cors(req, res, () => {
    const ids = [];
    const results = [];
    const ref = admin.database().ref('containers');
    ref.once('value', snapshots => {
      snapshots.forEach(snapshot => {
        const val = snapshot.val();
        if (val) {
          results.push(val);
          ids.push(Object.values(val)[0]);
        }
      });

      const promises = [];
      const ref2 = admin
        .database()
        .ref('containers')
        .orderByChild('containerId');

      ids.forEach(id => {
        const query = ref2.equalTo(id);
        promises.push(query.once('value'));
      });

      Promise.all(promises)
        .then(snapshots => {
          const promises_update = [];
          snapshots.forEach(async snapshot => {
            const val = snapshot.val();
            if (val) {
              const newData = { ...val };
              const payload = Object.values(newData)[0];

              const containerData = await mamFunctions.fetchChannel(
                payload.mam.root,
                config.secret_key
              );

              const last = containerData[containerData.length - 1];

              const updatedContainerData = { ...last };
              const tempBase =
                updatedContainerData.type !== 'Refrigerated' ? 23.0 : Math.random() > 0.4 ? -10 : 4;
              const temperature = (tempBase + 0.1 * tempBase * (2 * Math.random() - 1)).toFixed(1);

              updatedContainerData.temperature = temperature;
              const newContainerData = await mamFunctions.appendToChannel(
                updatedContainerData,
                payload.mam,
                config.secret_key
              );

              payload.temperature = temperature;
              payload.mam = {
                root: payload.mam.root,
                seed: newContainerData.state.seed,
                next: newContainerData.state.channel.next_root,
                start: newContainerData.state.channel.start,
              };
              promises_update.push(snapshot.ref.update(newData));
            }
          });

          Promise.all(promises_update)
            .then(data => {
              return res.send(data);
            })
            .catch(error => {
              res.status(500).send({ error: 'Something went very wrong' });
            });
        })
        .catch(error => {
          res.status(500).send({ error: 'Something went wrong' });
        });
    });
  });
};

const retrieveContainerChannel = (root, key) => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const channel = await mamFunctions.fetchChannel(root, key);
      return resolve(channel);
    } catch (error) {
      return reject(error);
    }
  });

  return promise;
};
