import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import isEmpty from 'lodash-es/isEmpty';
import { FocusContainer, TextField, SelectField, Button, CardActions } from 'react-md';
import { toast } from 'react-toastify';
import Header from './Header';
import Notification from './Notification';
import { createNewChannel } from './mamFunctions.js';
import { addContainer } from './store/containers/actions';
import './CreateContainerPage.css';

const PORTS = ['Rotterdam', 'Singapore'];
const CARGO = ['Car', 'Consumer Goods', 'Heavy Machinery'];
const TYPE = ['Dry storage', 'Refrigerated'];

class CreateContainerPage extends Component {
  state = {
    showLoader: false,
    imoError: false,
    destinationError: false,
    departureError: false,
    cargoError: false,
    typeError: false,
  };

  componentDidMount() {
    const { auth, history } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    }
  }

  notifySuccess = message => toast.success(message);
  notifyError = message => toast.error(message);

  validate = () => {
    this.setState({
      imoError: !this.containerIMO.value,
      departureError: !this.containerDeparture.value,
      destinationError: !this.containerDestination.value,
      cargoError: !this.containerCargo.value,
      typeError: !this.containerType.value,
    });

    return (
      !this.containerIMO.value ||
      !this.containerDeparture.value ||
      !this.containerDestination.value ||
      !this.containerCargo.value ||
      !this.containerType.value ||
      this.containerDeparture.value === this.containerDestination.value
    );
  };

  createContainer = async event => {
    event.preventDefault();
    const formError = this.validate();

    if (!formError) {
      try {
        // Format the container ID to remove dashes and parens
        const containerId = this.containerIMO.value.replace(/[^0-9a-zA-Z_-]/g, '');

        // Create reference
        const containersRef = firebase.database().ref(`containers/${containerId}`);

        containersRef
          .once('value')
          .then(snapshot => {
            if (snapshot.val() === null) {
              this.setState({ showLoader: true });
              this.createContainerChannel(containerId, containersRef);
            } else {
              this.notifyError('Container exists');
            }
          })
          .catch(error => {
            this.setState({ showLoader: false });
            this.notifyError('Something went wrong');
          });
      } catch (error) {
        this.setState({ showLoader: false });
        this.notifyError(error);
      }
    } else {
      this.notifyError('Error with some of the input fields');
    }
  };

  createContainerChannel = (containerId, containersRef) => {
    const { name, previousEvent, mam } = this.props.auth;
    const request = {
      departure: this.containerDeparture.value,
      destination: this.containerDestination.value,
      load: this.containerCargo.value,
      type: this.containerType.value,
      shipper: name,
      status: previousEvent[0],
    };
    const promise = new Promise(async (resolve, reject) => {
      try {
        const { departure, destination, load, type, shipper, status } = request;

        const timestamp = Date.now();
        const channel = await createNewChannel(
          {
            containerId,
            departure,
            destination,
            load,
            shipper,
            type,
            timestamp,
            status,
            temperature: null,
            position: null,
            documents: [],
          },
          mam.secret_key
        );

        // Create a new container entry using that container ID
        await containersRef.set({
          containerId,
          timestamp,
          departure,
          destination,
          shipper,
          status,
          mam: {
            root: channel.root,
            seed: channel.state.seed,
            next: channel.state.channel.next_root,
            start: channel.state.channel.start,
          },
        });

        this.setState({ showLoader: true });
        await this.props.addContainer(containerId);

        return resolve(this.props.history.push(`/details/${containerId}`));
      } catch (error) {
        return reject(error);
      }
    });

    return promise;
  };

  render() {
    const {
      showLoader,
      imoError,
      departureError,
      destinationError,
      cargoError,
      typeError,
    } = this.state;
    return (
      <div>
        <Header>
          <div>
            <div>
              <a onClick={() => this.props.history.push('/')}>
                <img src="arrow_left.svg" alt="back" />
              </a>
              <span>Create new container</span>
            </div>
          </div>
        </Header>
        <div className="createContainerWrapper">
          <FocusContainer
            focusOnMount
            containFocus
            component="form"
            className="md-grid"
            onSubmit={this.createContainer}
            aria-labelledby="contained-form-example"
          >
            <TextField
              ref={imo => (this.containerIMO = imo)}
              id="containerIMO"
              label="Container IMO"
              required
              type="text"
              error={imoError}
              errorText="This field is required."
            />
            <SelectField
              ref={departure => (this.containerDeparture = departure)}
              id="containerDeparture"
              required
              label="Departure Port"
              className="md-cell"
              menuItems={PORTS}
              position={SelectField.Positions.BELOW}
              error={departureError}
              errorText="This field is required."
            />
            <SelectField
              ref={destination => (this.containerDestination = destination)}
              id="containerDestination"
              required
              label="Destination Port"
              className="md-cell"
              menuItems={PORTS}
              position={SelectField.Positions.BELOW}
              error={destinationError}
              errorText="This field is required."
            />
            <SelectField
              ref={cargo => (this.containerCargo = cargo)}
              id="containerCargo"
              required
              label="Cargo"
              className="md-cell"
              menuItems={CARGO}
              position={SelectField.Positions.BELOW}
              error={cargoError}
              errorText="This field is required."
            />
            <SelectField
              ref={type => (this.containerType = type)}
              id="containerType"
              label="Container type"
              required
              className="md-cell"
              menuItems={TYPE}
              position={SelectField.Positions.BELOW}
              error={typeError}
              errorText="This field is required."
            />
          </FocusContainer>
          <Notification />
          <div>
            <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
              <div />
              <div />
              <div />
            </div>
            <CardActions className={`md-cell md-cell--12 ${showLoader ? 'hidden' : ''}`}>
              <Button raised onClick={this.createContainer}>
                Create
              </Button>
            </CardActions>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

const mapDispatchToProps = dispatch => ({
  addContainer: containerId => dispatch(addContainer(containerId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateContainerPage));
