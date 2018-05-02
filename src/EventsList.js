import React, { Component } from 'react';
import { List, Subheader } from 'react-md';
import * as moment from 'moment';

class EventsList extends Component {
  render() {
    return (
      <List className="md-cell md-paper md-paper--1">
        <Subheader primaryText="Statuses" primary />
        {this.props.statuses.map(({ status, timestamp }) => (
          <div key={timestamp}>
            <p>{status}</p>
            <p>{moment(timestamp).format('MMMM Do @ LT')}</p>
          </div>
        ))}
      </List>
    );
  }
}

export default EventsList;
