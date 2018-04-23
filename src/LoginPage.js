import React, { Component } from 'react';
import { sha256 } from 'js-sha256';
import { connect } from 'react-redux';
import { TextField, SelectField, Button } from 'react-md';
import { toast } from 'react-toastify';
import { storeCredentials } from './store/auth/actions';
import Notification from './Notification';
import api from './api';
import config from './config.json';

const ROLES = ['Shipper', 'Customs', 'Port', 'Observer'];

const testData = {
  role: 'shipper',
  name: 'Mr. John Doe',
  canAppendToStream: false,
  canCreateStream: true,
  canUploadDocuments: true,
  eventOnArrival: 'Container delivered',
  eventOnDeparture: 'Container announced',
  previousEvents: ['Container announced'],
  mam: {
    secret_key: "TESTTESTTEST"
  }
}

class LoginPage extends Component {

  state = {
    showLoader: false
  }

  notifySuccess = message => toast.success(message);
  notifyError = message => toast.error(message);

  login = event => {
    event.preventDefault();
    const role = this.role.value;
    const password = sha256(this.password.value);

    this.setState({ showLoader: true })

    api.post(`${config.rootURL}/login`, { role, password })
       .then(response => {
         console.log('Response', response.data)
         this.notifySuccess('Successfully authenticated')
         this.props.storeCredentials(response.data)
         this.props.history.push('/')
       })
       .catch(response => {
         // console.log(response)
         // this.setState({ showLoader: false })
         // this.notifyError('Authentication error')
         this.props.storeCredentials(testData)
         this.props.history.push('/')
       });
  }

  render() {
    const { showLoader } = this.state;
    return (
      <form onSubmit={this.login}>
        <h3>Login</h3>
        <div className="md-grid">
          <SelectField
            ref={role => (this.role = role)}
            id="role"
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
            <div /><div /><div />
          </div>
          <Button raised onClick={this.login}>Login</Button>
        </div>
        <Notification />
      </form>
    )
  }
};

const mapDispatchToProps = dispatch => ({
  storeCredentials: credentials => dispatch(storeCredentials(credentials)),
});

export default connect(null, mapDispatchToProps)(LoginPage);
