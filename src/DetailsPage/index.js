import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Button } from 'react-md';
import { Link } from 'react-router-dom';
import { Col } from 'reactstrap';
import isEmpty from 'lodash/isEmpty';
import upperFirst from 'lodash/upperFirst';
import find from 'lodash/find';
import last from 'lodash/last';
import uniqBy from 'lodash/uniqBy';
import pick from 'lodash/pick';
import { toast } from 'react-toastify';
import { storeItem, resetStoredItem } from '../store/item/actions';
import Notification from '../SharedComponents/Notification';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Footer from '../SharedComponents/MiniFooter';
import Tabs from './Tabs';
import Details from './Details';
import { fetchItem, appendItemChannel } from '../utils/mam';
import '../assets/scss/index.scss';
import '../assets/scss/detailsPage.scss';

const StatusButtons = ({ statuses, onClick, showLoader }) => {
  if (typeof statuses === 'string') {
    return (
      <Button className={`details-page-button ${showLoader ? 'hidden' : ''}`} raised onClick={() => onClick(statuses)}>
        Confirm {statuses}
      </Button>
    );
  }

  return (
    <div className="detail-section-status-buttons">
      {statuses.map(status => (
        <Button key={status} raised onClick={() => onClick(status)}>
          Confirm {status}
        </Button>
      ))}
    </div>
  );
};

class DetailsPage extends Component {
  state = {
    showLoader: false,
    fetchComplete: false,
    metadata: [],
    fileUploadEnabled: true,
    statusUpdated: false,
    statuses: [],
    item: null,
    activeTabIndex: 0,
  };

  async componentDidMount() {
    const {
      user,
      item,
      items,
      history,
      match: {
        params: { itemId },
      },
    } = this.props;
    if (isEmpty(user)) {
      history.push('/login');
    }
    if (!itemId || isEmpty(items)) {
      history.push('/list');
    } else if (isEmpty(item) || item[0].itemId !== itemId) {
      this.retrieveItem(itemId);
    } else {
      this.setState({
        showLoader: false,
        fetchComplete: true,
        item: last(item),
        statuses: this.getUniqueStatuses(item),
      });
    }
  }

  notifySuccess = message => toast.success(message);
  notifyWarning = message => toast.warn(message);
  notifyError = message => toast.error(message);

  getUniqueStatuses = itemEvents =>
    uniqBy(itemEvents.map(event => pick(event, ['status', 'timestamp'])), 'status');

  documentExists = documentName => {
    this.setState({ showLoader: false });
    this.notifyError(`Document named ${documentName} already exists`);
  };

  appendToItem = async status => {
    const { project } = this.props;
    const { metadata } = this.state;
    const meta = metadata.length;
    this.setState({ showLoader: true });
    const response = await appendItemChannel(metadata, this.props, this.documentExists, status);
    if (response) {
      this.notifySuccess(`${upperFirst(project.trackingUnit)} ${meta ? '' : 'status '}updated`);
      this.setState({
        showLoader: false,
        metadata: [],
        fileUploadEnabled: true,
      });
      this.retrieveItem(response);
    } else {
      this.setState({ showLoader: false });
      this.notifyError('Something went wrong');
    }
  };

  storeItemCallback = item => {
    this.props.storeItem(item);
  };

  setStateCalback = (item, statuses) => {
    this.setState({ item, statuses });
  };

  retrieveItem = (itemId, resetStoredItems = false) => {
    const {
      items,
      project: { trackingUnit },
    } = this.props;
    const item = find(items, { itemId });
    this.setState({ showLoader: true });
    if (resetStoredItems) {
      this.props.resetStoredItem();
    }
    const promise = new Promise(async (resolve, reject) => {
      try {
        await fetchItem(
          item.mam.root,
          item.mam.secretKey,
          this.storeItemCallback,
          this.setStateCalback
        );

        this.setState({ showLoader: false, fetchComplete: true });
        return resolve();
      } catch (error) {
        this.setState({ showLoader: false });
        return reject(this.notifyError(`Error loading ${trackingUnit} data`));
      }
    });

    return promise;
  };

  onTabChange = newActiveTabIndex => {
    this.setState({ activeTabIndex: newActiveTabIndex });
  };

  onUploadComplete = metadata => {
    this.setState({ metadata, fileUploadEnabled: false, activeTabIndex: 2 }, () => {
      this.notifySuccess('File upload complete!');
      this.appendToItem();
    });
  };

  render() {
    const {
      fileUploadEnabled,
      showLoader,
      statusUpdated,
      statuses,
      item,
      fetchComplete,
      activeTabIndex,
    } = this.state;
    const {
      user,
      match: { params: { itemId } },
      project: { documentStorage, locationTracking, temperatureChart, detailsPage },
    } = this.props;

    if (!item) return <Loader showLoader={showLoader} />;

    const nextEvents = user.nextEvents[item.status.toLowerCase().replace(/[- ]/g, '')];

    return (
      <div className="details-page">
        <Header ctaEnabled>
          <Col xs={4} className="heading">
            <span className="heading-text">
              #{itemId},&nbsp;
              {
                typeof detailsPage.title === 'string'
                  ? item[detailsPage.title]
                  : detailsPage.title.map(field => item[field]).join(' → ')
              }
            </span>
          </Col>
        </Header>
        <div className={`loader-wrapper ${showLoader ? '' : 'hidden'}`}>
          <Loader showLoader={showLoader} />
        </div>
        <div className="details-wrapper">
          <div className="md-block-centered">
            <div className="route-cta-wrapper">
              <Link to="/list" className={`button secondary ${showLoader ? 'hidden' : ''}`}>
                Back
              </Link>
              {user.canAppendToStream && !statusUpdated && nextEvents ? (
                <StatusButtons statuses={nextEvents} onClick={this.appendToItem} showLoader={showLoader} />
              ) : null}
            </div>
            <Tabs
              activeTabIndex={activeTabIndex}
              item={item}
              statuses={statuses}
              itemEvents={this.props.item}
              fetchComplete={fetchComplete}
              locationTracking={locationTracking}
              documentStorage={documentStorage}
              temperatureChart={temperatureChart}
              fileUploadEnabled={fileUploadEnabled}
              onTabChange={this.onTabChange}
              onUploadComplete={this.onUploadComplete}
              onAddTemperatureLocationCallback={this.retrieveItem}
            />
            <Details item={item} fields={detailsPage} />
          </div>
        </div>
        <Notification />
        <Footer />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user,
  item: state.item,
  items: state.items.data,
  project: state.project,
});

const mapDispatchToProps = dispatch => ({
  storeItem: item => dispatch(storeItem(item)),
  resetStoredItem: () => dispatch(resetStoredItem()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(withRouter(DetailsPage));
