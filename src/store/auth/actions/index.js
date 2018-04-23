import * as types from '../../actionTypes';

export const storeCredentials = data => ({
  type: types.AUTH,
  payload: data,
});
