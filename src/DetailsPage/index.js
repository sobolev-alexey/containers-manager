import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Button } from 'react-md';
import { isEmpty, find, last, uniqBy, pick } from 'lodash';
import { toast } from 'react-toastify';
import { storeContainer } from '../store/container/actions';
import Notification from '../SharedComponents/Notification';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Tabs from './Tabs';
import Details from './Details';
import FilesUpload from './Documents/FilesUpload';
import { validateIntegrity } from './Documents/DocumentIntegrityValidator';
import { fetchContainer, appendContainerChannel } from '../utils/mam';
import './styles.scss';

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

  documentExists = documentName => {
    this.setState({ showLoader: false });
    this.notifyError(`Document named ${documentName} already exists`);
  };

  appendToContainer = async () => {
    const { metadata } = this.state;
    const meta = metadata.length;
    this.setState({ showLoader: true });
    const response = await appendContainerChannel(metadata, this.props, this.documentExists);
    if (response) {
      this.notifySuccess(`Container ${meta ? '' : 'status '}updated`);
      this.setState({ showLoader: false, metadata: [], fileUploadEnabled: true });
      this.retrieveContainer(response);
    } else {
      this.setState({ showLoader: false });
      this.notifyError('Something went wrong');
    }
  };

  storeContainerCallback = container => {
    this.props.storeContainer(container);
  };

  setStateCalback = (container, statuses) => {
    this.setState({ container, statuses });
  };

  retrieveContainer = containerId => {
    const { auth, containers } = this.props;
    const container = find(containers, { containerId });
    this.setState({ showLoader: true });
    const promise = new Promise(async (resolve, reject) => {
      try {
        const containerEvent = await fetchContainer(
          container.mam.root,
          auth.mam.secret_key,
          this.storeContainerCallback,
          this.setStateCalback
        );

        await validateIntegrity(containerEvent);
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
      this.appendToContainer();
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
              {auth.canAppendToStream && !statusUpdated && nextStatus ? (
                <Button raised onClick={this.appendToContainer}>
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
