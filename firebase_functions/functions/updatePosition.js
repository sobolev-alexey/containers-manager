const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const config = require('./mam/config.json');
const mamFunctions = require('./mam/mamFunctions.js');
const routes = require('../routes.json');

module.exports = function(req, res) {
  return cors(req, res, () => {
    const ids = [];
    const results = [];
    const ref = admin
      .database()
      .ref('containers')
      .orderByChild('status')
      .equalTo('Vessel departure');

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
              const route = getRoute(last.departure);
              const position = getPosition(route, last.lastPositionIndex || 0);

              if (position) {
                updatedContainerData.position = position.position;
                updatedContainerData.lastPositionIndex = position.lastPositionIndex;

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

                promises_update.push(snapshot.ref.update(newData));
              }
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

const getRoute = departure => {
  if (departure === 'Rotterdam') {
    return routes[0].route;
  } else if (departure === 'Singapore') {
    return routes[2].route;
  }
  return routes[1].route;
};

const getPosition = (route, lastPositionIndex) => {
  if (lastPositionIndex < route.length / 2) {
    return {
      position: route[lastPositionIndex * 2],
      lastPositionIndex: lastPositionIndex + 1,
    };
  }
  return null;
};
