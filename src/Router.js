import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import configureStore from './store/configure';
import ListPage from './ListPage';
import DetailsPage from './DetailsPage';
import LoginPage from './LoginPage';
import CreateNewPage from './CreateNewPage';

const store = configureStore();

const Router = () => (
  <Provider store={store}>
    <BrowserRouter>
      <div>
        <Route path="/" component={ListPage} exact />
        <Route path="/login" component={LoginPage} />
        <Route path="/new" component={CreateNewPage} />
        <Route path="/details/:itemId" component={DetailsPage} />
      </div>
    </BrowserRouter>
  </Provider>
);

export default Router;
