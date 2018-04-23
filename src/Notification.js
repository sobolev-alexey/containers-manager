import React from 'react';
import { ToastContainer } from 'react-toastify';

// https://fkhadra.github.io/react-toastify/
export default () => (
  <ToastContainer
    className="toast-container"
    bodyClassName="toast-body"
    autoClose={5000}
    hideProgressBar
    closeOnClick
    pauseOnVisibilityChange
    draggable
    pauseOnHover
  />
);
