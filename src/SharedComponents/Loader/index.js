import React, { Component } from 'react';
import './styles.css';

class Loader extends Component {
  render() {
    return (
      <div className={`bouncing-loader ${this.props.showLoader ? 'visible' : ''}`}>
        <div />
        <div />
        <div />
      </div>
    );
  }
}

export default Loader;
