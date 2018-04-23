import axios from 'axios';

const headers = {
  'Content-Type': 'application/json',
};

const parseSettings = ({ method, data, headers } = {}) => ({
  method,
  data: data ? JSON.stringify(data) : undefined,
  headers,
});

const request = async (endpoint, { params, ...settings } = {}) => {
  const response = await axios(endpoint, parseSettings(settings));
  return response;
};

export default {
  get: (endpoint, settings) => {
    return request(endpoint, { method: 'get', headers, ...settings });
  },
  post: (endpoint, data, settings) => {
    return request(endpoint, {
      method: 'post', headers, data, ...settings,
    });
  },
};
