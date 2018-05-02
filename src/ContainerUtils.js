import firebase from 'firebase';

export const getContainers = async (auth, handleSuccess, handleError) => {
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
      const results = [];
      snapshots.forEach(snapshot => {
        const val = snapshot.val();
        if (val) {
          results.push(...Object.values(val));
        }
      });

      if (results.length > 0) {
        handleSuccess(results);
      } else {
        handleError();
      }
    })
    .catch(error => {
      handleError();
    });
};
