const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const config = require('./mam/config.json');
const mamFunctions = require('./mam/mamFunctions.js');

module.exports = function(req, res) {
  return cors(req, res, () => {
    admin
      .database()
      .ref(`containers/4`)
      .once('value')
      .then(async snapshot => {
        const val = snapshot.val();
        if (val) {
          const payload = { ...val };
          const containerData = await mamFunctions.fetchChannel(
            payload.mam.root,
            config.secret_key
          );

          const last = containerData[containerData.length - 1];
          const updatedContainerData = { ...last };
          const randomTemperature =
            updatedContainerData.type !== 'Refrigerated' ? 23.0 : Math.random() > 0.4 ? -10 : 4;
          const tempBase = Number(last.temperature) || randomTemperature;
          const temperature = (tempBase + 0.1 * tempBase * (2 * Math.random() - 1)).toFixed(1);

          updatedContainerData.temperature = temperature;

          const newContainerData = await mamFunctions.appendToChannel(
            updatedContainerData,
            payload.mam,
            config.secret_key
          );

          payload.mam = {
            root: payload.mam.root,
            seed: newContainerData.state.seed,
            next: newContainerData.state.channel.next_root,
            start: newContainerData.state.channel.start,
          };

          snapshot.ref.update(payload);
        }
      })
      .catch(error => {
        res.status(500).send({ error: 'Something went wrong' });
      });
  });
};
