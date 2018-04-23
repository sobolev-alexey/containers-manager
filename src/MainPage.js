import React, { Component } from 'react';
import firebase from 'firebase';
import { connect } from 'react-redux';
import { Button } from 'react-md';
import isEmpty from 'lodash-es/isEmpty';
// import upperFirst from 'lodash-es/upperFirst';
import './MainPage.css';

class MainPage extends Component {
  componentDidMount() {
    const { auth, history } = this.props;
    if (isEmpty(auth)) {
      history.push('/login');
    }
  }

  render() {
    return (
      <div className="App">
        <Button raised onClick={() => this.props.history.push('/new')}>Create new container</Button>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
});

export default connect(mapStateToProps)(MainPage);
