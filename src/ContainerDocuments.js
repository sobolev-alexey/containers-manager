import React, { Component } from 'react';
import { DataTable, TableBody, TableRow, TableColumn, FontIcon } from 'react-md';

class ContainerDocuments extends Component {
  getDocumentIcon = doc => {
    // switch (auth.role) {
    //   case 'pdf':
    //
    //     break;
    //   case 'doc':
    //
    //     break;
    //   case 'xls':
    //
    //     break;
    //   default:
    //     return image;
    //     break;
    // }
  }

  render() {
    const { container } = this.props;

    return (
      <div className="containerDocuments">
        <DataTable plain>
          <TableBody>
            {container.documents.map(doc => (
              <TableRow key={doc.name}>
                <TableColumn>{this.getDocumentIcon(doc)}</TableColumn>
                <TableColumn>
                  <a href={doc.downloadURL} target="_blank">{doc.name}</a>
                </TableColumn>
                <TableColumn className="md-text-right">
                  {doc.hashMatch && doc.sizeMatch ? (
                    <FontIcon secondary>done</FontIcon>
                  ) : (
                    <FontIcon error>block</FontIcon>
                  )}
                </TableColumn>
              </TableRow>
            ))}
          </TableBody>
        </DataTable>
      </div>
    );
  }
}

export default ContainerDocuments;
