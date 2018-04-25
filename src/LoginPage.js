import React, { Component } from 'react';
import { sha256 } from 'js-sha256';
import { connect } from 'react-redux';
import { TextField, SelectField, Button } from 'react-md';
import { toast } from 'react-toastify';
import { storeCredentials } from './store/auth/actions';
import Notification from './Notification';
import api from './api';
import config from './config.json';

const ROLES = ['Shipper', 'Forwarder', 'Customs', 'Port', 'Observer'];

class LoginPage extends Component {
  state = {
    showLoader: false,
  };

  login = event => {
    event.preventDefault();
    if (!this.username.value) return;

    const username = this.username.value.toLowerCase();
    const password = sha256(this.username.value.toLowerCase());

    this.setState({ showLoader: true });

    api
      .post(`${config.rootURL}/login`, { username, password })
      .then(response => {
        console.log('Response success', response.data);
        this.props.storeCredentials(response.data);
        this.props.history.push('/');
      })
      .catch(error => {
        console.log('Response error', error.response);
        this.setState({ showLoader: false });
        toast.error(
          error.response && error.response.data && error.response.data.error
            ? error.response.data.error
            : 'Authentication error'
        );
      });
  };

  render() {
    const { showLoader } = this.state;
    return (
      <form onSubmit={this.login}>
        <h3>Login</h3>
        <div className="md-grid">
          <SelectField
            ref={username => (this.username = username)}
            id="username"
            required
            placeholder="Select role"
            className="md-cell"
            menuItems={ROLES}
            position={SelectField.Positions.BELOW}
          />
          <TextField
            ref={password => (this.password = password)}
            id="password"
            label="Enter your password"
            type="password"
            required
            className="md-cell md-cell--bottom"
          />
        </div>
        <div>
          <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
            <div />
            <div />
            <div />
          </div>
          <Button raised onClick={this.login} className={showLoader ? 'hidden' : ''}>
            Login
          </Button>
        </div>
        <Notification />
      </form>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  storeCredentials: credentials => dispatch(storeCredentials(credentials)),
});

export default connect(null, mapDispatchToProps)(LoginPage);
