import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, List, ListItem, Subheader } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
import api from './api';
import config from './config.json';
import { storeContainers } from './store/containers/actions';
import Notification from './Notification';
import './MainPage.css';

class MainPage extends Component {
  state = {
    showLoader: false,
  };

  componentDidMount() {
    const { auth, history } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    }
    this.getContainers();
  }

  notifySuccess = message => toast.success(message);
  notifyError = message => toast.error(message);

  getContainers = () => {
    const statuses = this.props.auth.previousEvent;

    this.setState({ showLoader: true });

    api
      .post(`${config.rootURL}/list`, { statuses })
      .then(response => {
        this.setState({ showLoader: false });
        if (response.data && response.data.length > 0) {
          this.notifySuccess('Loaded containers');
          this.props.storeContainers(response.data[0]);
        }
      })
      .catch(error => {
        console.log('Response error', error.response);
        this.setState({ showLoader: false });
        this.notifyError('Error loading containers');
      });
  };

  render() {
    const { auth, containers, history } = this.props;
    const { showLoader } = this.state;
    return (
      <div className="App">
        <Button raised onClick={() => history.push('/new')}>
          Create new container
        </Button>
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
