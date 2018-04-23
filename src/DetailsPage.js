import React, { Component } from 'react';
import firebase from 'firebase';
import { Switch } from 'react-md';
import { ToastContainer, toast } from 'react-toastify';
import { appentToChannel, fetchChannel } from './mamFunctions.js';
import FilesUpload from './FilesUpload';
import FilesList from './FilesList';
import './DetailsPage.css';

class DetailsPage extends Component {
  state = {
    metadata: [],
    fileUploadEnabled: false,
  };

  notifySuccess = message => toast.success(message);
  notifyWarning = message => toast.warn(message);
  notifyError = message => toast.error(message);

  appendContainerQuery = async () => {
    try {
      const containerId = '12300025';
      // create reference
      const containersRef = firebase.database().ref(`Rotterdam/containers/${containerId}`);

      containersRef
        .once('value')
        .then(snapshot => {
          if (snapshot.val() === null) {
            this.notifyWarning("Container doesn't exist");
            return;
          } else {
            this.appendContainerChannel(snapshot.val().mam, containersRef);
          }
        })
        .catch(error => {
          this.notifyError(error);
        });
    } catch (err) {
      this.notifyError(err);
    }
  };

  retrieveContainerQuery = async () => {
    try {
      const containerId = '12300025';
      firebase
        .database()
        .ref(`Rotterdam/containers/${containerId}`)
        .on('value', snapshot => {
          const val = snapshot.val();
          if (val) {
            console.log(2222, val.mam);
            this.retrieveContainerChannel(val.mam.root);
          } else {
            this.notifyError('Something wrong');
            return;
          }
        });
    } catch (err) {
      this.notifyError(err);
    }
  };

  appendContainerChannel = (mam, containersRef) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const containerData = await fetchChannel(mam.root);
        console.log(3333, containerData);

        if (containerData && containerData.length > 0) {
          const timestamp = Date.now();
          const status = 'Container loaded on vessel 1';
          const temperature = 25;
          const { containerId, departure, destination, load, shipper, type } = containerData[0];
          console.log(4444, mam);
          const newContainerData = await appentToChannel(
            {
              containerId,
              departure,
              destination,
              load,
              shipper,
              type,
              timestamp,
              status,
              temperature,
            },
            mam
          );

          console.log(4444);
          // Create a new container entry using that container ID
          await containersRef.update({
            containerId,
            timestamp,
            mam: {
              root: mam.root,
              seed: newContainerData.state.seed,
              next: newContainerData.state.channel.next_root,
              start: newContainerData.state.channel.start,
            },
          });
          console.log(5555, newContainerData);
          return resolve(containerData);
        }
        return reject(containerData);
      } catch (error) {
        return reject(error);
      }
    });

    return promise;
  };

  retrieveContainerChannel = root => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        console.log(3333);
        const channel = await fetchChannel(root);
        console.log(4444);
        return resolve(console.log('success', channel));
      } catch (error) {
        return reject(console.log(error, root));
      }
    });

    return promise;
  };

  onUploadComplete = metadata => {
    metadata.map(file => console.log(100, file));
    this.setState({ metadata, fileUploadEnabled: false });
    this.notifySuccess('File upload complete!');
  };

  onSwitchFileUpload = changeEvent => {
    this.setState({ fileUploadEnabled: changeEvent });
  };

  render() {
    const { metadata, fileUploadEnabled } = this.state;

    return (
      <div className="App">
        <p className="App-intro">
          <button onClick={this.createContainerQuery}>Create</button>
          <br />
          <button onClick={this.retrieveContainerQuery}>Retrieve</button>
          <br />
          <button onClick={this.appendContainerQuery}>Append</button>
        </p>
        <FilesList metadata={metadata} />
        <Switch
          id="fileUpload"
          type="switch"
          label="Enable file upload"
          name="fileUpload"
          checked={fileUploadEnabled}
          onChange={this.onSwitchFileUpload}
        />
        {fileUploadEnabled ? (
          <FilesUpload uploadComplete={this.onUploadComplete} pathTofile={'Rotterdam/containers'} />
        ) : null}
        {
          // https://fkhadra.github.io/react-toastify/
        }
        <ToastContainer
          className="toast-container"
          bodyClassName="toast-body"
          autoClose={1000000}
          hideProgressBar
          closeOnClick
          pauseOnVisibilityChange
          draggable
          pauseOnHover
        />
      </div>
    );
  }
}

export default DetailsPage;
