import React from 'react';
import * as moment from 'moment';
import './ContainerDetails.css';

const ContainerDetails = ({ container }) => {
  const updated = container ? moment.duration(Date.now() - container.timestamp).humanize() : '';

  return (
    <div className="detailSectionWrapper">
      <div className="detailsSection">
        <span className="label">Shipper</span>
        <span className="value">{container.shipper}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Container IMO</span>
        <span className="value">{container.containerId}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Status</span>
        <span className="value">{container.status}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Load</span>
        <span className="value">{container.load}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Type</span>
        <span className="value">{container.type}</span>
      </div>
      <div className="detailsSection">
        <span className="label">Updated</span>
        <span className="value">{updated}</span>
      </div>
    </div>
  );
};

export default ContainerDetails;
