import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { sha256 } from 'js-sha256';
import axios from 'axios';
import Notification from './Notification';

class DocumentIntegrityValidator extends Component {
  notifySuccess = message => toast.success(message);
  notifyError = message => toast.error(message);

  validate = (path, metadata) => {
    axios
      .get(path, { responseType: 'blob' })
      .then(response => {
        console.log(response.headers);

        const reader = new FileReader();
        reader.readAsArrayBuffer(response.data);
        reader.onload = function() {
          const arrayBuffer = reader.result;
          const hash = sha256(arrayBuffer);
          console.log(hash);
        };
      })
      .catch(error => {
        console.log(error);
      });
  };

  render() {
    const { path, metadata } = this.props;

    const validateFile = this.validate(path, metadata);
    return <div>ok</div>;
  }
}

export default DocumentIntegrityValidator;
