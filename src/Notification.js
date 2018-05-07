import React from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './Notification.css';

// https://fkhadra.github.io/react-toastify/
export default () => (
  <ToastContainer
    className="toast-container"
    bodyClassName="toast-body"
    position="top-center"
    autoClose={5000000}
    hideProgressBar
    closeOnClick
    pauseOnVisibilityChange
    draggable={false}
    pauseOnHover
  />
);
