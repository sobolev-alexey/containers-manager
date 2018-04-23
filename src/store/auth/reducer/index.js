import { AUTH } from '../../actionTypes';

export default (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
};
