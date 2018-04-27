import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, List, ListItem, Subheader } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
// import api from './api';
import config from './config.json';
import { storeContainers } from './store/containers/actions';
import Notification from './Notification';
import Autosuggest from './Autosuggest';
import './MainPage.css';

class MainPage extends Component {
  state = {
    showLoader: false,
  };

  componentDidMount() {
    const { auth, history } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    } else {
      this.getContainers(auth.role);
    }
  }

  notifySuccess = message => toast.success(message);
  notifyWarning = message => toast.warn(message);
  notifyError = message => toast.error(message);

  getContainers = role => {
    const promises = [];

    switch (role) {
      case 'shipper':
        const queryByShipper = firebase
          .database()
          .ref('containers')
          .orderByChild('shipper')
          .equalTo(this.props.auth.name);
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
        this.props.auth.previousEvent.forEach(status => {
          const query = queryByStatus.equalTo(status);
          promises.push(query.once('value'));
        });
        break;
    }

    this.setState({ showLoader: true });

    Promise.all(promises)
      .then(snapshots => {
        const results = [];
        snapshots.forEach(snapshot => {
          const val = snapshot.val();
          if (val) {
            results.push(...Object.values(val));
          }
        });
        this.setState({ showLoader: false });
        if (results.length > 0) {
          this.notifySuccess('Loaded containers');
          this.props.storeContainers(results);
        } else {
          this.notifyError('Error loading containers');
        }
      })
      .catch(error => {
        console.log(666, error);
        this.setState({ showLoader: false });
        this.notifyError('Error loading containers');
      });

    // api
    //   .post(`${config.rootURL}/list`, { statuses })
    //   .then(response => {
    //     this.setState({ showLoader: false });
    //     console.log(response.data);
    //     if (response.data && response.data.length > 0) {
    //       this.notifySuccess('Loaded containers');
    //       this.props.storeContainers(response.data);
    //     } else {
    //       this.notifyError('Error loading containers');
    //     }
    //   })
    //   .catch(error => {
    //     this.setState({ showLoader: false });
    //     this.notifyWarning('No containers available');
    //   });
  };

  render() {
    const { auth, containers, history } = this.props;
    const { showLoader } = this.state;
    return (
      <div className="App">
        {auth.canCreateStream ? (
          <Button raised onClick={() => history.push('/new')}>
            Create new container
          </Button>
        ) : null}
        <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
          <div />
          <div />
          <div />
        </div>
        <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
          <List className="md-cell md-paper md-paper--1">
            <Subheader
              primaryText={auth.name ? `Containers of ${auth.name}` : 'Available containers'}
              primary
            />
            <Autosuggest
              items={containers}
              onSelect={container => history.push(`/details/${container.containerId}`)}
            />
            {containers.map(({ containerId, departure, destination, status }) => (
              <ListItem
                key={containerId}
                primaryText={containerId}
                secondaryText={
                  <div>
                    <div>
                      {departure} &rarr; {destination}
                    </div>
                    <div>{status}</div>
                  </div>
                }
                threeLines
                onClick={() => history.push(`/details/${containerId}`)}
              />
            ))}
          </List>
        </div>
        <Notification />
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  containers: state.containers,
});

const mapDispatchToProps = dispatch => ({
  storeContainers: containers => dispatch(storeContainers(containers)),
});

export default connect(mapStateToProps, mapDispatchToProps)(MainPage);
