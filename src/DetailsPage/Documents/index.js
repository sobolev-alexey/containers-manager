import React, { Component } from 'react';
import { connect } from 'react-redux';
import isEmpty from 'lodash/isEmpty';
import { DataTable, TableBody, TableRow, TableColumn, FontIcon } from 'react-md';
import FilesUpload from './FilesUpload';
import { validateIntegrity } from './DocumentIntegrityValidator';
import '../../assets/scss/documents.scss';

class Documents extends Component {
  state = {
    documents: null,
  };

  async componentDidMount() {
    const { item } = this.props;
    if (!isEmpty(item)) {
      console.log(555, item);

      item.documents.forEach(async document => {
        const res = await validateIntegrity(document)
        console.log(777, res);
      });

      // this.setState({
      //   documents
      // }, () => console.log(444, this.state.documents));
    }
  }

  getDocumentIcon = doc => {
    switch (doc.contentType) {
      case 'application/pdf':
        return 'pdf';
      case 'application/msword':
      case 'application/vnd.openxmlformats-officedocument.wordprocessingml.document':
      case 'application/x-iwork-pages-sffpages':
        return 'doc';
      case 'application/vnd.ms-excel':
      case 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet':
      case 'application/x-iwork-keynote-sffnumbers':
        return 'excel';
      default:
        return 'img';
    }
  };

  render() {
    const {
      item,
      fileUploadEnabled,
      onUploadComplete,
      user,
      project: { documentStorage, trackingUnit }
    } = this.props;

    // const documents =item.documents;

    // console.log(222, item.documents);

    return (
      <div className="documents-wrapper">
        <DataTable plain>
          <TableBody>
            {item.documents.map(doc => (
              <TableRow key={doc.name}>
                <TableColumn>
                  <a
                    className={`icon ${this.getDocumentIcon(doc)}`}
                    href={doc.downloadURL}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {doc.name} 1:{doc.hashMatch} 2:{doc.sizeMatch}
                    {
                        // console.log(333, doc, doc.md5Hash, doc.size, doc.hashMatch, doc.sizeMatch, doc.hashMatch && doc.sizeMatch)
                    }
                  </a>
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
        {documentStorage && fileUploadEnabled && user.canUploadDocuments ? (
          <FilesUpload
            uploadComplete={onUploadComplete}
            pathTofile={`${trackingUnit.replace(/\s/g, '')}/${item.itemId}`}
            existingDocuments={item.documents}
          />
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  project: state.project,
  user: state.user
});

export default connect(mapStateToProps)(Documents);
