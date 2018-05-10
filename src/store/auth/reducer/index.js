import { AUTH, LOGOUT } from '../../actionTypes';

export default (state = {}, action) => {
  const { type, payload } = action;

  switch (type) {
    case AUTH:
      return {
        ...state,
        ...payload,
      };
    case LOGOUT:
      return {};
    default:
      return state;
  }
};
