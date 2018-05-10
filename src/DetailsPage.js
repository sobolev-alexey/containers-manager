import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Button } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
import find from 'lodash-es/find';
import last from 'lodash-es/last';
import uniqBy from 'lodash-es/uniqBy';
import pick from 'lodash-es/pick';
import { toast } from 'react-toastify';
import { appendToChannel, fetchChannel } from './mamFunctions.js';
import { storeContainer } from './store/container/actions';
import FilesUpload from './FilesUpload';
import Notification from './Notification';
import Loader from './Loader';
import Header from './Header';
import Tabs from './Tabs';
import ContainerDetails from './ContainerDetails';
import { validateIntegrity } from './DocumentIntegrityValidator';
import './DetailsPage.css';

class DetailsPage extends Component {
  state = {
    showLoader: true,
    metadata: [],
    fileUploadEnabled: true,
    statusUpdated: false,
    statuses: [],
    container: null,
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

  appendContainerChannel = async () => {
    const { metadata } = this.state;
    const meta = metadata.length;
    const { auth, container, containers, history, match: { params: { containerId } } } = this.props;
    const { mam } = find(containers, { containerId });
    const containersRef = firebase.database().ref(`containers/${containerId}`);

    const promise = new Promise(async (resolve, reject) => {
      try {
        if (container) {
          this.setState({ showLoader: true });
          const timestamp = Date.now();
          const {
            containerId,
            departure,
            destination,
            lastPositionIndex = 0,
            load,
            position = null,
            shipper,
            type,
            status,
            temperature,
            documents = [],
          } = last(container);
          const newStatus = meta
            ? status
            : auth.nextEvents[status.toLowerCase().replace(/[- ]/g, '')];

          metadata.forEach(({ name }) => {
            documents.forEach(existingDocument => {
              if (existingDocument.name === name) {
                this.setState({ showLoader: false });
                reject(this.notifyError(`Document named ${name} already exists`));
              }
            });
          });

          const newDocuments = [...documents, ...metadata];

          const newContainerData = await appendToChannel(
            {
              containerId,
              departure,
              destination,
              lastPositionIndex,
              load,
              position,
              shipper,
              type,
              timestamp,
              temperature,
              status: newStatus,
              documents: newDocuments,
            },
            mam,
            auth.mam.secret_key
          );

          if (newContainerData) {
            this.notifySuccess(`${meta ? 'File metadata' : 'Container status'} saved in Tangle`);

            await containersRef.update({
              containerId,
              timestamp,
              departure,
              destination,
              shipper,
              status: newStatus,
              mam: {
                root: mam.root,
                seed: newContainerData.state.seed,
                next: newContainerData.state.channel.next_root,
                start: newContainerData.state.channel.start,
              },
            });

            this.notifySuccess(`Container ${meta ? '' : 'status '}updated`);

            if (meta) {
              this.setState({ showLoader: false, metadata: [], fileUploadEnabled: true });
              return resolve(this.retrieveContainer(containerId));
            } else {
              return resolve(history.push('/'));
            }
          }
        }
        this.setState({ showLoader: false });
        return reject(this.notifyError('Container data missing'));
      } catch (error) {
        this.setState({ showLoader: false });
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
    this.setState({ showLoader: true });
    const promise = new Promise(async (resolve, reject) => {
      try {
        const containerEvents = await fetchChannel(root, secretKey);
        await validateIntegrity(last(containerEvents));

        const statuses = await uniqBy(
          containerEvents.map(event => pick(event, ['status', 'timestamp'])),
          'status'
        );

        this.setState({ container: last(containerEvents), statuses, showLoader: false }, () => {
          this.props.storeContainer(containerEvents);
        });

        return resolve();
      } catch (error) {
        this.setState({ showLoader: false });
        return reject(this.notifyError('Error loading container data'));
      }
    });

    return promise;
  };

  onUploadComplete = metadata => {
    this.setState({ metadata, fileUploadEnabled: false }, () => {
      this.notifySuccess('File upload complete!');
      this.appendContainerChannel();
    });
  };

  render() {
    const { fileUploadEnabled, showLoader, statusUpdated, statuses, container } = this.state;
    const { auth } = this.props;

    if (!container) return <Loader showLoader={showLoader} />;

    const nextStatus =
      auth.canAppendToStream && container
        ? auth.nextEvents[container.status.toLowerCase().replace(/[- ]/g, '')]
        : '';

    return (
      <div>
        <Header>
          <p>
            Welcome to container tracking,<br />
            {auth.name || auth.role}
          </p>
        </Header>
        <div className="detailsWrapper">
          <div className={`loaderWrapper ${showLoader ? '' : 'hidden'}`}>
            <Loader showLoader={showLoader} />
          </div>
          <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
            <div className="routeCtaWrapper">
              <h1>
                {container.departure} &rarr; {container.destination}
              </h1>
              {auth.canAppendToStream && !statusUpdated ? (
                <Button raised onClick={this.appendContainerChannel}>
                  Confirm {nextStatus}
                </Button>
              ) : null}
            </div>
            <Tabs
              container={container}
              statuses={statuses}
              containerEvents={this.props.container}
            />
            <ContainerDetails container={container} />
          </div>
        </div>
        {fileUploadEnabled && auth.canUploadDocuments ? (
          <FilesUpload
            uploadComplete={this.onUploadComplete}
            pathTofile={`containers/${container.containerId}`}
            existingDocuments={container.documents}
          />
        ) : null}
        <Notification />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  container: state.container,
  containers: state.containers.data,
});

const mapDispatchToProps = dispatch => ({
  storeContainer: container => dispatch(storeContainer(container)),
});

export default connect(mapStateToProps, mapDispatchToProps)(DetailsPage);
