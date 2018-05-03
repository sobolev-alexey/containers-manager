import React from 'react';
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom';
import configureStore from './store/configure';
import MainPage from './MainPage';
import DetailsPage from './DetailsPage';
import LoginPage from './LoginPage';
import CreateContainerPage from './CreateContainerPage';

const store = configureStore();

const Router = () => (
  <Provider store={store}>
    <Switch>
      <Route path="/" component={MainPage} exact />
      <Route path="/details/:containerId" component={DetailsPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/new" component={CreateContainerPage} />
      <Route component={MainPage} />
    </Switch>
  </Provider>
);

export default Router;
