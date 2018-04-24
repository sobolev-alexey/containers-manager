import { combineReducers } from 'redux';
import auth from './auth/reducer';
import container from './container/reducer';
import containers from './containers/reducer';

const rootReducer = combineReducers({
  auth,
  container,
  containers,
});

export default rootReducer;
