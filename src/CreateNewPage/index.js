import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import { isEmpty } from 'lodash';
import { FocusContainer, TextField, SelectField, Button, CardActions, FontIcon } from 'react-md';
import { toast } from 'react-toastify';
import Loader from '../SharedComponents/Loader';
import Header from '../SharedComponents/Header';
import Notification from '../SharedComponents/Notification';
import { addContainer } from '../store/containers/actions';
import { storeContainer } from '../store/container/actions';
import { getFirebaseSnapshot } from '../utils/firebase';
import { createContainerChannel } from '../utils/mam';
import './styles.scss';

const PORTS = ['Rotterdam', 'Singapore'];
const CARGO = ['Car', 'Consumer Goods', 'Heavy Machinery', 'Pharma'];
const TYPE = ['Dry storage', 'Refrigerated'];

class CreateContainerPage extends Component {
  state = {
    showLoader: false,
    idError: false,
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
      idError: !this.containerId.value,
      departureError: !this.containerDeparture.value,
      destinationError: !this.containerDestination.value,
      cargoError: !this.containerCargo.value,
      typeError: !this.containerType.value,
    });

    return (
      !this.containerId.value ||
      !this.containerDeparture.value ||
      !this.containerDestination.value ||
      !this.containerCargo.value ||
      !this.containerType.value ||
      this.containerDeparture.value === this.containerDestination.value
    );
  };

  onError = error => {
    this.setState({ showLoader: false });
    this.notifyError(error || 'Something went wrong');
  };

  createContainer = async event => {
    event.preventDefault();
    const formError = this.validate();

    if (!formError) {
      const { id, previousEvent, mam } = this.props.auth;
      const request = {
        departure: this.containerDeparture.value,
        destination: this.containerDestination.value,
        load: this.containerCargo.value,
        type: this.containerType.value,
        shipper: id,
        status: previousEvent[0],
      };
      // Format the container ID to remove dashes and parens
      const containerId = this.containerId.value.replace(/[^0-9a-zA-Z_-]/g, '');
      const firebaseSnapshot = await getFirebaseSnapshot(containerId, this.onError);
      if (firebaseSnapshot === null) {
        this.setState({ showLoader: true });
        const eventBody = await createContainerChannel(containerId, request, mam.secret_key);

        await this.props.addContainer(containerId);
        await this.props.storeContainer([eventBody]);

        this.props.history.push(`/details/${containerId}`);
      } else {
        this.notifyError('Container exists');
      }
    } else {
      this.notifyError('Error with some of the input fields');
    }
  };

  render() {
    const {
      showLoader,
      idError,
      departureError,
      destinationError,
      cargoError,
      typeError,
    } = this.state;

    const selectFieldProps = {
      dropdownIcon: <FontIcon>expand_more</FontIcon>,
      position: SelectField.Positions.BELOW,
      required: true,
      className: 'md-cell',
      errorText: 'This field is required.',
    };
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
              ref={id => (this.containerId = id)}
              id="containerId"
              label="Container ID"
              required
              type="text"
              error={idError}
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
              dropdownIcon={<FontIcon>expand_more</FontIcon>}
            />
            <SelectField
              ref={destination => (this.containerDestination = destination)}
              id="containerDestination"
              label="Destination Port"
              menuItems={PORTS}
              error={destinationError}
              {...selectFieldProps}
            />
            <SelectField
              ref={cargo => (this.containerCargo = cargo)}
              id="containerCargo"
              label="Cargo"
              menuItems={CARGO}
              error={cargoError}
              {...selectFieldProps}
            />
            <SelectField
              ref={type => (this.containerType = type)}
              id="containerType"
              label="Container type"
              menuItems={TYPE}
              error={typeError}
              {...selectFieldProps}
            />
          </FocusContainer>
          <Notification />
          <div>
            <Loader showLoader={showLoader} />
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
  storeContainer: container => dispatch(storeContainer(container)),
});

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(CreateContainerPage));
