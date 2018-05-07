import React from 'react';
import { List, Subheader } from 'react-md';
import * as moment from 'moment';

const EventsList = ({ statuses }) => (
  <dix className="statusWrapper">
    {statuses.map(({ status, timestamp }) => (
      <div key={timestamp}>
        <p>{status}</p>
        <p>{moment(timestamp).format('MMMM Do @ LT')}</p>
      </div>
    ))}
  </div>
);

export default EventsList;
