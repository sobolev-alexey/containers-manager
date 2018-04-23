import React from 'react';
import ReactDOM from 'react-dom';
import WebFontLoader from 'webfontloader';
import firebase from 'firebase';
import { BrowserRouter } from 'react-router-dom'
import './index.css';
import Router from './Router';
import config from './config.json';
import 'react-toastify/dist/ReactToastify.css';

WebFontLoader.load({
  google: {
    families: ['Roboto:300,400,500,700', 'Material Icons'],
  },
});

firebase.initializeApp(config);

const renderApp = () => (
  <BrowserRouter basename={process.env.PUBLIC_URL}>
    <Router />
  </BrowserRouter>
)

ReactDOM.render(renderApp(), document.getElementById('root'));
