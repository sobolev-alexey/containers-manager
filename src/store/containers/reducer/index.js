import isEmpty from 'lodash-es/isEmpty';
import { STORE_CONTAINERS } from '../../actionTypes';

export default (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case STORE_CONTAINERS:
      return [...payload.filter(data => !isEmpty(data))];
    default:
      return state;
  }
};
