import React, { Component } from 'react';
import firebase from 'firebase';
import { FilePond, registerPlugin } from 'react-filepond';
import FilePondImagePreview from 'filepond-plugin-image-preview';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';

registerPlugin(FilePondImagePreview);

class FileUpload extends Component {
  state = {
    metadata: [],
  };

  // Params: see https://pqina.nl/filepond/docs/patterns/api/server/#advanced
  handleProcess = (fieldName, file, metadata, load, error, progress, abort) => {
    const storageRef = firebase.storage().ref(`${this.props.pathTofile}/${file.name}`);
    const task = storageRef.put(file);

    task.on(
      'state_changed',
      snapshot => {
        // Call the progress method to update the progress to 100% before calling load
        // API: progress(endlessMode, processedSize, totalSize)
        progress(true, snapshot.bytesTransferred, snapshot.totalBytes);
      },
      error => {
        error('Upload error');
      },
      () => {
        // Success
        const { state, metadata, downloadURL } = task.snapshot;

        // Call the load method when done and pass the returned server file id
        // The file is then marked as complete
        load(metadata.name);

        // Collect metadata
        const fileMetadata = {
          name: metadata.name,
          size: metadata.size,
          contentType: metadata.contentType,
          fullPath: metadata.fullPath,
          downloadURL: metadata.downloadURLs[0],
          md5Hash: metadata.md5Hash,
          timestamp: metadata.generation,
          created: metadata.timeCreated,
          updated: metadata.updated,
        };

        // Determine total number of files. Return once all files are processed
        this.setState({ metadata: [...this.state.metadata, fileMetadata] }, () => {
          const totalFiles = this.pond.getFiles().length;
          if (this.state.metadata.length === totalFiles) {
            this.props.uploadComplete(this.state.metadata);
          }
        });
      }
    );
  };

  render() {
    return (
      <FilePond
        ref={ref => (this.pond = ref)}
        allowMultiple={true}
        maxFiles={5}
        server={{ process: this.handleProcess }}
      />
    );
  }
}

export default FileUpload;
