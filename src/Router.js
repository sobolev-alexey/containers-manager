import React from 'react';
import { Provider } from 'react-redux';
import { HashRouter, Route } from 'react-router-dom';
import configureStore from './store/configure';
import ListPage from './ListPage';
import DetailsPage from './DetailsPage';
import LoginPage from './LoginPage';
import CreateNewPage from './CreateNewPage';
import IntroPage from './IntroPage';

const store = configureStore();

const Router = () => (
  <Provider store={store}>
    <HashRouter>
      <div>
        <Route path="/" component={IntroPage} exact />
        <Route path="/list" component={ListPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/new" component={CreateNewPage} />
        <Route path="/details/:itemId" component={DetailsPage} />
      </div>
    </HashRouter>
  </Provider>
);

export default Router;
