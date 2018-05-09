import { AUTH, LOGOUT } from '../../actionTypes';

export const storeCredentials = data => ({
  type: AUTH,
  payload: data,
});

export const logout = () => ({
  type: LOGOUT,
});
