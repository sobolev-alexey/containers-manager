import firebase from 'firebase';

const getReference = containerId => firebase.database().ref(`containers/${containerId}`);

export const create = (containerId, onError) => {
  const promise = new Promise((resolve, reject) => {
    try {
      // Create reference
      const containersRef = getReference(containerId);

      containersRef
        .once('value')
        .then(snapshot => {
          resolve(snapshot.val());
        })
        .catch(error => {
          reject(onError(error));
        });
    } catch (error) {
      reject(onError(error));
    }
  });

  return promise;
};

export const createContainer = (eventBody, channel) => {
  const { containerId, timestamp, departure, destination, shipper, status } = eventBody;

  // Create reference
  const containersRef = getReference(containerId);

  containersRef.set({
    containerId,
    timestamp,
    departure,
    destination,
    shipper,
    status,
    mam: {
      root: channel.root,
      seed: channel.state.seed,
      next: channel.state.channel.next_root,
      start: channel.state.channel.start,
    },
  });
};

export const updateContainer = (eventBody, root, newContainerData) => {
  const { containerId, timestamp, departure, destination, shipper, status } = eventBody;

  // Create reference
  const containersRef = getReference(containerId);

  containersRef.update({
    containerId,
    timestamp,
    departure,
    destination,
    shipper,
    status,
    mam: {
      root,
      seed: newContainerData.state.seed,
      next: newContainerData.state.channel.next_root,
      start: newContainerData.state.channel.start,
    },
  });
};
