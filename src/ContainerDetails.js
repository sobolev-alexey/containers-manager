import React, { Component } from 'react';
import { List, Subheader, FontIcon } from 'react-md';

const style = {
  color: '#f06292', // $md-pink-300
};

class ContainerDetails extends Component {
  render() {
    const { container, updated } = this.props;

    return (
      <List className="md-cell md-paper md-paper--1">
        <Subheader primaryText="Container data" primary />
        <div>
          <p>Container IMO: {container.containerId}</p>
          <p>Updated: {updated} ago</p>
          <p>Shipper: {container.shipper}</p>
          <p>Load: {container.load}</p>
          <p>Type: {container.type}</p>
          <p>Status: {container.status}</p>
          <p>
            Route: {container.departure} &rarr; {container.destination}
          </p>
          <div>
            Documents:{' '}
            {container.documents.map(doc => (
              <div key={doc.name}>
                <a href={doc.downloadURL} target="_blank">
                  {doc.name}
                </a>
                {doc.hashMatch && doc.sizeMatch ? (
                  <FontIcon secondary>done</FontIcon>
                ) : (
                  <FontIcon error>block</FontIcon>
                )}
              </div>
            ))}
          </div>
        </div>
      </List>
    );
  }
}

export default ContainerDetails;
