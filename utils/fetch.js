const axios = require('axios');

let instance = axios.create();

instance.interceptors.request.use(
  function(config) {
    return config;
  },
  function(error) {
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  function(response) {
    return response;
  },
  function(error) {
    return Promise.reject(error);
  }
);

const http = {
  get(url, data) {
    return instance.get(url, { params: data });
  },
  post(url, data) {
    return instance.get(url, data);
  },
  put(url, data) {
    return instance.get(url, data);
  },
  delete(url, data) {
    return instance.get(url, { params: data });
  }
};

module.exports = http;
