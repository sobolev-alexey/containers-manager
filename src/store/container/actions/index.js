import { STORE_CONTAINER } from '../../actionTypes';

export const storeContainer = data => ({
  type: STORE_CONTAINER,
  payload: data,
});
