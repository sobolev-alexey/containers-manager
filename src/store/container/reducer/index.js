import { STORE_CONTAINER } from '../../actionTypes';

export default (state = [], action) => {
  const { type, payload } = action;

  switch (type) {
    case STORE_CONTAINER:
      return [...state, payload];
    default:
      return state;
  }
};
