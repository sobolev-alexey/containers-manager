import React, { Component } from 'react';
import firebase from 'firebase';
import Mam from 'mam.client.js';
import IOTA from 'iota.lib.js';
import { connect } from 'react-redux';
import { Button } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
import find from 'lodash-es/find';
import last from 'lodash-es/last';
import uniqBy from 'lodash-es/uniqBy';
import pick from 'lodash-es/pick';
import { toast } from 'react-toastify';
import { appendToChannel } from '../mamFunctions.js';
import { storeContainer } from '../store/container/actions';
import Notification from '../SharedComponents/Notification';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Tabs from './Tabs';
import Details from './Details';
import FilesUpload from './Documents/FilesUpload';
import { validateIntegrity } from './Documents/DocumentIntegrityValidator';
import './styles.css';

const iota = new IOTA();

class DetailsPage extends Component {
  state = {
    showLoader: false,
    fetchComplete: false,
    metadata: [],
    fileUploadEnabled: true,
    statusUpdated: false,
    statuses: [],
    container: null,
    activeTabIndex: 0,
  };

  async componentDidMount() {
    const { auth, container, containers, history, match: { params: { containerId } } } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    }
    if (!containerId || isEmpty(containers)) {
      history.push('/');
    } else if (isEmpty(container) || container[0].containerId !== containerId) {
      this.retrieveContainer(containerId);
    } else {
      await validateIntegrity(last(container));
      this.setState({
        showLoader: false,
        fetchComplete: true,
        container: last(container),
        statuses: this.getUniqueStatuses(container),
      });
    }
  }

  notifySuccess = message => toast.success(message);
  notifyWarning = message => toast.warn(message);
  notifyError = message => toast.error(message);

  getUniqueStatuses = containerEvents =>
    uniqBy(containerEvents.map(event => pick(event, ['status', 'timestamp'])), 'status');

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

  retrieveContainer = containerId => {
    const { auth, containers } = this.props;
    const container = find(containers, { containerId });
    this.setState({ showLoader: true });
    const promise = new Promise(async (resolve, reject) => {
      try {
        const containerEvents = [];
        await Mam.fetch(container.mam.root, 'restricted', auth.mam.secret_key, data => {
          const containerEvent = JSON.parse(iota.utils.fromTrytes(data));
          this.props.storeContainer(containerEvent);
          containerEvents.push(containerEvent);
          this.setState({
            container: containerEvent,
            statuses: this.getUniqueStatuses(containerEvents),
          });
        });

        await validateIntegrity(last(containerEvents));
        this.setState({ showLoader: false, fetchComplete: true });
        return resolve();
      } catch (error) {
        this.setState({ showLoader: false });
        return reject(this.notifyError('Error loading container data'));
      }
    });

    return promise;
  };

  onUploadComplete = metadata => {
    this.setState({ metadata, fileUploadEnabled: false, activeTabIndex: 1 }, () => {
      this.notifySuccess('File upload complete!');
      this.appendContainerChannel();
    });
  };

  render() {
    const {
      fileUploadEnabled,
      showLoader,
      statusUpdated,
      statuses,
      container,
      fetchComplete,
      activeTabIndex,
    } = this.state;
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
        <div className={`loaderWrapper ${showLoader ? '' : 'hidden'}`}>
          <Loader showLoader={showLoader} />
        </div>
        <div className="detailsWrapper">
          <div className="md-block-centered">
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
              activeTabIndex={activeTabIndex}
              container={container}
              statuses={statuses}
              containerEvents={this.props.container}
              fetchComplete={fetchComplete}
            />
            <Details container={container} />
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
