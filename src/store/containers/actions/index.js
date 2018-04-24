import { STORE_CONTAINERS } from '../../actionTypes';

export const storeContainers = data => ({
  type: STORE_CONTAINERS,
  payload: data,
});
