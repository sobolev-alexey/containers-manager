import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { AppContainer } from 'react-hot-loader';
import WebFontLoader from 'webfontloader';
import firebase from 'firebase';
import Router from 'components/Router';
import './assets/scss/index.scss';
import config from './config.json';

const rootEl = document.getElementById('root');

const renderComponent = Component => {
  ReactDOM.render(
    <AppContainer>
      <BrowserRouter basename={process.env.PUBLIC_URL}>
        <Component />
      </BrowserRouter>
    </AppContainer>,
    rootEl
  );
};

WebFontLoader.load({
  google: {
    families: ['Nunito Sans:300,400,600,700', 'Material Icons'],
  },
});

firebase.initializeApp(config);

renderComponent(Router);

// Hot Module Replacement API
if (module.hot) {
  module.hot.accept('./components/Router', () => {
    renderComponent(Router);
  });
}
