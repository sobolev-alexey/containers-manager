import { handle } from 'redux-pack';
import { isEmpty } from 'lodash';
import { ADD_CONTAINER, STORE_CONTAINERS } from '../../actionTypes';

const initialState = {
  data: [],
  error: null,
};

export default (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case STORE_CONTAINERS:
      if (isEmpty(payload)) return state;
      return handle(state, action, {
        success: prevState => {
          return {
            data: [...payload.data],
            error: null,
          };
        },
        failure: prevState => {
          return {
            data: prevState.data,
            error: payload.error,
          };
        },
      });
    case ADD_CONTAINER:
      if (isEmpty(payload)) return state;
      return handle(state, action, {
        success: prevState => {
          return {
            data: [...prevState.data, payload],
            error: null,
          };
        },
        failure: prevState => {
          return {
            data: prevState.data,
            error: 'Loading containers failed',
          };
        },
      });
    default:
      return state;
  }
};
