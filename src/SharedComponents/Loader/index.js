import React from 'react';
import './styles.scss';

export default ({ showLoader }) => (
  <div className={`bouncing-loader ${showLoader ? 'visible' : ''}`}>
    <div />
    <div />
    <div />
  </div>
);
