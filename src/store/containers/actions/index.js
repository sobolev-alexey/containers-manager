import firebase from 'firebase';
import { ADD_CONTAINER, STORE_CONTAINERS } from '../../actionTypes';

export const addContainer = containerId => {
  const promise = new Promise((resolve, reject) => {
    try {
      firebase
        .database()
        .ref(`containers/${containerId}`)
        .once('value')
        .then(snapshot => {
          return resolve({ data: snapshot.val(), error: null });
        })
        .catch(error => {
          return reject({ error: 'Something went wrong' });
        });
    } catch (error) {
      return reject({ error: 'Loading containers failed' });
    }
  });

  return {
    type: ADD_CONTAINER,
    promise,
  };
};

export const storeContainers = auth => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const results = [];
      const promises = [];

      switch (auth.role) {
        case 'shipper':
          const queryByShipper = firebase
            .database()
            .ref('containers')
            .orderByChild('shipper')
            .equalTo(auth.name);
          promises.push(queryByShipper.once('value'));
          break;
        case 'observer':
          const queryAll = firebase.database().ref('containers');
          promises.push(queryAll.once('value'));
          break;
        default:
          const queryByStatus = firebase
            .database()
            .ref('containers')
            .orderByChild('status');
          auth.previousEvent.forEach(status => {
            const query = queryByStatus.equalTo(status);
            promises.push(query.once('value'));
          });
          break;
      }

      await Promise.all(promises)
        .then(snapshots => {
          snapshots.forEach(snapshot => {
            const val = snapshot.val();
            if (val) {
              results.push(...Object.values(val));
            }
          });
        })
        .catch(error => {
          return reject({ error: 'Loading containers failed' });
        });

      if (results.length > 0) {
        return resolve({ data: results, error: null });
      } else {
        return reject({ error: 'No containers found' });
      }
    } catch (error) {
      return reject({ error: 'Loading containers failed' });
    }
  });

  return {
    type: STORE_CONTAINERS,
    promise,
  };
};
