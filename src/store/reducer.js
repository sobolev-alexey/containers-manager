import { combineReducers } from 'redux';
import auth from './auth/reducer';
import containers from './containers/reducer';

const rootReducer = combineReducers({
  auth,
  containers,
});

export default rootReducer;
