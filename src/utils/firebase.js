import firebase from 'firebase';
import config from '../config.json';

export const initializeFirebaseApp = () => firebase.initializeApp(config);

const getContainerReference = containerId => firebase.database().ref(`containers/${containerId}`);

const getUserReference = userId => firebase.database().ref(`users/${userId}`);

export const getFolderReference = () => firebase.database().ref('containers');

export const getFileStorageReference = (pathTofile, fileName) =>
  firebase.storage().ref(`${pathTofile}/${fileName}`);

export const getFirebaseSnapshot = (containerId, onError) => {
  const promise = new Promise((resolve, reject) => {
    try {
      // Create reference
      const containersRef = getContainerReference(containerId);

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

const appendContainerToUser = (user, containerId) => {
  // Get user reference
  const userRef = getUserReference(user.userId);
  const items = user.items || [];

  userRef.update({
    items: [...items, containerId],
  });
};

export const createContainer = (eventBody, channel, secretKey) => {
  // Create container reference
  const containersRef = getContainerReference(eventBody.containerId);

  containersRef.set({
    ...eventBody,
    mam: {
      root: channel.root,
      seed: channel.state.seed,
      next: channel.state.channel.next_root,
      start: channel.state.channel.start,
      secretKey,
    },
  });
};

export const updateContainer = (eventBody, mam, newContainerData, user) => {
  // Create reference
  const containersRef = getContainerReference(eventBody.containerId);

  containersRef.update({
    ...eventBody,
    mam: {
      root: mam.root,
      secretKey: mam.secretKey,
      seed: newContainerData.state.seed,
      next: newContainerData.state.channel.next_root,
      start: newContainerData.state.channel.start,
    },
  });

  appendContainerToUser(user, eventBody.containerId);
};
