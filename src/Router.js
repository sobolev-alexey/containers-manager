import React from 'react'
import { Provider } from 'react-redux';
import { Switch, Route } from 'react-router-dom'
import configureStore from './store/configure';
import MainPage from './MainPage'
import DetailsPage from './DetailsPage'
import LoginPage from './LoginPage'
import ErrorPage from './ErrorPage'
import ContainerPage from './ContainerPage'

const store = configureStore();

const Router = () =>
  <Provider store={store}>
    <Switch>
      <Route path="/" component={MainPage} exact />
      <Route path="/details" component={DetailsPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/error" component={ErrorPage} />
      <Route path="/new" component={ContainerPage} />
      <Route path="/update" component={ContainerPage} />
      <Route component={MainPage} />
    </Switch>
  </Provider>

export default Router
