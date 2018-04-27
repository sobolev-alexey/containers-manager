import React, { Component } from 'react';
import { toast } from 'react-toastify';
import { sha256 } from 'js-sha256';
import api from './api';
import Notification from './Notification';

class DocumentIntegrityValidator extends Component {
  notifySuccess = message => toast.success(message);
  notifyError = message => toast.error(message);

  validate = (path, metadata) => {
    const request = new XMLHttpRequest();
    request.open('GET', path, true);
    request.responseType = 'blob';
    request.onload = function() {
      const reader = new FileReader();

      reader.readAsArrayBuffer(request.response);
      reader.onload = function(e) {
        const arrayBuffer = reader.result;
        const hash = sha256(arrayBuffer);
      };
    };
    request.send();
  };

  render() {
    const { path, metadata } = this.props;
    console.log('metadata', metadata);

    const validateFile = this.validate(path, metadata);
    return <div>ok</div>;
  }
}

export default DocumentIntegrityValidator;
