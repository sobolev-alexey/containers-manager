import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Switch } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
import find from 'lodash-es/find';
import last from 'lodash-es/last';
import { toast } from 'react-toastify';
import { appentToChannel, fetchChannel } from './mamFunctions.js';
import { storeContainer } from './store/container/actions';
import FilesUpload from './FilesUpload';
import FilesList from './FilesList';
import Notification from './Notification';
import './DetailsPage.css';

class DetailsPage extends Component {
  state = {
    showLoader: false,
    metadata: [],
    fileUploadEnabled: false,
  };

  componentDidMount() {
    const { auth, containers, history, match: { params: { containerId } } } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    }
    if (!containerId || isEmpty(containers)) {
      history.push('/');
    } else {
      this.retrieveContainer(containerId);
    }
  }

  notifySuccess = message => toast.success(message);
  notifyWarning = message => toast.warn(message);
  notifyError = message => toast.error(message);

  appendContainerChannel = () => {
    const { auth, container, containers, match: { params: { containerId } } } = this.props;
    const firebaseContainer = find(containers, { containerId });
    const containersRef = firebase.database().ref(`containers/${containerId}`);
    const promise = new Promise(async (resolve, reject) => {
      try {
        console.log(3333, container, firebaseContainer);

        if (container && container.length > 0) {
          const timestamp = Date.now();
          const status =
            auth.nextEvents[
              last(container)
                .status.toLowerCase()
                .replace(/[-\ ]/g, '')
            ];
          const temperature = 25;
          const { containerId, departure, destination, load, shipper, type } = last(container);

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
            firebaseContainer.mam,
            auth.mam.secret_key
          );

          this.notifySuccess('Container status saved in Tangle');
          await containersRef.update({
            containerId,
            timestamp,
            departure,
            destination,
            shipper,
            status,
            mam: {
              root: firebaseContainer.mam.root,
              seed: newContainerData.state.seed,
              next: newContainerData.state.channel.next_root,
              start: newContainerData.state.channel.start,
            },
          });
          return resolve(this.notifySuccess('Container status updated'));
        }
        return reject(this.notifyError('Container data missing'));
      } catch (error) {
        console.log(error);
        return reject(this.notifyError('Something went wrong'));
      }
    });

    return promise;
  };

  retrieveContainer = async containerId => {
    const { auth, containers } = this.props;
    const container = find(containers, { containerId });
    this.retrieveContainerChannel(container.mam.root, auth.mam.secret_key);
  };

  retrieveContainerChannel = (root, secretKey) => {
    const promise = new Promise(async (resolve, reject) => {
      try {
        const container = await fetchChannel(root, secretKey);
        this.props.storeContainer(container);
        return resolve(this.notifySuccess('Container data loaded'));
      } catch (error) {
        console.log(error, root);
        return reject(this.notifyError('Error loading container data'));
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
    const { container, auth } = this.props;

    return (
      <div className="App">
        {!isEmpty(container) && auth.canAppendToStream ? (
          <button onClick={this.appendContainerChannel}>Append</button>
        ) : null}
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
        <Notification />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  container: state.container,
  containers: state.containers,
});

const mapDispatchToProps = dispatch => ({
  storeContainer: container => dispatch(storeContainer(container)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage);
