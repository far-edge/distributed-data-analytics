import axios from 'axios';

const agent = axios.create({
  baseURL: process.env.OPEN_API_FOR_ANALYTICS_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

let unauthorised = null;

const send = ({ method, url, data, params, token }) => {
  const headers = token ? {
    'Authorization': `Bearer ${token}`
  } : { };
  return agent.request({
    method,
    url,
    headers,
    data,
    params
  }).catch((error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx.
      throw new Error(error.response.data.error);
    } else if (error.request) {
      // eslint-disable-next-line no-console
      // The request was made but no response was received.
      throw new Error('OOPS');
    } else {
      console.error('Failed to send.', error);
      // Something happened in setting up the request that triggered an Error
      throw new Error('OOPS');
    }
  });
};

const bindUnauthorised = (cb) => {
  if (unauthorised) {
    agent.interceptors.response.eject(unauthorised);
  }
  unauthorised = agent.interceptors.response.use((response) => {
    return response;
  }, (error) => {
    if (error.response && error.response.status === 401) {
      cb(error);
    }
    return Promise.reject(error);
  });
};

export default {
  bindUnauthorised,
  send
};
