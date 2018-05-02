import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Button, Switch, List, ListItem, Subheader } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
import find from 'lodash-es/find';
import last from 'lodash-es/last';
import uniqBy from 'lodash-es/uniqBy';
import pick from 'lodash-es/pick';
import * as moment from 'moment';
import { toast } from 'react-toastify';
import { appentToChannel, fetchChannel } from './mamFunctions.js';
import { storeContainer } from './store/container/actions';
import FilesUpload from './FilesUpload';
import FilesList from './FilesList';
import Notification from './Notification';
import { validateIntegrity } from './DocumentIntegrityValidator';
import './DetailsPage.css';

class DetailsPage extends Component {
  state = {
    showLoader: false,
    metadata: [],
    fileUploadEnabled: false,
    statusUpdated: false,
    statuses: [],
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
        if (container && container.length > 0) {
          this.setState({ showLoader: true });
          const timestamp = Date.now();
          const {
            containerId,
            departure,
            destination,
            load,
            shipper,
            type,
            status,
            temperature,
            documents = [],
          } = last(container);
          const newStatus = meta
            ? status
            : auth.nextEvents[status.toLowerCase().replace(/[-\ ]/g, '')];

          metadata.forEach(({ name }) => {
            documents.forEach(existingDocument => {
              if (existingDocument.name === name) {
                this.setState({ showLoader: false });
                reject(this.notifyError(`Document named ${name} already exists`));
              }
            });
          });

          const newDocuments = [...documents, ...metadata];

          const newContainerData = await appentToChannel(
            {
              containerId,
              departure,
              destination,
              load,
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

          if (meta) {
            this.setState({ showLoader: false, metadata: [] });
          } else {
            this.setState({ showLoader: false, statusUpdated: true });
          }

          this.notifySuccess(`Container ${meta ? '' : 'status '}updated`);
          return resolve(history.push(`/details/${containerId}`));
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
        await last(containerEvents).documents.forEach(async document => {
          const downloadedDocument = await validateIntegrity(document.downloadURL, null);
          document.integrity = {
            hashMatch: downloadedDocument.sha256Hash === document.sha256Hash,
            sizeMatch: downloadedDocument.size === document.size,
            sha256Hash: downloadedDocument.sha256Hash,
            size: downloadedDocument.size,
          };
        });

        const statuses = await uniqBy(
          containerEvents.map(event => pick(event, ['status', 'timestamp'])),
          'status'
        );

        this.setState({ statuses, showLoader: false }, () => {
          this.props.storeContainer(containerEvents);
        });

        return resolve(this.notifySuccess('Container data loaded'));
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

  onSwitchFileUpload = changeEvent => {
    this.setState({ fileUploadEnabled: changeEvent });
  };

  render() {
    const { metadata, fileUploadEnabled, showLoader, statusUpdated, statuses } = this.state;
    const { container, auth } = this.props;
    const nextStatus =
      auth.canAppendToStream && !isEmpty(container)
        ? auth.nextEvents[
            last(container)
              .status.toLowerCase()
              .replace(/[-\ ]/g, '')
          ]
        : '';
    const updated = !isEmpty(container)
      ? moment.duration(Date.now() - last(container).timestamp).humanize()
      : '';

    return (
      <div className="App">
        <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
          <div />
          <div />
          <div />
        </div>
        <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
          <List className="md-cell md-paper md-paper--1">
            <Subheader primaryText="Container data" primary />
            {!isEmpty(container) && last(container) ? (
              <div>
                <p>Container IMO: {last(container).containerId}</p>
                <p>Updated: {updated} ago</p>
                <p>Shipper: {last(container).shipper}</p>
                <p>Load: {last(container).load}</p>
                <p>Type: {last(container).type}</p>
                <p>Status: {last(container).status}</p>
                <p>
                  Route: {last(container).departure} &rarr; {last(container).destination}
                </p>
                <div>
                  Documents:{' '}
                  {last(container).documents.map(document => (
                    <p key={document.name}>
                      <a href={document.downloadURL} target="_blank">
                        {document.name}
                      </a>
                      {document.integrity && document.integrity.hashMatch ? 'yes' : 'no'}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
          </List>
          {!isEmpty(container) && last(container) ? (
            <List className="md-cell md-paper md-paper--1">
              <Subheader primaryText="Statuses" primary />
              {statuses.map(({ status, timestamp }) => (
                <div key={timestamp}>
                  <p>{status}</p>
                  <p>{moment(timestamp).format('MMMM Do @ LT')}</p>
                </div>
              ))}
            </List>
          ) : null}
          {!isEmpty(container) && auth.canAppendToStream && !statusUpdated ? (
            <Button raised onClick={this.appendContainerChannel}>
              Confirm {nextStatus}
            </Button>
          ) : null}
          {auth.canUploadDocuments ? (
            <Switch
              id="fileUpload"
              type="switch"
              label="Enable file upload"
              name="fileUpload"
              checked={fileUploadEnabled}
              onChange={this.onSwitchFileUpload}
            />
          ) : null}
          {fileUploadEnabled && auth.canUploadDocuments && !isEmpty(container) ? (
            <FilesUpload
              uploadComplete={this.onUploadComplete}
              pathTofile={`containers/${last(container).containerId}`}
              existingDocuments={last(container).documents}
            />
          ) : null}
        </div>
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
