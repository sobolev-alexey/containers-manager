import { ADD_ITEM, STORE_ITEMS } from '../../actionTypes';
import { getFirebaseSnapshot, getItemsReference } from '../../../utils/firebase';

export const addItem = containerId => {
  const promise = getFirebaseSnapshot(containerId, console.log);
  return {
    type: ADD_ITEM,
    promise,
  };
};

export const storeItems = user => {
  const promise = new Promise(async (resolve, reject) => {
    try {
      const results = [];
      const promises = [];
      const ref = getItemsReference();

      if (user.role === 'shipper') {
        // Add containers of the shiiper
        promises.push(ref.once('value'));
      } else {
        const queryByStatus = ref.orderByChild('status');
        user.previousEvent.forEach(status => {
          const query = queryByStatus.equalTo(status);
          promises.push(query.once('value'));
        });

        if (user.role !== 'port') {
          // Add additional demo container. Port user will already have it
          const query = ref.orderByChild('containerId').equalTo('9');
          promises.push(query.once('value'));
        }
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
          return reject({ error: 'Loading items failed' });
        });

      if (results.length > 0) {
        return resolve({ data: results, error: null });
      } else {
        return reject({ error: 'No items found' });
      }
    } catch (error) {
      return reject({ error: 'Loading items failed' });
    }
  });

  return {
    type: STORE_ITEMS,
    promise,
  };
};
