const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });
const config = require('./mam/config.json');
const mamFunctions = require('./mam/mamFunctions.js');
const routes = require('../routes.json');

module.exports = () => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      await admin
        .database()
        .ref(`containers/9`)
        .once('value')
        .then(async snapshot => {
          const val = snapshot.val();
          const payload = { ...val };
          const containerData = await mamFunctions.fetchChannel(
            payload.mam.root,
            config.secret_key
          );

          const last = containerData[containerData.length - 1];
          const updatedContainerData = { ...last };
          const route = getRoute(last.departure);
          const position = getPosition(route, last.lastPositionIndex || 0);

          const randomTemperature =
            updatedContainerData.type !== 'Refrigerated' ? 23.0 : Math.random() > 0.4 ? -10 : 4;
          const tempBase = Number(last.temperature) || randomTemperature;
          const temperature = (tempBase + 0.1 * tempBase * (2 * Math.random() - 1)).toFixed(1);

          if (position) {
            updatedContainerData.position = position.position;
            updatedContainerData.lastPositionIndex = position.lastPositionIndex;
            updatedContainerData.temperature = temperature;
            updatedContainerData.timestamp = Date.now();

            const newContainerData = await mamFunctions.appendToChannel(
              updatedContainerData,
              payload.mam,
              config.secret_key
            );

            if (newContainerData)
              payload.mam = {
                root: payload.mam.root,
                seed: newContainerData.state.seed,
                next: newContainerData.state.channel.next_root,
                start: newContainerData.state.channel.start,
              };

            snapshot.ref.update(payload);
            return resolve(payload);
          }
          return reject(payload);
        })
        .catch(error => {
          console.log('Something went wrong', error);
          return reject(error);
        });
    } catch (error) {
      return reject(error);
    }
  });

  return promise;
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
