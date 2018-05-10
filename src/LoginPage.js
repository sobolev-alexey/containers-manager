import React, { Component } from 'react';
import { sha256 } from 'js-sha256';
import { connect } from 'react-redux';
import { TextField, SelectField, Button } from 'react-md';
import { toast } from 'react-toastify';
import { storeCredentials } from './store/auth/actions';
import Logo from './Logo';
import Notification from './Notification';
import api from './api';
import config from './config.json';
import './LoginPage.css';

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
        this.props.storeCredentials(response.data);
        this.props.history.push('/');
      })
      .catch(error => {
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
      <div className="wrapper">
        <div className="graphic">
          <img src="bg_login_page.png" alt="background" />
          <div className="welcome">
            <Logo />
            <p>Welcome back!</p>
            <p>
              Login to access<br />container tracking
            </p>
          </div>
        </div>
        <div className="login">
          <form onSubmit={this.login}>
            <h3>Login</h3>
            <SelectField
              ref={username => (this.username = username)}
              id="username"
              required
              simplifiedMenu
              className="md-cell"
              placeholder="Select role"
              menuItems={ROLES}
              position={SelectField.Positions.BELOW}
            />
            <TextField
              ref={password => (this.password = password)}
              id="password"
              label="Enter password"
              type="password"
              required
            />
            <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
              <div />
              <div />
              <div />
            </div>
            <Button raised onClick={this.login} className={showLoader ? 'hidden' : ''}>
              Login
            </Button>
            <Notification />
          </form>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = dispatch => ({
  storeCredentials: credentials => dispatch(storeCredentials(credentials)),
});

export default connect(null, mapDispatchToProps)(LoginPage);
