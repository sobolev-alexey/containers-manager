import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
import { storeContainers } from './store/containers/actions';
import Header from './Header';
import Notification from './Notification';
import Autosuggest from './Autosuggest';
import { getContainers } from './ContainerUtils';
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
      this.retrieveContainers(auth);
    }
  }

  notifySuccess = message => toast.success(message);
  notifyWarning = message => toast.warn(message);
  notifyError = message => toast.error(message);

  retrieveContainers = async auth => {
    const handleSuccess = results => {
      this.notifySuccess('Loaded containers');
      this.props.storeContainers(results);
    };

    const handleError = () => {
      this.setState({ showLoader: false });
      this.notifyError('Error loading containers');
    };

    this.setState({ showLoader: true });
    await getContainers(auth, handleSuccess, handleError);
    this.setState({ showLoader: false });
  };

  render() {
    const { auth, containers, history } = this.props;
    const { showLoader } = this.state;
    return (
      <div className="App">
        <Header name={auth.name || auth.role} />
        {auth.canCreateStream ? (
          <div className="ctaWrapper">
            <Button raised onClick={() => history.push('/new')}>
              Create new container
            </Button>
          </div>
        ) : null}
        <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
          <div />
          <div />
          <div />
        </div>
        <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
          <Autosuggest
            items={containers}
            onSelect={container => history.push(`/details/${container.containerId}`)}
          />
          <DataTable plain>
            <TableHeader>
              <TableRow>
                <TableColumn>IMO</TableColumn>
                <TableColumn className="md-text-center">Route</TableColumn>
                <TableColumn className="md-text-right">Status</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {containers.map(({ containerId, departure, destination, status }) => (
                <TableRow key={containerId} onClick={() => history.push(`/details/${containerId}`)}>
                  <TableColumn>{containerId}</TableColumn>
                  <TableColumn className="md-text-center">
                    {departure} &rarr; {destination}
                  </TableColumn>
                  <TableColumn className="md-text-right">{status}</TableColumn>
                </TableRow>
              ))}
            </TableBody>
          </DataTable>
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
