import React, { Component } from 'react';
import { connect } from 'react-redux';
import { toast } from 'react-toastify';
import { Button, DataTable, TableHeader, TableBody, TableRow, TableColumn } from 'react-md';
import { isEmpty } from 'lodash';
import { storeContainers } from '../store/containers/actions';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Notification from '../SharedComponents/Notification';
import Autosuggest from './Autosuggest';
import './styles.scss';

class ListPage extends Component {
  state = {
    showLoader: false,
  };

  componentDidMount() {
    const { auth, history, containers } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    } else {
      if (isEmpty(containers.data)) {
        this.setState({ showLoader: true });
        this.props.storeContainers(auth);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { containers: { data, error } } = nextProps;
    if (error) {
      this.notifyError(error);
    }
    if (!isEmpty(data)) {
      this.setState({ showLoader: false });
    }
  }

  notifyError = message => toast.error(message);

  render() {
    const { auth, history, containers: { data } } = this.props;
    const { showLoader } = this.state;

    return (
      <div className="App">
        <Header>
          <p>
            Welcome to container tracking,<br />
            {auth.name || auth.role}
          </p>
        </Header>
        {auth.canCreateStream ? (
          <div className="ctaWrapper">
            <Button raised onClick={() => history.push('/new')}>
              Create new container
            </Button>
          </div>
        ) : null}
        <Loader showLoader={showLoader} />
        <div className={`md-block-centered ${showLoader ? 'hidden' : ''}`}>
          <Autosuggest
            items={data}
            onSelect={container => history.push(`/details/${container.containerId}`)}
          />
          <DataTable plain>
            <TableHeader>
              <TableRow>
                <TableColumn>Container ID</TableColumn>
                <TableColumn className="md-text-center">Route</TableColumn>
                <TableColumn className="md-text-right">Status</TableColumn>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(({ containerId, departure, destination, status }) => (
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
  storeContainers: auth => dispatch(storeContainers(auth)),
});

export default connect(mapStateToProps, mapDispatchToProps)(ListPage);
