import { AUTH } from '../../actionTypes';

export const storeCredentials = data => ({
  type: AUTH,
  payload: data,
});
