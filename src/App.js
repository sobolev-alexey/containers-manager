import React, { Component } from 'react';
import firebase from 'firebase';
import upperFirst from 'lodash-es/upperFirst'
import { createNewChannel, appentToChannel, fetchChannel } from './mamFunctions.js';
import config from './config.json';
import './App.css';

class App extends Component {
  componentDidMount() {
    firebase.initializeApp(config);
  }

  createContainerQuery = async () => {
    try {
      const containerId = '12300024'
      // create reference
      const containersRef = firebase.database().ref(`Rotterdam/containers/${containerId}`);

      containersRef.once('value').then(snapshot => {
        if (snapshot.val() === null) {
          console.log(2222);
          this.createContainerChannel(containerId, containersRef)
        } else {
          console.log(2222, snapshot.val());
        }
      }).catch((error) => {
        console.log('Error getting message details', error);
      });
      console.log(1111);
    } catch (err) {
      console.log(333, err);
    }
  }

  appenContainerQuery = async () => {
    try {
      const containerId = '12300024'
      // create reference
      const containersRef = firebase.database().ref(`Rotterdam/containers/${containerId}`);

      containersRef.once('value').then(snapshot => {
        if (snapshot.val() === null) {
          console.log(9999);
          return
        } else {
          console.log(2222, snapshot.val());
          this.appendContainerChannel(snapshot.val().mam, containersRef)
        }
      }).catch((error) => {
        console.log('Error getting message details', error);
      });
      console.log(1111);
    } catch (err) {
      console.log(333, err);
    }
  }

  retrieveContainerQuery = async () => {
    try {
      const containerId = '12300024'
      firebase.database().ref(`Rotterdam/containers/${containerId}`).on('value', snapshot => {
        const val = snapshot.val();
        if (val) {
          console.log(2222, val.mam);
          this.retrieveContainerChannel(val.mam.root)
        } else {
          return console.log('Something wrong')
        }
      })
      console.log(1111);

    } catch (err) {
      console.log(err);
    }
  }

  createContainerChannel = (containerId, containersRef) => {
    const req = {
      departure: 'Rotterdam',
      destination: 'Singapore',
      load: 'Machines',
      type: 'Refer',
      shipper: 'Mr. D',
      status: 'Container announced',
      temperature: 23
    }
    const promise = new Promise(async (resolve, reject) => {
      try {
        const { departure, destination, load, type, shipper, status, temperature } = req;
        // Format the container ID to remove dashes and parens
        console.log(3333);
        const timestamp = Date.now()
        const channel = await createNewChannel({
          containerId,
          departure,
          destination,
          load,
          shipper,
          type,
          timestamp,
          status,
          temperature
        });

        console.log(4444);
        // Create a new container entry using that container ID
        await containersRef.set({
          containerId,
          timestamp,
          mam: {
            root: channel.root,
            seed: channel.state.seed,
            next: channel.state.channel.next_root,
            start: channel.state.channel.start
          }
        });
        console.log(5555, channel);
        return resolve(channel);
      } catch (error) {
        return reject(error);
      }
    });

    return promise
  }

  appendContainerChannel = (mam, containersRef) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const containerData = await fetchChannel(mam.root);
        console.log(3333, containerData);

        if (containerData && containerData.length > 0) {
          const timestamp = Date.now()
          const status = 'Container loaded on vessel'
          const temperature = 25
          const { containerId, departure, destination, load, shipper, type } = containerData[0];
          console.log(4444, mam);
          const newContainerData = await appentToChannel({
            containerId,
            departure,
            destination,
            load,
            shipper,
            type,
            timestamp,
            status,
            temperature
          }, mam);

          console.log(4444);
          // Create a new container entry using that container ID
          await containersRef.update({
            containerId,
            timestamp,
            mam: {
              root: mam.root,
              seed: newContainerData.state.seed,
              next: newContainerData.state.channel.next_root,
              start: newContainerData.state.channel.start
            }
          });
          console.log(5555, newContainerData);
          return resolve(containerData);
        }
        return reject(containerData)
      } catch (error) {
        return reject(error);
      }
    });

    return promise
  }

  retrieveContainerChannel = (root) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        console.log(3333);
        const channel = await fetchChannel(root);
        console.log(4444);
        return resolve(console.log( 'success', channel ));
      } catch (error) {
        return reject(console.log(error, root));
      }
    });

    return promise
  }

  render() {
    return (
      <div className="App">
        <p className="App-intro">
          <button onClick={this.createContainerQuery}>Create</button>
          <br />
          <button onClick={this.retrieveContainerQuery}>Retrieve</button>
          <br />
          <button onClick={this.appenContainerQuery}>Append</button>
        </p>
      </div>
    );
  }
}

export default App;
